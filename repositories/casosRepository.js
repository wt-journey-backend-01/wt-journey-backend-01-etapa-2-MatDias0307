const { v4: uuidv4 } = require('uuid');

let casos = [
    {
        id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
        titulo: "homicidio",
        descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: "aberto",
        agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1" 
    },
    {
        id: "9c4d6a8b-3e2f-4a7c-9d1b-0f5e8d3c2a1b",
        titulo: "roubo a banco",
        descricao: "Assaltantes heavily armed roubaram o banco central na manhã de segunda-feira.",
        status: "solucionado",
        agente_id: "5b1ef5c9-8a9e-4e4a-8a1e-5b1ef5c98a9e"
    }
];

function findAll() {
    return casos;
}

function findById(id) {
    return casos.find(caso => caso.id === id);
}

function create(caso) {
    const { id: _, ...dados } = caso;
    const novoCaso = { id: uuidv4(), ...dados };
    casos.push(novoCaso);
    return novoCaso;
}

function update(id, casoAtualizado) {
    const index = casos.findIndex(caso => caso.id === id);
    if (index !== -1) {
        const { id: _, ...dadosSemId } = casoAtualizado;
        casos[index] = { ...casos[index], ...dadosSemId };
        return casos[index];
    }
    return null;
}

function remove(id) {
    casos = casos.filter(caso => caso.id !== id);
}

function findByAgenteId(agente_id, casosList = casos) {
    return casosList.filter(caso => caso.agente_id === agente_id);
}

function findByStatus(status, casosList = casos) {
    return casosList.filter(caso => caso.status.toLowerCase() === status.toLowerCase());
}

function searchByText(query, casosList = casos) {
    const lowerQuery = query.toLowerCase();
    return casosList.filter(caso => 
        caso.titulo.toLowerCase().includes(lowerQuery) || 
        caso.descricao.toLowerCase().includes(lowerQuery)
    );
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
    findByAgenteId,
    findByStatus,
    searchByText
};