# Runbook de implantação provider-neutral — Stage 2

**Escopo:** API e worker sintéticos em containers OCI, PostgreSQL externo e portal
estático independente. Este documento não declara ambiente implantado.

## Artefatos e processos

- `apps/api/Dockerfile`: imagem multi-stage, processo Node non-root, filesystem
  read-only compatível e `HEALTHCHECK` em `/health/live`;
- `apps/worker/Dockerfile`: imagem multi-stage, processo Node non-root e
  `STOPSIGNAL SIGTERM` para shutdown cooperativo;
- `compose.yaml`: perfis `local-db`, `runtime` e `worker`. A role owner existe
  apenas no serviço de migração/PostgreSQL; API e worker usam `milet_app`;
- portal estático: continua implantável isoladamente. `app/runtime-config.js`
  habilita a API opcional sem tornar o portal dependente dela.

## Variáveis obrigatórias fora do modo fixture

API: `NODE_ENV=production`, `DATABASE_MODE=postgres`, `DATABASE_URL`,
`DEMO_DATA_ONLY=true`, `CORS_ORIGINS`, `PORT` e `BIND_ADDRESS`.

Worker: `DATABASE_URL`, `WORKER_TENANT_ID`, `WORKER_USER_ID` e `WORKER_ID`.
Cada processo recebe exatamente um tenant público explícito. Não há enumeração,
descoberta automática nem processamento silencioso de todos os tenants.

Segredos devem vir do mecanismo de secrets do host. Nunca promover os defaults
`*_local_only`; nunca entregar a credencial `milet_owner` à API ou ao worker.

## Sequência de implantação

1. criar PostgreSQL e duas identidades: owner/migrator e `milet_app` sem
   `SUPERUSER`, `BYPASSRLS`, `CREATEDB` ou `CREATEROLE`;
2. executar migrations como owner em job isolado e encerrá-lo;
3. validar conexão/RLS com a role `milet_app`;
4. publicar a imagem da API por digest imutável, sem filesystem gravável, e
   aguardar liveness + readiness;
5. publicar um worker para o tenant sintético autorizado; confirmar logs JSON e
   contadores in-process antes de aumentar réplicas;
6. configurar no portal somente a origem pública da API e a allowlist CORS exata;
7. executar smoke do caso `CASE-UC-MG-00482`; reverter o digest se health,
   readiness, headers ou isolamento falharem.

## Gates antes de escolher um host

Avaliar com a mesma matriz e carga sintética:

1. containers non-root, filesystem read-only, health checks e rollout/rollback;
2. PostgreSQL gerenciado com backup, PITR, TLS, métricas e roles/RLS equivalentes;
3. secrets com rotação e auditoria, sem injeção em build ou logs;
4. rede privada entre runtime e banco, allowlist de saída e domínio/TLS próprios;
5. logs JSON, métricas exportáveis, alertas e retenção com custo previsível;
6. escala independente de API e worker e shutdown com período de graça;
7. regiões, residência/transferência de dados, DPA, suporte e resposta a incidente;
8. preço total em carga mínima, normal e pico, incluindo egress, banco e logs;
9. portabilidade: imagem OCI, PostgreSQL padrão e exportação de logs/dados;
10. prova de restauração e de rollback, não apenas checklist comercial.

Nenhum host deve ser chamado de escolhido ou pronto para produção antes de um
ensaio autenticado, backup/restore, observabilidade externa e revisão de segurança.

## Operação e diagnóstico

- API escreve um JSON por request sem body, query ou headers pessoais; `/metrics`
  expõe apenas contadores do processo e não substitui backend de telemetria;
- worker registra IDs/event types sintéticos, nunca payloads; seus contadores são
  emitidos no log de shutdown e reiniciam com o processo;
- aumento de `deadLetters`, `lostLeases` ou `errors` bloqueia promoção;
- o handler Stage 2 somente reconhece eventos com
  `classification=synthetic_demo_only` e não chama providers externos.

## Rollback

Interromper novas réplicas do worker, aguardar shutdown, reverter API/worker ao
digest anterior e manter PostgreSQL. Migrations futuras deverão declarar
compatibilidade N/N-1; a Stage 2 não adiciona migration. Não apagar outbox/DLQ como
forma de rollback.
