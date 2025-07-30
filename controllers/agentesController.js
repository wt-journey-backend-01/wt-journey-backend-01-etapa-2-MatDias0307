const agentesRepository = require("../repositories/agentesRepository");
const { v4: uuidv4 } = require('uuid');

function validateAgente(agente, isUpdate = false) {
    const errors = [];
    
    if (!isUpdate && !agente.nome) {
        errors.push("O campo 'nome' é obrigatório");
    }
    
    if (!isUpdate && !agente.dataDeIncorporacao) {
        errors.push("O campo 'dataDeIncorporacao' é obrigatório");
    } else if (agente.dataDeIncorporacao && !/^\d{4}-\d{2}-\d{2}$/.test(agente.dataDeIncorporacao)) {
        errors.push("Campo 'dataDeIncorporacao' deve seguir o formato 'YYYY-MM-DD'");
    }
    
    if (!isUpdate && !agente.cargo) {
        errors.push("O campo 'cargo' é obrigatório");
    }
    
    return errors;
}

function getAllAgentes(req, res) {
    try {
        const { cargo, sort } = req.query;
        
        let agentes;
        if (cargo) {
            agentes = agentesRepository.findByCargo(cargo);
        } else if (sort) {
            const order = sort.startsWith('-') ? 'desc' : 'asc';
            agentes = agentesRepository.sortByIncorporacao(order);
        } else {
            agentes = agentesRepository.findAll();
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