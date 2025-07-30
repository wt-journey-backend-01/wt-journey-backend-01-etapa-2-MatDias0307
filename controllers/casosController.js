const casosRepository = require("../repositories/casosRepository");
const { v4: uuidv4 } = require('uuid');

function validateCaso(caso, isUpdate = false) {
    const errors = [];
    
    if (!isUpdate && !caso.titulo) {
        errors.push("O campo 'titulo' é obrigatório");
    }
    
    if (!isUpdate && !caso.descricao) {
        errors.push("O campo 'descricao' é obrigatório");
    }
    
    if (!isUpdate && !caso.status) {
        errors.push("O campo 'status' é obrigatório");
    } else if (caso.status && !['aberto', 'solucionado'].includes(caso.status)) {
        errors.push("O campo 'status' pode ser somente 'aberto' ou 'solucionado'");
    }
    
    if (!isUpdate && !caso.agente_id) {
        errors.push("O campo 'agente_id' é obrigatório");
    }
    
    return errors;
}

function getAllCasos(req, res) {
    try {
        const { agente_id, status, q } = req.query;
        
        let casos;
        if (agente_id) {
            casos = casosRepository.findByAgenteId(agente_id);
        } else if (status) {
            casos = casosRepository.findByStatus(status);
        } else if (q) {
            casos = casosRepository.searchByText(q);
        } else {
            casos = casosRepository.findAll();
        }
        
        res.json(casos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function getCasoById(req, res) {
    try {
        const caso = casosRepository.findById(req.params.id);
        if (caso) {
            if (req.query.agente_id) {
                const agente = require('../repositories/agentesRepository').findById(caso.agente_id);
                res.json({ ...caso, agente });
            } else {
                res.json(caso);
            }
        } else {
            res.status(404).json({ message: "Caso não encontrado" });
        }
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