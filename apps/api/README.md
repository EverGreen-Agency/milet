# API Milet — Stage 2

API NestJS mínima para validar a fronteira transacional sem receber documentos
reais. O modo padrão usa adapters determinísticos; `DATABASE_MODE=postgres` habilita
readiness e os repositórios tenant-scoped de caso sintético e auditoria.

## Executar

```powershell
npm.cmd ci
npm.cmd run api:dev
```

Endpoints públicos:

- `GET /health/live`
- `GET /health/ready`
- `GET /metrics` (contadores somente do processo, sem backend externo)

Endpoint sintético protegido pela fronteira tenant-first:

```text
GET /v1/cases/CASE-UC-MG-00482
x-organization-id: ORG-0007
x-user-id: USR-DEMO-0001
```

O contrato versionado está em `openapi/v1/openapi.json`; os schemas referenciados
estão em `schemas/v1`. Os headers simulam contexto já autenticado. Não são
autenticação real e não devem ser expostos como mecanismo de produção.

## PostgreSQL local opcional

```powershell
docker compose up postgres
```

O host usa `127.0.0.1:55433` porque `5432` e `55432` estavam ocupados por outros serviços.
As migrações em `infra/postgres/migrations` são montadas somente na criação de um
volume novo. O container usa `milet_owner` para criar/migrar e a API usa
`milet_app`, uma role separada `NOSUPERUSER`/`NOBYPASSRLS`; não use a credencial
de owner na `DATABASE_URL`. Os testes executam as migrations de dados em PGlite, validam RLS,
auditoria append-only, leitura tenant-scoped, claim/retry/DLQ e não exigem Docker.

## Verificar

```powershell
npm.cmd run ci
git diff --check
```

O teste HTTP abre uma porta efêmera exclusiva (`listen(0)`) e encerra apenas o
servidor criado pelo próprio teste.

Para validar o runtime local sem iniciar serviços existentes:

```powershell
docker compose --profile runtime config
docker build -f apps/api/Dockerfile -t milet-api:stage2 .
```

`CORS_ORIGINS` é uma lista de origens exatas separadas por vírgula. Em produção o
default é vazio. A API adiciona headers de segurança, correlation ID e um log JSON
por request sem body/query/headers de usuário.

## Limites deliberados

- somente fixtures sintéticas; `DEMO_DATA_ONLY=false` impede o bootstrap;
- nenhum endpoint de upload;
- sem OCR, auth, assinatura, billing, financiamento ou cloud credentials;
- portas externas são contratos desabilitados/fakes;
- worker não chama integração externa; seu daemon só reconhece eventos sintéticos;
- readiness local não comprova controles LGPD, segurança ou produção.
- PGlite não comprova concorrência real de `SKIP LOCKED`; isso exige PostgreSQL
  externo com duas sessões e a mesma role da aplicação.
