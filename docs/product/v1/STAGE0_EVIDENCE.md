# Stage 0 — evidência e limites

**Data:** 2026-10-03

**Base:** `fe620c1391ddc797882e6efd82e211083fc60cf3`

**Classificação:** implementação local com dados sintéticos

## Entregue

- workspaces incrementais sem mover o portal público;
- contratos TypeScript para organização/usuário/tenant, UC, intake/revisão de
  fatura, baseline, cenário, auditoria e portas externas;
- API NestJS com liveness/readiness, configuração fail-fast, correlation ID e guard
  global tenant-first;
- migrações PostgreSQL com constraints, RLS, auditoria append-only e outbox;
- fixtures determinísticas compatíveis com `ORG-0007`, `UC-MG-00482` e
  `INV-2026-08-00482`;
- testes de isolamento, rejeição de contexto ausente/inválido, imutabilidade,
  execução das migrações e compatibilidade dos IDs;
- workflow de CI e compose PostgreSQL local em porta `55433`.

## Conflitos e decisões

1. A estrutura alvo sugere mover o portal para `apps/public-site`; a Stage 0 não o
   move para evitar risco às rotas já publicadas. ADR-011 registra a decisão.
2. A arquitetura recomenda UUIDv7, mas o protótipo já expõe IDs legíveis. O banco
   usa UUIDs internos e mantém esses valores como `public_id`. Os UUIDs fixos só
   existem na fixture; geração de produção não foi implementada.
3. A arquitetura cita OpenAPI + JSON Schema. Esta etapa entrega contratos TypeScript,
   mas ainda não gera OpenAPI/JSON Schema; isso permanece gate antes de clientes reais.
4. O header tenant é uma simulação pós-autenticação. Identity/OIDC, MFA e RBAC/ABAC
   reais permanecem fora do escopo.

## Não entregue / gates restantes

- nenhum upload ou processamento de fatura real;
- nenhum provider autenticado, sandbox ou produção;
- nenhuma comprovação de RLS com roles de produção e pool transacional;
- threat model, DPA/LGPD, secrets, criptografia/KMS, malware scan, backup/restore,
  observabilidade completa, SAST/DAST e runbooks de incidente;
- OpenAPI/JSON Schema, worker de outbox, retries/DLQ e métricas operacionais;
- OCR, assinatura, billing, financiamento, RFQ, contratação e economia apurada.

Os gates de `ARCHITECTURE.md §8` continuam obrigatórios antes de qualquer documento
real. Testes locais e CI configurada não equivalem a operação autenticada nem
prontidão de produção.
