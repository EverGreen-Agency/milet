# Worker Milet — Stage 1

Worker mínimo da outbox transacional. Ele processa no máximo um evento por chamada
`runOnce`, sempre dentro do contexto de um tenant.

## Semântica entregue

- claim atômico com `FOR UPDATE SKIP LOCKED` e lease de cinco minutos;
- conclusão condicional ao mesmo `workerId`, portanto idempotente;
- retry exponencial calculado pelo worker, limitado por configuração;
- DLQ PostgreSQL explícita ao atingir `maxAttempts`;
- adapter in-memory determinístico para testes;
- nenhuma chamada de OCR, notificação, assinatura, billing ou outro provider.

Não existe daemon, scheduler ou implantação do worker nesta etapa. A composição do
processo, shutdown, métricas e fila gerenciada permanecem gates operacionais.
