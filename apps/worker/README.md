# Worker Milet — Stage 2

Worker mínimo da outbox transacional. Ele processa no máximo um evento por chamada
`runOnce`, sempre dentro do contexto de um tenant.

## Semântica entregue

- claim atômico com `FOR UPDATE SKIP LOCKED` e lease de cinco minutos;
- conclusão protegida por `workerId` e `claim_token`, rejeitando execução que perdeu o lease;
- `event.id` obrigatório como chave de idempotência passada ao handler;
- retry exponencial calculado pelo worker, limitado por configuração;
- DLQ PostgreSQL explícita ao atingir `maxAttempts`;
- adapter in-memory determinístico para testes;
- nenhuma chamada de OCR, notificação, assinatura, billing ou outro provider.

O processamento é **at-least-once**: um crash depois do efeito externo e antes da
confirmação pode provocar nova entrega. O provider/handler futuro deve persistir ou
honrar `event.id` como chave de idempotência. Não existe promessa de exactly-once.

## Daemon Stage 2

`dist/daemon.js` exige `DATABASE_URL`, `WORKER_TENANT_ID` e `WORKER_USER_ID`.
Ele não enumera tenants: cada processo recebe exatamente um tenant autorizado,
processa no máximo `WORKER_MAX_EVENTS_PER_CYCLE` por ciclo e encerra de forma
cooperativa em SIGTERM/SIGINT. Logs são JSON e omitem payload; métricas vivem em
memória e são emitidas no shutdown.

O handler atual rejeita qualquer evento sem `classification=synthetic_demo_only` e
não chama provider. Daemon executável não equivale a implantação, integração ou
prontidão de produção. Deduplicação com provider real, fila gerenciada,
observabilidade externa e alertas permanecem gates operacionais.
