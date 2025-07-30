const { v4: uuidv4 } = require('uuid');

let agentes = [
    {
        id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
        nome: "Rommel Carneiro",
        dataDeIncorporacao: "1992-10-04",
        cargo: "delegado"
    },
    {
        id: "5b1ef5c9-8a9e-4e4a-8a1e-5b1ef5c98a9e",
        nome: "Ana Silva",
        dataDeIncorporacao: "2005-07-15",
        cargo: "inspetor"
    }
];

function findAll() {
    return agentes;
}

function findById(id) {
    return agentes.find(agente => agente.id === id);
}

function create(agente) {
    const { id: _, ...dados } = agente;
    const novoAgente = { id: uuidv4(), ...dados };
    agentes.push(novoAgente);
    return novoAgente;
}

function update(id, agenteAtualizado) {
    const index = agentes.findIndex(agente => agente.id === id);
    if (index !== -1) {
        const { id: _, ...dadosSemId } = agenteAtualizado;
        agentes[index] = { ...agentes[index], ...dadosSemId };
        return agentes[index];
    }
    return null;
}

function remove(id) {
    agentes = agentes.filter(agente => agente.id !== id);
}

function findByCargo(cargo, agentesList = agentes) {
    return agentesList.filter(agente => agente.cargo.toLowerCase() === cargo.toLowerCase());
}

function sortByIncorporacao(order = 'asc', agentesList = agentes) {
    return [...agentesList].sort((a, b) => {
        const dateA = new Date(a.dataDeIncorporacao);
        const dateB = new Date(b.dataDeIncorporacao);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
    findByCargo,
    sortByIncorporacao
};