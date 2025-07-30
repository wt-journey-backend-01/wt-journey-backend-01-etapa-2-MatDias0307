const agentesRepository = require("../repositories/agentesRepository");
const { v4: uuidv4 } = require('uuid');

function validateAgente(agente, isUpdate = false) {
    const errors = [];

    if (!isUpdate) {
        if (!agente.nome) errors.push("O campo 'nome' é obrigatório");
        if (!agente.dataDeIncorporacao) errors.push("O campo 'dataDeIncorporacao' é obrigatório");
        if (!agente.cargo) errors.push("O campo 'cargo' é obrigatório");
    }

    if (agente.dataDeIncorporacao) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(agente.dataDeIncorporacao)) {
            errors.push("Campo 'dataDeIncorporacao' deve seguir o formato 'YYYY-MM-DD'");
        } else {
            const data = new Date(agente.dataDeIncorporacao);
            const hoje = new Date();
            hoje.setHours(0,0,0,0);
            if (data > hoje) {
                errors.push("O campo 'dataDeIncorporacao' não pode ser uma data futura");
            }
        }
    }

    if (agente.nome && typeof agente.nome !== "string") {
        errors.push("Campo 'nome' deve ser uma string");
    }

    if (agente.cargo && typeof agente.cargo !== "string") {
        errors.push("Campo 'cargo' deve ser uma string");
    }

    return errors;
}

function validateAgentePartial(agente) {
    const errors = [];

    if (Object.keys(agente).length === 0) {
        errors.push("Payload não pode estar vazio");
        return errors;
    }

    if (agente.dataDeIncorporacao) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(agente.dataDeIncorporacao)) {
            errors.push("Campo 'dataDeIncorporacao' deve seguir o formato 'YYYY-MM-DD'");
        } else {
            const data = new Date(agente.dataDeIncorporacao);
            const hoje = new Date();
            hoje.setHours(0,0,0,0);
            if (data > hoje) {
                errors.push("O campo 'dataDeIncorporacao' não pode ser uma data futura");
            }
        }
    }

    if (agente.nome && typeof agente.nome !== "string") {
        errors.push("Campo 'nome' deve ser uma string");
    }

    if (agente.cargo && typeof agente.cargo !== "string") {
        errors.push("Campo 'cargo' deve ser uma string");
    }

    return errors;
}

function getAllAgentes(req, res) {
    try {
        const { cargo, sort } = req.query;
        let agentes = agentesRepository.findAll();

        if (cargo) {
            agentes = agentes.filter(agente => agente.cargo.toLowerCase() === cargo.toLowerCase());
        }

        if (sort) {
            const order = sort.startsWith('-') ? 'desc' : 'asc';
            agentes = agentes.sort((a, b) => {
                const dateA = new Date(a.dataDeIncorporacao);
                const dateB = new Date(b.dataDeIncorporacao);
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            });
        }

        res.json(agentes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function getAgenteById(req, res) {
    try {
        const agente = agentesRepository.findById(req.params.id);
        if (agente) {
            res.json(agente);
        } else {
            res.status(404).json({ message: "Agente não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function createAgente(req, res) {
    try {
        const errors = validateAgente(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ 
                status: 400,
                message: "Parâmetros inválidos",
                errors
            });
        }

        const novoAgente = { id: uuidv4(), ...req.body };
        agentesRepository.create(novoAgente);
        res.status(201).json(novoAgente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function updateAgente(req, res) {
    try {
        const errors = validateAgente(req.body, true);
        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors
            });
        }

        const agenteAtualizado = agentesRepository.update(req.params.id, req.body);
        if (agenteAtualizado) {
            res.json(agenteAtualizado);
        } else {
            res.status(404).json({ message: "Agente não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function patchAgente(req, res) {
    try {
        const agenteExistente = agentesRepository.findById(req.params.id);
        if (!agenteExistente) {
            return res.status(404).json({ message: "Agente não encontrado" });
        }

        const errors = validateAgentePartial(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors
            });
        }

        const agenteAtualizado = agentesRepository.update(req.params.id, req.body);
        res.json(agenteAtualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function deleteAgente(req, res) {
    try {
        const agenteExistente = agentesRepository.findById(req.params.id);
        if (!agenteExistente) {
            return res.status(404).json({ message: "Agente não encontrado" });
        }

        agentesRepository.remove(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    patchAgente,
    deleteAgente
};