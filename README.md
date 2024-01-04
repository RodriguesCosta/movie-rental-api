# API Básica NodeJS JavaScript

Para subir a aplicação apenas usar docker compose com o comando:

```bash
docker compose up
```

## Testes

Para rodar os testes e2e temos duas maneiras, a primeira é usando o docker compose com o comando:

```bash
docker compose -f docker-compose.e2e-test.yml up --abort-on-container-exit --build
```
ou pode ser rodado localmente primeiro subindo o banco de dados com o comando:

```bash
docker compose -f docker-compose.database.yml up -d
```
e depois rodar o comando:

```bash
npm run test:e2e
```

Para os testes unitários nada e necessário, apenas rodar o comando:

```bash
npm run test
```
