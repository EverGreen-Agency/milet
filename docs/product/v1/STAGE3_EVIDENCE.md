# Stage 3 — plano de ativação e modelo comercial

**Data:** 2026-10-04
**Classificação:** documentação implementada e superfícies públicas atualizadas;
nenhum backend, PSP, recurso cloud, cliente ou preço foi ativado.

## Entregue

- roadmap e build in public atualizados com a evidência real das Stages 0–2;
- distinção pública entre frontend em produção e backend apenas implantável;
- seleção reversível de hosting por fase, com fontes oficiais e gates;
- hipótese de oferta B2B assistida, preço para aprender e métrica por UC ativa;
- fronteira entre assinatura de serviço, marketplace, split e liquidação setorial;
- controles de neutralidade de ranking, eventos de ledger e métricas de decisão.

## Decisões

- expor primeiro apenas o backend sintético, mantendo fixtures como rollback;
- Railway é a recomendação de baixo atrito para essa demo, não para dados reais;
- dados reais exigem região brasileira e revisão entre Fly.io/GCP/AWS;
- cobrar inicialmente a PME pelo diagnóstico/acompanhamento;
- não usar split, spread, fee por MWh ou participação na economia sem validação
  jurídica, fiscal, regulatória e de baseline;
- não comprar posição no ranking e provar por teste que comissão não altera score.

## Validação reproduzível

```powershell
node app/scripts/check-static.js
node app/scripts/check-site.js
npm.cmd run ci
git diff --check
```

Resultado observado em 2026-10-04: checks estáticos aprovados, 13 HTML e 24 JSON
com links locais válidos, typecheck aprovado, 9/9 testes estáticos, 22/22 testes de
fundação e build público com 269 arquivos.

## Limites

- valores são hipóteses de pesquisa, não tabela comercial;
- custos de cloud são preços publicados, não cotação final nem custo observado;
- links regulatórios apoiam descoberta de produto, não substituem parecer jurídico;
- nenhuma conta, secret, domínio, banco, API, worker, checkout ou webhook foi criado;
- Fibery não foi alterado nesta etapa.
