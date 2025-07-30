const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");

function validateCaso(caso, isUpdate = false) {
    const errors = [];

    if (!isUpdate) {
        if (!caso.titulo) errors.push("O campo 'titulo' é obrigatório");
        if (!caso.descricao) errors.push("O campo 'descricao' é obrigatório");
        if (!caso.status) errors.push("O campo 'status' é obrigatório");
        if (!caso.agente_id) errors.push("O campo 'agente_id' é obrigatório");
    }

    if (caso.agente_id && !isValidUUID(caso.agente_id)) {
        errors.push("O campo 'agente_id' deve ser um UUID válido");
    }

    if (caso.status && !['aberto', 'solucionado'].includes(caso.status)) {
        errors.push("O campo 'status' pode ser somente 'aberto' ou 'solucionado'");
    }

    if (caso.titulo && typeof caso.titulo !== "string") {
        errors.push("O campo 'titulo' deve ser uma string");
    }
    if (caso.descricao && typeof caso.descricao !== "string") {
        errors.push("O campo 'descricao' deve ser uma string");
    }

    return errors;
}

function validateCasoPartial(caso) {
    const errors = [];

    if (Object.keys(caso).length === 0) {
        errors.push("Payload não pode estar vazio");
        return errors;
    }

    if (caso.status && !['aberto', 'solucionado'].includes(caso.status)) {
        errors.push("O campo 'status' pode ser somente 'aberto' ou 'solucionado'");
    }

    if (caso.titulo && typeof caso.titulo !== "string") {
        errors.push("O campo 'titulo' deve ser uma string");
    }

    if (caso.descricao && typeof caso.descricao !== "string") {
        errors.push("O campo 'descricao' deve ser uma string");
    }

    if (caso.agente_id && typeof caso.agente_id !== "string") {
        errors.push("O campo 'agente_id' deve ser uma string");
    }

    return errors;
}

function getAllCasos(req, res) {
    try {
        const { agente_id, status, q } = req.query;
        
        if (status && !['aberto', 'solucionado'].includes(status.toLowerCase())) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: ["O parâmetro 'status' deve ser 'aberto' ou 'solucionado'"]
            });
        }

        if (agente_id && !isValidUUID(agente_id)) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: ["O parâmetro 'agente_id' deve ser um UUID válido"]
            });
        }

        let casos = casosRepository.findAll();

        if (agente_id) {
            casos = casosRepository.findByAgenteId(agente_id);
            if (casos.length === 0) {
                return res.status(404).json({
                    status: 404,
                    message: "Nenhum caso encontrado para o agente especificado"
                });
            }
        }
        
        if (status) {
            casos = casosRepository.findByStatus(status, casos);
        }
        
        if (q) {
            casos = casosRepository.searchByText(q, casos);
            if (casos.length === 0) {
                return res.status(404).json({
                    status: 404,
                    message: "Nenhum caso encontrado para o termo de busca especificado"
                });
            }
        }

        res.json(casos);
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: "Erro interno no servidor",
            error: error.message 
        });
    }
}

function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}

function getCasoById(req, res) {
    try {
        const caso = casosRepository.findById(req.params.id);
        if (!caso) {
            return res.status(404).json({ message: "Caso não encontrado" });
        }

        if (req.query.includeAgente === 'true') {
            const agente = agentesRepository.findById(caso.agente_id);
            return res.json({ ...caso, agente });
        }

        res.json(caso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function createCaso(req, res) {
    try {
        const errors = validateCaso(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ 
                status: 400,
                message: "Parâmetros inválidos",
                errors
            });
        }

        const agenteExiste = agentesRepository.findById(req.body.agente_id);
        if (!agenteExiste) {
            return res.status(404).json({
                status: 404,
                message: "Agente não encontrado",
                errors: ["O agente_id fornecido não existe"]
            });
        }

        const novoCaso = casosRepository.create(req.body);
        res.status(201).json(novoCaso);
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: "Erro ao criar caso",
            error: error.message 
        });
    }
}

function updateCaso(req, res) {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Payload não pode estar vazio"
            });
        }

        if (req.body.id) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: ["O campo 'id' não pode ser alterado"]
            });
        }

        const errors = validateCaso(req.body, false);
        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors
            });
        }

        if (req.body.agente_id) {
            if (!agentesRepository.findById(req.body.agente_id)) {
                return res.status(404).json({
                    status: 404,
                    message: "Agente não encontrado"
                });
            }
        }

        const casoAtualizado = casosRepository.update(req.params.id, req.body);
        if (casoAtualizado) {
            res.json(casoAtualizado);
        } else {
            res.status(404).json({ message: "Caso não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function patchCaso(req, res) {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Payload não pode estar vazio"
            });
        }

        if (req.body.id) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: ["O campo 'id' não pode ser alterado"]
            });
        }

        const errors = validateCasoPartial(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors
            });
        }

        const casoAtualizado = casosRepository.update(req.params.id, req.body);
        res.json(casoAtualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function deleteCaso(req, res) {
    try {
        const casoExistente = casosRepository.findById(req.params.id);
        if (!casoExistente) {
            return res.status(404).json({ message: "Caso não encontrado" });
        }

        casosRepository.remove(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllCasos,
    getCasoById,
    createCaso,
    updateCaso,
    patchCaso,
    deleteCaso
};