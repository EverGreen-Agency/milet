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

## Estado executável em 2026-10-03

A Stage 0 implementa a fronteira de API/contratos/PostgreSQL com dados sintéticos.
Não implementa PWA nova, OCR, upload, autenticação real, assinatura, cobrança,
financiamento ou qualquer provider externo. O portal público e `/app/` continuam
independentes do runtime da API.
