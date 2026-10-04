# Worker Milet — Stage 1

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

Não existe daemon, scheduler ou implantação do worker nesta etapa. A composição do
processo, shutdown, métricas, deduplicação comprovada com provider real e fila
gerenciada permanecem gates operacionais.
