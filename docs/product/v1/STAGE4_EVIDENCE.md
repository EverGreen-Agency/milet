# Stage 4 — API sintética pública

**Data:** 2026-10-04  
**Classificação:** função Vercel implementada, testada e observada no domínio
público em 2026-10-04; permanece exclusivamente sintética e stateless.

## Entregue

- `GET /api/v1/cases/CASE-UC-MG-00482` como função serverless same-origin;
- resposta importada de `@milet/test-fixtures`, a fixture canônica já validada pelo
  schema `SyntheticCaseV1`, sem cópia de payload;
- fronteira tenant-shaped mantida pelos headers fixos da demonstração, sem declarar
  esses headers como autenticação;
- correlação, headers de segurança, classificação sintética e `private, no-store`
  em todas as respostas para impedir reuso por cache entre headers;
- `/app/` configurada para tentar `/api` por padrão e preservar fallback local
  explícito quando a função não estiver disponível;
- OpenAPI atualizado com o servidor público sob `/api` somente na operação do
  caso; as rotas de saúde continuam exclusivas da API Nest local.

## Validação reproduzível

```powershell
npm.cmd run ci
git diff --check
```

Os testes da função verificam resposta idêntica à fixture canônica, correlação,
classificação, método, tenant sintético e casos `400`, `403`, `404` e `405`.

Prova de deploy observada: `200` no endpoint público com os headers abaixo; o mesmo
adapter do app retornou modo `api`, organização `Padaria Horizonte` e UC
`UC-MG-00482`:

```powershell
curl.exe -i `
  -H "x-organization-id: ORG-0007" `
  -H "x-user-id: USR-DEMO-0001" `
  https://milet.vercel.app/api/v1/cases/CASE-UC-MG-00482
```

## Limites

- a função é stateless e não acessa PostgreSQL, worker, outbox ou providers;
- não recebe upload nem dados reais e não executa OCR, autenticação, cobrança,
  assinatura, recomendação regulatória ou contratação;
- os headers de organização/usuário preservam o formato do contrato, mas são
  identificadores públicos fixos da demo, não credenciais;
- CI comprova código e contrato; a chamada HTTP observada comprova somente a
  disponibilidade da função sintética naquele momento, não um SLA;
- não foi criada nova conta ou recurso pago; a função consome a quota do projeto
  Vercel existente e continua sujeita aos limites e custos do plano atual;
- esta etapa não promove a API Nest implantável da Stage 2 a produção.
