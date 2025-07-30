module.exports = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API do Departamento de Polícia',
            version: '1.0.0',
            description: 'API para gerenciamento de casos e agentes policiais',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local',
            },
        ],
        components: {
            schemas: {
                Agente: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID único do agente'
                        },
                        nome: {
                            type: 'string',
                            description: 'Nome completo do agente'
                        },
                        dataDeIncorporacao: {
                            type: 'string',
                            format: 'date',
                            description: 'Data de incorporação no formato YYYY-MM-DD'
                        },
                        cargo: {
                            type: 'string',
                            description: 'Cargo do agente (inspetor, delegado, etc.)'
                        }
                    },
                    required: ['id', 'nome', 'dataDeIncorporacao', 'cargo']
                },
                Caso: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID único do caso'
                        },
                        titulo: {
                            type: 'string',
                            description: 'Título do caso'
                        },
                        descricao: {
                            type: 'string',
                            description: 'Descrição detalhada do caso'
                        },
                        status: {
                            type: 'string',
                            enum: ['aberto', 'solucionado'],
                            description: 'Status atual do caso'
                        },
                        agente_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID do agente responsável pelo caso'
                        }
                    },
                    required: ['id', 'titulo', 'descricao', 'status', 'agente_id']
                }
            }
        }
    },
    apis: ['./routes/*.js'],
};