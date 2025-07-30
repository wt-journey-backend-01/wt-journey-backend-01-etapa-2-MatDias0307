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
        id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
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
    const novoCaso = { id: uuidv4(), ...caso };
    casos.push(novoCaso);
    return novoCaso;
}

function update(id, casoAtualizado) {
    const index = casos.findIndex(caso => caso.id === id);
    if (index !== -1) {
        casos[index] = { ...casos[index], ...casoAtualizado };
        return casos[index];
    }
    return null;
}

function remove(id) {
    casos = casos.filter(caso => caso.id !== id);
}

function findByAgenteId(agente_id) {
    return casos.filter(caso => caso.agente_id === agente_id);
}

function findByStatus(status) {
    return casos.filter(caso => caso.status.toLowerCase() === status.toLowerCase());
}

function searchByText(query) {
    const lowerQuery = query.toLowerCase();
    return casos.filter(caso => 
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