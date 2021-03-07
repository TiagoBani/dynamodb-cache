## Usando DynamoDB como cache para suas requisições

### Requisitos

- Node.js v14 (`.nvmrc` incluso no projeto)
- Conta na AWS (utilizaremos IAM e DynamoDB)
- Um banco PostgreSQL (existe um docker-compose no projeto, para quem quiser rodar usando Docker)

### Como rodar

*Rodando com docker*

- `Docker Container` AWS DynamoDB
- `Docker Container` Postgres
- `Docker Container` Node

```bash
docker-compose up -d
```

*Rodando local*
- Antes de tudo, rode o comando `npm install`;
- Caso queira rodar o banco localmente com Docker, pode-se utilizar o comando `docker-compose up -d postgres` para subir o banco;
- Renomeie o arquivo `.env.example` para `.env` e edite as variáveis para conexão com o banco;
- Rode o comando `npm run sequelize:migrate` para gerar as tabelas;
- Rode o comando `npm run sequelize:seed` para criar dados de exemplo nas tabelas;
- Rode o comando `npm run dev` para rodar o projeto usando nodemon.


### Testando

- id [1-50]
```bash
http://localhost:3000/patient/{id}
```