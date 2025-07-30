const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");
const { v4: uuidv4 } = require('uuid');

function validateCaso(caso, isUpdate = false) {
    const errors = [];

    if (!isUpdate) {
        if (!caso.titulo) errors.push("O campo 'titulo' é obrigatório");
        if (!caso.descricao) errors.push("O campo 'descricao' é obrigatório");
        if (!caso.status) errors.push("O campo 'status' é obrigatório");
        if (!caso.agente_id) errors.push("O campo 'agente_id' é obrigatório");
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
        
        let casos = casosRepository.findAll();

        if (agente_id) {
            casos = casos.filter(caso => caso.agente_id === agente_id);
        }

        if (status) {
            casos = casos.filter(caso => caso.status.toLowerCase() === status.toLowerCase());
        }

        if (q) {
            const lowerQ = q.toLowerCase();
            casos = casos.filter(caso =>
                (caso.titulo && caso.titulo.toLowerCase().includes(lowerQ)) ||
                (caso.descricao && caso.descricao.toLowerCase().includes(lowerQ))
            );
        }

        res.json(casos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
            return res.status(404).json({ message: "Agente não encontrado para o agente_id fornecido" });
        }

        const novoCaso = { id: uuidv4(), ...req.body };
        casosRepository.create(novoCaso);
        res.status(201).json(novoCaso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function updateCaso(req, res) {
    try {
        const errors = validateCaso(req.body, true);
        if (errors.length > 0) {
            return res.status(400).json({ 
                status: 400,
                message: "Parâmetros inválidos",
                errors
            });
        }

        if (req.body.agente_id) {
            const agenteExiste = agentesRepository.findById(req.body.agente_id);
            if (!agenteExiste) {
                return res.status(404).json({ message: "Agente não encontrado para o agente_id fornecido" });
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
        const casoExistente = casosRepository.findById(req.params.id);
        if (!casoExistente) {
            return res.status(404).json({ message: "Caso não encontrado" });
        }

        const errors = validateCasoPartial(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ 
                status: 400,
                message: "Parâmetros inválidos",
                errors
            });
        }

        if (req.body.agente_id) {
            const agenteExiste = agentesRepository.findById(req.body.agente_id);
            if (!agenteExiste) {
                return res.status(404).json({ message: "Agente não encontrado para o agente_id fornecido" });
            }
        }

        const casoAtualizado = casosRepository.update(req.params.id, req.body);
        res.json(casoAtualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        const errors = validateCaso(req.body, true);
        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors
            });
        }

        if (req.body.agente_id) {
            const agenteExiste = agentesRepository.findById(req.body.agente_id);
            if (!agenteExiste) {
                return res.status(404).json({ message: "Agente não encontrado para o agente_id fornecido" });
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

module.exports = {
    getAllCasos,
    getCasoById,
    createCaso,
    updateCaso,
    patchCaso,
    deleteCaso
};