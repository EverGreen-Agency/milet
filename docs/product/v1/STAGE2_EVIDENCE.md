# Stage 2 — runtime implantável e integração sintética opcional

**Data:** 2026-10-04

**Base:** `dc46b410ddf12d483b91defdc887ed22d65b7398`

**Classificação:** implementação e validação local/CI; nenhum deploy executado

## Entregue

- Dockerfiles multi-stage separados para API e worker, runtime Node non-root,
  healthcheck da API, `.dockerignore` e perfis Compose;
- credencial owner confinada ao PostgreSQL/migrations; API e worker usam somente a
  role local `milet_app` e não recebem owner URL;
- daemon de outbox com configuração fail-fast, tenant explícito por processo,
  ciclos limitados, polling configurável, SIGTERM/SIGINT e logs JSON sem payload;
- métricas operacionais in-process para requests/errors e
  processed/retry/DLQ/lost lease, sem alegar Prometheus, APM ou backend externo;
- allowlist CORS exata, headers de segurança, correlação e request logging da API;
- adapter HTTP do portal com timeout/abort, validação do contrato sintético e
  fallback local explicitamente visível; nenhum arquivo é enviado;
- testes de config, CORS, headers, métricas, fallback/timeout, limite de ciclo e
  shutdown, preservando todos os testes e checks do site.

## Evidências reproduzíveis

```powershell
npm.cmd ci
npm.cmd run ci
docker compose --profile runtime --profile worker config
docker build -f apps/api/Dockerfile -t milet-api:stage2 .
docker build -f apps/worker/Dockerfile -t milet-worker:stage2 .
npm.cmd audit --omit=dev --audit-level=high
git diff --check
```

O build de imagens é condicional à disponibilidade do daemon Docker e não autoriza
subir serviços. O smoke compilado usa porta exclusiva, `DATABASE_MODE=fake` e encerra
somente o PID criado para o teste. Resultados efetivamente executados devem ser
registrados no resumo do commit/PR; esta lista não é prova por si só.

## Resultado observado em 2026-10-04

- `npm ci`: concluído pelo lockfile;
- `npm run ci`: 9/9 testes estáticos e 21/21 testes de fundação, typecheck,
  integridade de 13 HTML/24 JSON e builds concluídos;
- `docker compose --profile runtime --profile worker config`: válido, sem subir
  serviço;
- imagens locais construídas: API
  `sha256:36d47e93a328f07dfaf84247d6329fdd7dbe0511e6369dbc92e9bd712b4817cb`
  e worker
  `sha256:1f78ef7c5ecb39899c6e36f7b7614e08b9fb8f97b9cc0bd2ab704cb9dc05936f`;
- inspeção: ambas `user=node`; API com healthcheck; worker com `STOPSIGNAL=SIGTERM`;
- smoke da API compilada em `127.0.0.1:4327`: liveness 200, CORS esperado,
  `nosniff`, correlação preservada e caso `synthetic_demo_only`; processo encerrado
  e porta liberada;
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilidades encontradas;
- `git diff --check`: aprovado (avisos locais de conversão LF/CRLF não são falhas).

## Limites deliberados

- dados e eventos exclusivamente sintéticos; `DEMO_DATA_ONLY=false` bloqueia API;
- headers tenant simulam contexto pós-autenticação e não são autenticação;
- não há OIDC, OCR, upload/storage, malware scan, assinatura, billing,
  financiamento, notificação ou provider cloud;
- o worker Stage 2 confirma apenas evento sintético local e não realiza efeito
  externo; exactly-once continua não prometido;
- métricas vivem no processo, reiniciam a cada restart e não possuem retenção,
  dashboard ou alerta;
- imagens construídas não equivalem a deploy, segurança validada ou produção;
- Compose é harness local, não arquitetura de alta disponibilidade;
- escolha de host depende dos gates em `DEPLOYMENT_RUNBOOK.md`.
