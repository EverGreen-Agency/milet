# API Milet — Stage 0

API NestJS mínima para validar a fronteira transacional sem receber documentos
reais. O modo padrão usa adapters determinísticos; `DATABASE_MODE=postgres` habilita
somente a checagem de readiness contra PostgreSQL.

## Executar

```powershell
npm.cmd install
npm.cmd run api:dev
```

Endpoints públicos:

- `GET /health/live`
- `GET /health/ready`

Endpoint sintético protegido pela fronteira tenant-first:

```text
GET /v1/cases/CASE-UC-MG-00482
x-organization-id: ORG-0007
x-user-id: USR-DEMO-0001
```

Os headers simulam contexto já autenticado. Não são autenticação real e não devem
ser expostos como mecanismo de produção.

## PostgreSQL local opcional

```powershell
docker compose up postgres
```

O host usa `127.0.0.1:55433` porque `5432` e `55432` estavam ocupados por outros serviços.
As migrações em `infra/postgres/migrations` são montadas somente na criação de um
volume novo. Os testes executam as mesmas migrações em PGlite e não exigem Docker.

## Verificar

```powershell
npm.cmd run ci
git diff --check
```

O teste HTTP abre uma porta efêmera exclusiva (`listen(0)`) e encerra apenas o
servidor criado pelo próprio teste.

## Limites deliberados

- somente fixtures sintéticas; `DEMO_DATA_ONLY=false` impede o bootstrap;
- nenhum endpoint de upload;
- sem OCR, auth, assinatura, billing, financiamento ou cloud credentials;
- portas externas são contratos desabilitados/fakes;
- readiness local não comprova controles LGPD, segurança ou produção.
