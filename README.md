# Atividade - Etapa 2 - API para o Departamento de Polícia - WebTech Journey - Backend - 2025

### Estrutura do Projeto
  - police-api/
    - package.json
    - server.js
    - routes/
      - agentesRoutes.js 
      - casosRoutes.js
    - controllers/
      - agentesController.js 
      - casosController.js
    - repositories/
      - agentesRepository.js
      - casosRepository.js
    - utils/
      - errorHandler.js
    - docs/
      - swagger.js

### Endpoints - Agentes Policiais (/agentes)
1. GET    /agentes          - Lista todos os agentes
2. GET    /agentes/:id      - Obtém um agente específico
3. POST   /agentes          - Cria novo agente
4. PUT    /agentes/:id      - Atualiza todos os dados
5. PATCH  /agentes/:id      - Atualização parcial
6. DELETE /agentes/:id      - Remove agente

- Filtro por cargo (?cargo=)
- Ordenação por data (?sort=dataDeIncorporacao)

### Endpoints - Casos Policiais (/casos)
1. GET    /casos            - Lista todos os casos
2. GET    /casos/:id        - Obtém caso específico
3. POST   /casos            - Cria novo caso
4. PUT    /casos/:id        - Atualiza todos os dados
5. PATCH  /casos/:id        - Atualização parcial
6. DELETE /casos/:id        - Remove caso

- Filtro por agente (?agente_id=)
- Filtro por status (?status=)
- Busca full-text (/search?q=)
- Dados do agente (/:id/agente)

### Tecnologias Utilizadas
- Node.js
- Express
- Swagger 
- UUID 

## Como Executar o Projeto
1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor:
```bash
npm start
```

3. Acesse no navegador:
```bash
http://localhost:3000
```

4. Acesse a documentação:
```bash
http://localhost:3000/docs
```