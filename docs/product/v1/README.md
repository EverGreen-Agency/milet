# Milet Product & Platform v1

**Status:** decisão proposta para implementação

**Versão:** 1.0.0

**Data de corte:** 2026-10-03
**Escopo:** primeira plataforma operacional para PMEs, sem implementação de UI nesta entrega

Este diretório converte o backlog Milet em decisões executáveis. Ele não descreve o
estado atual do software: no commit-base `12ad854`, o repositório é uma publicação
estática de brandbook, apresentações e backlog. Não há API, banco de dados,
autenticação, OCR, filas, assinatura eletrônica, cobrança ou aplicativo nativo.

## Documentos normativos desta versão

- [ARCHITECTURE.md](./ARCHITECTURE.md): arquitetura alvo, módulos, domínio,
  estados, integrações, segurança, observabilidade e implantação.
- [ADRS.md](./ADRS.md): decisões aceitas, consequências e gatilhos de revisão.
- [BUSINESS_MODEL.md](./BUSINESS_MODEL.md): modelo de receita transparente,
  invariável sem spread e separação dos fluxos de capital.
- [DELIVERY_AND_TRACEABILITY.md](./DELIVERY_AND_TRACEABILITY.md): sequência de
  integração, Definition of Done, matriz P0 e questões abertas.
- [STAGE0_EVIDENCE.md](./STAGE0_EVIDENCE.md): implementação local da fundação,
  testes reproduzíveis, conflitos encontrados e gates ainda abertos.
- [STAGE1_EVIDENCE.md](./STAGE1_EVIDENCE.md): contratos versionados, persistência
  PostgreSQL, worker de outbox e evidências reproduzíveis desta etapa.
- [STAGE2_EVIDENCE.md](./STAGE2_EVIDENCE.md): containers, hardening HTTP, daemon,
  adapter HTTP/fallback e evidências locais desta etapa.
- [DEPLOYMENT_RUNBOOK.md](./DEPLOYMENT_RUNBOOK.md): sequência provider-neutral e
  critérios verificáveis para selecionar hosting futuramente.
- [HOSTING_DECISION.md](./HOSTING_DECISION.md): seleção de hosting por fase,
  trade-offs oficiais e gates antes de criar recursos.
- [STAGE3_EVIDENCE.md](./STAGE3_EVIDENCE.md): escopo entregue, validação e limites
  do plano de ativação e monetização.
- [STAGE4_EVIDENCE.md](./STAGE4_EVIDENCE.md): função Vercel do caso sintético,
  integração same-origin da demo, validação e limites do endpoint stateless.
- [STAGE5_EVIDENCE.md](./STAGE5_EVIDENCE.md): PWA mobile web, instalação,
  app shell offline e exclusão explícita de `/api` do cache.
- [MONETIZATION_EXPERIMENTS.md](./MONETIZATION_EXPERIMENTS.md): hipóteses de
  oferta, preço para aprender, cobrança, neutralidade e gates regulatórios.

## Regras de leitura

1. `Implementado` só pode ser usado para código executável e verificado.
2. `Integrado` exige chamada autenticada ao provedor em ambiente controlado.
3. `Produção` exige os gates de segurança, LGPD e operação definidos na arquitetura.
4. Fixtures, troca visual de perfil e timelines simuladas são demonstração.
5. Custos citados são hipóteses de modelagem, não cotações atuais.
6. Os identificadores `EP-01..EP-06`, `F1.1..F6.3` e `US-001..US-028` não podem
   ser reciclados, renumerados ou ter o significado alterado silenciosamente.

## Decisão resumida

Começar com uma **web responsiva instalável (PWA)** e um **monólito modular**,
mantendo o site institucional atual isolado. O produto terá contratos de domínio
independentes dos provedores e uma API própria. Aplicativos nativos entram somente
quando evidência de uso justificar capacidades do dispositivo ou experiência de
loja que a PWA não entregue adequadamente.

## Estado executável em 2026-10-04

A Stage 1 implementa contratos públicos versionados, leitura/auditoria PostgreSQL
tenant-scoped e worker de outbox com retry/DLQ sobre dados sintéticos.
Não implementa PWA nova, OCR, upload, autenticação real, assinatura, cobrança,
financiamento ou qualquer provider externo. O portal público e `/app/` continuam
independentes do runtime da API.

A Stage 2 empacota API e worker como containers, adiciona daemon/observabilidade
mínima e permite que `/app/` leia opcionalmente o caso sintético da API, com fallback
local visível. Isso é implantável como artefato, mas não foi implantado nem validado
como produção.

A Stage 4 adiciona uma função Vercel stateless que publica somente a fixture
sintética canônica e conecta `/app/` a `/api` por padrão. Ela não implanta a API
Nest, banco, worker nem integrações e só pode ser chamada de pública após observar o
deploy do commit correspondente.

A Stage 5 cumpre a decisão inicial de começar por web responsiva instalável: adiciona
manifest, ícones e service worker ao app sintético. O app shell pode abrir offline,
mas API, dados reais, push e capacidades nativas continuam fora do escopo.
