# Stage 1 — contratos, persistência e outbox

**Data:** 2026-10-03

**Base:** `0225ab182fe9a3198b76757c301bd3a5dffcc6ff`

**Classificação:** implementação local e CI com dados exclusivamente sintéticos

## Entregue

- OpenAPI 3.1 versionado em `openapi/v1/openapi.json` para liveness, readiness e
  leitura tenant-scoped do caso sintético;
- JSON Schemas Draft 2020-12 versionados para health, readiness, caso sintético,
  auditoria e evento de outbox;
- transação PostgreSQL que resolve o `public_id` do tenant e aplica
  `set_config(..., true)` antes de qualquer consulta protegida;
- repositório PostgreSQL de leitura do caso e store append-only de auditoria, com
  seleção por `DATABASE_MODE` e adapters in-memory preservados;
- claim de outbox com lock/lease, `SKIP LOCKED`, conclusão idempotente, retry
  exponencial limitado e DLQ explícita;
- migrations incrementais `003`/`004`, fixture determinística e preservação de
  `ORG-0007`, `UC-MG-00482` e `INV-2026-08-00482`;
- testes de contrato, isolamento entre tenants, persistência, imutabilidade,
  idempotência, retry, backoff e DLQ.

## Como reproduzir

```powershell
npm.cmd ci
npm.cmd run ci
npm.cmd audit --omit=dev --audit-level=high
git diff --check
```

O CI executa todas as migrations em PGlite/PostgreSQL WASM, conta as nove policies
RLS e exerce os adapters reais com contexto transacional. O smoke compilado deve
usar uma porta livre e encerrar somente o PID iniciado pelo próprio comando.

## Gates satisfeitos nesta etapa

1. contratos públicos têm versão e referências locais verificáveis;
2. a leitura do caso e a auditoria não dependem mais exclusivamente de memória;
3. contexto do tenant é local à transação e não vaza para o pool;
4. a outbox possui semântica explícita para concorrência, retry e falha permanente;
5. portal estático, rotas Vercel e IDs publicados permanecem inalterados.

## Limites e gates abertos

- nenhum backend/worker foi implantado ou comprovado em produção;
- headers tenant continuam simulação pós-autenticação; não há OIDC, MFA nem sessão;
- nenhum upload ou documento real; OCR, storage externo e malware scan não existem;
- nenhuma integração externa, notificação, assinatura, cobrança ou financiamento;
- DLQ ainda não tem painel, alerta, replay operacional ou runbook de incidente;
- faltam métricas/telemetria, secrets manager, backup/restore e teste contra um
  PostgreSQL gerenciado com roles equivalentes à produção;
- a fixture contém somente dados sintéticos e não autoriza aceitar faturas reais.

Resultado local/CI não equivale a integração autenticada, segurança validada ou
prontidão de produção.
