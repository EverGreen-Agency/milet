# Sequência de entrega e rastreabilidade — Milet v1

**Versão:** 1.0.0 · **Data:** 2026-10-03

## 1. Sequência de integração

| Etapa | Entrega verificável | Dependência | Gate para avançar |
|---|---|---|---|
| 0. Fundação | monorepo alvo, CI, contratos, Postgres, tenants, fixtures e audit skeleton | nenhuma integração real | testes de isolamento e migrations |
| 1. Caso sintético | descoberta, upload fake, revisão, baseline, cenários e comparação | providers fake | mesmo caso e IDs em desktop/mobile |
| 2. Intake seguro | storage privado, malware scan, OCR sandbox e revisão humana | gates LGPD 1–8 | corpus sintético e precisão por campo |
| 3. RFQ assistido | consentimento, snapshot, proposta versionada, comparação neutra e escolha | Identity/Passport/Decisioning | disclosure e ranking reproduzíveis |
| 4. Execução | checklist, tarefas, SLA, assinatura sandbox/manual e timeline | escolha válida | webhook idempotente e intervenção auditada |
| 5. Valor | Savings Ledger com estimado/contratado/apurado e reavaliação | baseline congelada | reconciliação matemática e contestação |
| 6. Comercial | assinatura/serviço sandbox, invoice Milet e conciliação | ADR-008/009 | sem spread e sem custódia de capital |
| 7. Piloto real | um tenant, parceiros nomeados, dados autorizados e operação assistida | todos os gates de segurança | runbooks, restore, incidente e owner de plantão |
| 8. Escala | automação seletiva, SSO, warehouse e eventual nativo | métricas reais | gatilhos documentados, novo ADR |

Cada etapa usa adaptador `fake`, depois `sandbox`, depois `production`. A troca exige
contract tests idênticos; flag de ambiente não pode transformar fixture em dado real.

## 2. Registro canônico de IDs

| Épico | Features preservadas |
|---|---|
| EP-01 · Onboarding & Passaporte | F1.1 Cadastro e UCs; F1.2 Leitura de faturas; F1.3 Passaporte e consentimento |
| EP-02 · Diagnóstico & Decisão | F2.1 Elegibilidade; F2.2 Baseline de Custo; F2.3 Simulação e recomendação |
| EP-03 · Marketplace & RFQ | F3.1 RFQ Reverso; F3.2 Propostas padronizadas; F3.3 Comparação e neutralidade |
| EP-04 · Contratação & Execução | F4.1 Documentos/contratos; F4.2 Timeline e tarefas |
| EP-05 · Economia & Autopilot | F5.1 Savings Ledger; F5.2 Renovação/rebid |
| EP-06 · Operação & Confiança | F6.1 Backoffice Operacional; F6.2 Portal de Oferta; F6.3 Auditoria e permissões |

As histórias `US-001..US-028` permanecem no catálogo existente. A matriz abaixo usa
o recorte P0 proposto em 02/10/2026: **US-001, US-002, US-003, US-006, US-007,
US-008, US-009, US-010, US-012, US-013, US-016, US-019, US-021, US-025 e US-027**.
O site atual classifica US-001 como P1/cadastro, enquanto a proposta externa a usa
como descoberta/triagem P0. Até decisão do Product Owner, implementar descoberta
como tarefa vinculada sem sobrescrever o texto canônico de US-001.

## 3. Matriz P0 → arquitetura → evidência

| Story | Resultado P0 | Módulos | Evidência de conclusão de produção |
|---|---|---|---|
| US-001 | descoberta/triagem proposta; divergência aberta | Intake | critérios canônicos reconciliados + teste de jornada |
| US-002 | upload e leitura de fatura | Intake, Trust | arquivo seguro, OCR versionado, incerteza por campo |
| US-003 | revisar/corrigir extração | Intake, Trust | revisão versionada, origem visível, baseline atualizada |
| US-006 | elegibilidade explicável | Decisioning | RuleSet vigente, fonte, razão e teste de borda |
| US-007 | baseline de custo | Decisioning, Savings | componentes, período, ausências e recálculo reproduzível |
| US-008 | simular alternativas | Decisioning | mesma baseline/horizonte e custos completos |
| US-009 | recomendação explicável | Decisioning, Trust | critérios/versão/confiança + aprovação quando exigida |
| US-010 | abrir RFQ do Passaporte | Passport, Marketplace | snapshot, consentimento, destinatários e prazo |
| US-012 | proposta padronizada | Marketplace | validação, versão, validade e anexos íntegros |
| US-013 | comparar com neutralidade | Marketplace, Commercial | ranking reproduzível, campos ausentes e disclosure |
| US-016 | checklist documental | Fulfillment | itens por rota, responsável, status e vínculo seguro |
| US-019 | timeline e próximos passos | Fulfillment, Operations | máquina de estados, SLA, ator e eventos externos |
| US-021 | previsto versus apurado | Savings | baseline congelada, reconciliação e limitações |
| US-025 | fila operacional | Operations | tenant scope, prioridade, exceção e resolução auditada |
| US-027 | lineage e auditoria | Trust | evento append-only, versões, correlação e exportação |

### Cobertura das demais histórias

`US-004, US-005, US-011, US-014, US-015, US-017, US-018, US-020, US-022,
US-023, US-024, US-026 e US-028` continuam com seus IDs e fases no backlog. A v1
pode usar comportamento mínimo de contexto, consentimento, escolha e disclosure sem
declarar essas histórias completas.

## 4. Definition of Ready e Done

**Ready:** ator, objetivo, critérios, classificação demo/produção, dados de teste,
ameaças, módulos donos, dependências e evidência esperada definidos.

**Done de demonstração:** fluxo executável com fixtures sintéticas, estados de
erro/correção, desktop e mobile, sem alegação de integração real.

**Done de integração:** sandbox autenticado, contract tests, idempotência, timeout,
retry/DLQ, métricas e runbook.

**Done de produção:** critérios da story, gates LGPD/segurança, autorização no
servidor, observabilidade/SLO, backup restaurado, auditoria, operação e evidência do
provedor real verificados. Um build ou teste local não satisfaz esse nível sozinho.

## 5. Open questions com owner e prazo de decisão

| ID | Questão | Owner sugerido | Bloqueia |
|---|---|---|---|
| OQ-01 | US-001 permanece cadastro P1 ou passa a descoberta/triagem P0? | Product Owner | fechamento do recorte P0 |
| OQ-02 | Qual entidade é controladora LGPD e quais fornecedores são operadores? | Jurídico + DPO | qualquer fatura real |
| OQ-03 | Quais modalidades entram no primeiro diagnóstico e qual fonte/versionamento das regras? | Produto + especialista regulatório | US-006/008/009 |
| OQ-04 | Quem paga cada receita e qual fórmula/teto do success fee? | Founder + Finance + Jurídico | Commercial production |
| OQ-05 | Há relacionamento societário/comercial que exija marcação de parte relacionada? | Jurídico + Finance | US-013/015 |
| OQ-06 | Qual provedor de OCR vence o corpus representativo por campo, custo total e região? | Engenharia + Operação | intake real |
| OQ-07 | Clicksign, D4Sign ou DocuSign atende evidência e jornada exigidas? | Jurídico + Engenharia | assinatura real |
| OQ-08 | Asaas, Stripe ou outro atende nota, boleto/PIX, conciliação e tributação? | Finance + Engenharia | cobrança real |
| OQ-09 | Qual retenção por tipo de documento e evento; como atender deleção sem destruir obrigação legal? | DPO + Jurídico | produção |
| OQ-10 | Qual RPO/RTO e horário de suporte do piloto? | Operação + Engenharia | go-live |
| OQ-11 | Onde estarão hospedados dados e subprocessadores; há exigência contratual de Brasil? | DPO + Procurement | contratação de providers |
| OQ-12 | Qual limiar de confiança manda campo OCR para revisão e quem responde pelo SLA? | Produto + Operação | US-002/003 |
| OQ-13 | A Milet apenas encaminha financiamento ou realiza alguma intermediação regulada? | Jurídico + Founder | Financing adapter |
| OQ-14 | Quais gatilhos quantitativos autorizam iniciar aplicativo nativo? | Produto + Engenharia | roadmap mobile |

## 6. Checklist da primeira implementação

1. criar ADR de bootstrap do monorepo e confirmar ownership;
2. codificar schemas das entidades e transições antes das telas;
3. escrever testes de autorização tenant-first;
4. construir providers fake determinísticos e fixtures marcadas como demo;
5. entregar US-002/003/007 verticalmente com auditoria;
6. adicionar US-006/008/009 e somente depois abrir RFQ;
7. instrumentar SLO e custo operacional desde o primeiro job assíncrono;
8. manter tabela de evidências por story e nunca promover sandbox a produção por flag.
