# Roteiro Cronometrado — Projetos de Engenharia da Computação I (N2)

- **Projeto:** Milet — Engenharia da Decisão Energética
- **Autor:** Eduardo Ferreira de Mattos · TIA `10402800` · Turma 6
- **Disciplina / Docente:** Projetos de Engenharia da Computação I · Prof. Dr. Rodrigo Juliani · Universidade Presbiteriana Mackenzie (2026.2)
- **Deck espelhado (M2):** `academico/n2/engenharia-da-computacao/presentation-computacao-n2.html` e `Milet_Apresentacao_Computacao_N2.pptx` (`S01`–`S14`)
- **Duração:** `10:00` de apresentação oral (`600 s`, `S01`–`S13`) + `5:00` de arguição técnica (`S14` como apoio visual)
- **Contagem exata de falas (Parte 1):** `1.366` palavras (~137 palavras/minuto em `10:00`)

---

## Parte 1 — Roteiro Cronometrado da Apresentação (10 min)

### `S01` · Capa — *Engenharia da decisão energética* (`0:00–0:30` · 30s)
**Direção de cena:** Exibir capa com logo oficial da Milet e ficha acadêmica. Saudar a banca com ritmo firme.

> Bom dia, professor Rodrigo e membros da banca. Sou Eduardo Ferreira de Mattos, da Turma 6, e apresento a entrega N2 da Milet em Engenharia da Computação I. A Milet é uma plataforma neutra de inteligência energética para pequenas e médias empresas. Nossa apresentação segue rigor factual estrito: mostraremos o caso sintético reproduzível da Padaria Horizonte, 76 testes automatizados aprovados e duas entrevistas reais via WhatsApp, sem dados fabricados.

---

### `S02` · 1. Tema e Motivação [0.5] — *Abertura do Mercado Livre e a lacuna de decisão para PMEs* (`0:30–1:10` · 40s)
**Direção de cena:** Apontar para os indicadores da CCEE e para a linha regulatória até 2027/2028.

> No critério 1, Tema e Motivação: pela Portaria MME 50/2022 e pela Resolução 1.000 da ANEEL, empresas do Grupo A com pelo menos 30 quilowatts já podem migrar ao Mercado Livre. Segundo a CCEE, foram 21.707 migrações em 2025 — 49,5% em serviços e comércio — e mais de 70% via modelo varejista no primeiro trimestre de 2026. Existem 72 mil PMEs elegíveis no cativo, e a Lei 15.269/2025 abrirá a baixa tensão em 2027 e 2028. Para a Computação, o desafio é normalizar faturas de 104 distribuidoras em cálculo determinístico e auditável.

---

### `S03` · 2. Problema Tratado [0.5] — *Assimetria informacional, propostas incomparáveis e conflito de agência* (`1:10–1:50` · 40s)
**Direção de cena:** Destacar os quatro cards de dor, a nota metodológica do VOC e o card da Padaria Horizonte.

> No critério 2, Problema Tratado: a PME enfrenta quatro travas na contratação. Primeiro, propostas vêm em réguas incompatíveis: reais por megawatt-hora, percentual de desconto só na energia ou tarifa por quilowatt-hora em geração distribuída. Segundo, surgem fatura dupla e multas de fidelidade após assinar, sinal qualitativo que observamos no Reclame Aqui. Terceiro, comissões de 5 a 10 mil reais geram conflito de agência. Para conduzir toda a demonstração, usamos o caso âncora da Padaria Horizonte: unidade Cemig A4, 12.480 quilowatts-hora, 75 quilowatts e conta cativa de 10.920 reais por mês.

---

### `S04` · 3. Estado da Arte [0.5] — *Literatura científica, regulação vigente e tese de integração contínua* (`1:50–2:35` · 45s)
**Direção de cena:** Percorrer as três colunas: literatura científica, marcos regulatórios e benchmarks com a tese de lacuna.

> No critério 3, Estado da Arte: estudos em periódicos como Renewable and Sustainable Energy Reviews — Sousa, Capper, Gunarathna e Schwidtal — mostram que plataformas energéticas falham por baixa interoperabilidade, custos de rede ocultos e falta de auditoria pós-adesão. No Brasil, além da Consulta Pública 07/2025 da ANEEL sobre Open Energy, o artigo 10 do Decreto 13.097/2026 prevê um comparador público de preços na CCEE. Isso comoditiza vitrines simples como as atuais. Por isso, nossa tese de lacuna aposta em integração contínua: Passaporte Energético, comparação All-In auditável, workflow de migração e conferência mensal das faturas.

---

### `S05` · 4. Plano de Projeto e Resultados [0.5] — *6 Épicos, 28 User Stories e arquitetura de 4 portais RBAC* (`2:35–3:15` · 40s)
**Direção de cena:** Mostrar os seis épicos, a topologia do monorepo e os quatro resultados mensuráveis (`R1`–`R4`).

> No critério 4, Plano de Projeto: organizamos o backlog desde a N1 em 6 épicos e 28 user stories, cobrindo desde o intake e Passaporte Energético até auditoria mensal e os 4 portais RBAC — Consumidor, Comercializadora, Usina e Admin. A arquitetura alvo separa um monorepo TypeScript com Next.js 16, domínio puro compartilhado, contratos validados por Ajv e OpenAPI, e fundação transacional NestJS com PostgreSQL e worker Outbox. Os quatro resultados esperados em Computação I são: jornada demonstrativa no ar, motor All-In 100% coberto por testes, controles OWASP e RLS validados, e escuta de campo real.

---

### `S06` · 5. Cronograma Atualizado [0.5] — *Execução realizada (ago–nov/2026) vs. roadmap de Projetos II* (`3:15–3:50` · 35s)
**Direção de cena:** Contrastar os quatro blocos verdes realizados até 19/11 com o bloco âmbar de Projetos II (fev–jun/2027).

> No critério 5, Cronograma Atualizado: entre 10 de agosto e 19 de novembro concluímos quatro marcos. Fechamos discovery e estado da arte até setembro, o plano N1 no fim de setembro e a primeira versão do MVP em outubro. No último ciclo unificamos site e rotas em Next.js 16, instrumentamos PostHog em opt-in, consolidamos a matriz OWASP ASVS L1, alcançamos 76 testes e fizemos duas entrevistas no WhatsApp. Para Projetos II, entre fevereiro e junho de 2027, ficam OIDC com 4 portais, matching persistido no Brasil e campo ampliado.

---

### `S07` · 6. Conceitos e Tecnologias [1.0] — *Decisões de engenharia: zero type drift, RLS e Outbox* (`3:50–4:35` · 45s)
**Direção de cena:** Percorrer os seis blocos de decisão técnica destacando por que TypeScript de ponta a ponta elimina *type drift*.

> No critério 6, Conceitos e Tecnologias: combinamos SDD, BDD e TDD com arquitetura em camadas e Ports and Adapters. A decisão central foi usar TypeScript único no frontend, no domínio e nos serviços. Como regras da ANEEL mudam com frequência, evitar Python ou Go no backend elimina type drift entre navegador e API, mantendo cold start de cerca de 50 milissegundos na Vercel. No banco adotamos PostgreSQL com Row-Level Security e PGlite em memória para testes rápidos. Para mensageria assíncrona aplicamos Outbox Pattern com FOR UPDATE SKIP LOCKED e Dead-Letter Queue, além de Gemini 2.5 Flash e PostHog opt-in.

---

### `S08` · 7. Desenvolvimento (1/2) [1.0] — *Código real: isolamento por tenant (RLS) e fluxo OCR de faturas* (`4:35–5:20` · 45s)
**Direção de cena:** Apontar à esquerda para `tenant.guard.ts` e `postgres-tenant-database.ts`; à direita, para `/api/extract-invoice` e `step-invoice-review.tsx`.

> No critério 7, Desenvolvimento, parte 1: à esquerda vemos o código real de isolamento multitenant. O TenantGuard valida os identificadores da requisição e o PostgresTenantDatabase executa set_config de app.organization_id dentro de cada transação BEGIN, ativando as políticas RLS. Com total transparência: hoje os headers x-organization-id e x-user-id simulam o contexto pós-login e darão lugar a OIDC com MFA e aos 4 portais em Projetos II. À direita está o fluxo OCR: a rota valida o MIME type, chama o Gemini 2.5 Flash ou aciona o fallback da Padaria Horizonte, exigindo conferência humana antes do cálculo. Também mapeamos a unificação das rotas e assinatura SigV4 no S3.

---

### `S09` · 7. Desenvolvimento (2/2) [1.0] — *Jornada de 5 etapas no ar (milet.vercel.app/diagnostico?demo=1)* (`5:20–6:05` · 45s)
**Direção de cena:** Indicar as 5 etapas, o código de `normalizeProposal`/`rankProposals` e os dois prints da interface em produção demo.

> Na segunda parte de Desenvolvimento, mostramos a jornada de 5 etapas publicada em milet.vercel.app/diagnostico em modo demo. O fluxo passa por triagem, upload OCR, conferência do Passaporte Energético, diagnóstico das três rotas — Mercado Livre, Geração Distribuída e Solar Local — e comparação final. Como mostra o trecho real de energy-engine.ts, evaluateEligibility verifica demanda de pelo menos 30 quilowatts ou Grupo A para habilitar o Mercado Livre. Depois, normalizeProposal e rankProposals somam todas as parcelas de custo e ordenam do menor ao maior valor mensal, usando exatamente a mesma função no navegador e nos testes.

---

### `S10` · 8. Segurança [1.0] — *OWASP ASVS 5.0.0 L1, Top 10:2025 e LLM Security no código* (`6:05–6:50` · 45s)
**Direção de cena:** Apontar para os quatro cards com trechos reais e para o callout coral de backlog obrigatório.

> No critério 8, Segurança: alinhamos nossos controles a OWASP ASVS 5.0.0 Nível 1, Top 10 e LLM Top 10 de 2025. No middleware aplicamos cabeçalhos estritos com nosniff, frame DENY e CSP default-src none. No PostgreSQL, além de RLS sob role sem superusuário, o trigger reject_audit_mutation garante auditoria imutável contra UPDATE e DELETE. Contra XSS em saída de LLM, api/v1/intakes aplica escapeHtml, verificado por teste automatizado com injeção de script e img onerror. Também garantimos modo fail-closed em erro 503 e rate limit de 3 requisições por 15 minutos, com backlog explícito para OIDC, SigV4 com antivírus, Redis e DPA LGPD.

---

### `S11` · 9. Validação [2.0] — *76 testes automatizados e 2 entrevistas reais via WhatsApp* (`6:50–7:50` · 60s)
**Direção de cena:** Detalhar à esquerda os 76 testes (`11 + 28 + 5 + 32`); à direita, as duas entrevistas reais (e o print anonimizado) e o status real de PostHog/`EXP-01`.

> No critério 9, Validação: apresentamos dois eixos estritamente verificados. No eixo automatizado, todos os 76 testes passam com saída zero, junto a typecheck e check: são 11 testes do legado estático, 28 da fundação incluindo 5 testes de RLS e triggers no PGlite, 5 testes das rotas serverless e 32 testes Vitest no Next.js com 100% de cobertura em 6 módulos de src. No campo, fizemos duas entrevistas reais via WhatsApp, omitindo contatos pela LGPD. Na demanda, Guilherme, da Dacoli Alimentos em Porto Feliz, controla energia em planilha, já tem solar, ignorou propostas e pediu auditoria para conferir se as placas entregam o prometido. Na oferta, a CGC Energia, em São José do Rio Preto, alertou que o vendedor some após ganhar comissão e condicionou o piloto à curadoria de atendimento. PostHog e o teste EXP-01 estão prontos em código, mas coleta real fica para Projetos II.

---

### `S12` · 10. Resultados [2.0] — *Comparativo All-In na Padaria Horizonte e entregáveis do MVP* (`7:50–8:55` · 65s)
**Direção de cena:** Mostrar o print `diag-04-propostas.png` e percorrer linha a linha a tabela de comparação All-In da Padaria Horizonte.

> No critério 10, Resultados: vemos a saída completa da Padaria Horizonte na Etapa 5, partindo do baseline cativo de 10.920 reais por mês na Cemig A4. Se somarmos apenas fio residual, energia, serviço Milet fixo de 190 reais e tributos, a Serra Clara totaliza 9.520 reais por mês — parecendo 200 reais mais barata que a Alvorada, que fecha em 9.720 reais. Porém, ao incluir na régua All-In a garantia bancária obrigatória de 420 reais por mês, a Serra Clara sobe para 9.940 reais e perde a liderança. O motor coloca a Alvorada em primeiro lugar, com economia líquida de 1.200 reais por mês, ou 11%, equivalente a 14.400 reais por ano. Além do MVP, da fundação PGlite e da matriz OWASP, a entrevista da Dacoli já originou o card US-021 no roadmap para auditar créditos solares na fatura.

---

### `S13` · 11. Conclusão e Próximos Passos [0.5] — *Contribuição técnica entregue e lacunas mapeadas para Projetos II* (`8:55–10:00` · 65s)
**Direção de cena:** Sintetizar as 4 contribuições, apresentar os 4 blocos de lacunas (`A`–`D`) e encerrar agradecendo a banca (deixando `S14` pronto para a arguição).

> Para concluir no critério 11: entregamos quatro contribuições técnicas comprovadas — núcleo TypeScript sem type drift com 100% de cobertura nos módulos testados, segurança desde a fundação validada em 76 testes, demonstração reproduzível da Padaria Horizonte no ar e escuta de campo que já alimentou o roadmap. Com igual rigor, mapeamos quatro blocos de lacunas para Projetos II entre fevereiro e junho de 2027. No bloco A: autenticação OIDC com MFA, 4 portais RBAC e matching-engine. No bloco B: unificação das APIs, PostgreSQL no Brasil, S3 com SigV4 e antivírus, e Redis. No bloco C: integração ANEEL e CCEE, schema unificado no Gemini e corpus de faturas B2B. No bloco D: ampliar o campo para 10 ou mais PMEs, 5 comercializadoras, cartas de intenção, DPA LGPD e 14 dias de experimento A/B no PostHog. Muito obrigado, professor Rodrigo e banca; abro o apêndice para a arguição técnica.

---

### `S14` · Apêndice: Referências e Reprodução (`Suporte aos 5 min de arguição` · 0s na fala principal)
**Direção de cena:** Não narrar nos 10 minutos; avançar para este slide caso a banca solicite referências bibliográficas, marcos regulatórios ou comandos para reproduzir os `76/76` testes e o caso Padaria Horizonte.

---

## Parte 2 — Guia Objetivo para Arguição (5 min de Perguntas Técnicas)

**Modo de uso na arguição:** Respostas curtas (20–30 segundos), indo direto ao mecanismo no código, à evidência de teste e à ressalva transparente do que fica para Projetos II.

### Q1. Por que monorepo TypeScript em vez de Python/FastAPI ou Go no backend?
- **Resposta direta (25s):** No setor elétrico brasileiro, regras tarifárias de Grupo A/B, demanda mínima de 30 kW e composição All-In mudam por resolução. Manter TypeScript único entre navegador e servidor elimina *type drift*: as mesmas funções puras (`validateInvoice`, `normalizeProposal`, `rankProposals`, `evaluateEligibility`) rodam na UI React 19, nas rotas serverless e nos testes sem reimplementação em outra linguagem. Além disso, o Next.js na Vercel tem *cold start* de ~50 ms contra 1–3 s de stacks Python pesadas, enquanto tarefas assíncronas e contínuas (Outbox polling, retry/DLQ e futuro scan antivírus) ficam isoladas no contêiner persistente `@milet/worker`.
- **Ressalva honesta:** Hoje `src/domain/energy-engine.ts` e `packages/domain/src/index.ts` ainda coexistem separados e `zod` será incorporado no Bloco 2 / `P1.1` (`docs/specs/plataforma-portais/tasks.md`) para unificar contratos.
- **Evidência exata:** `AGENTS.md:38-43`, `src/domain/energy-engine.ts:65-146`, `packages/domain/src/index.ts:1-135`, `apps/worker/src/outbox-worker.ts:46-191`.

### Q2. Como funciona o isolamento RLS + PGlite hoje e o que falta em OIDC/RBAC?
- **Resposta direta (25s):** Na fundação NestJS, o `TenantGuard` extrai `x-organization-id` e `x-user-id`, valida formato e permissão via `TenantAccessPort` e injeta o contexto na requisição. Antes de qualquer query, o `PostgresTenantDatabase` abre `BEGIN`, resolve o `public_id` para UUID interno e executa `SELECT set_config('app.organization_id', $1, true)` com escopo transacional. As migrações `001` a `006` ativam RLS em 8+1 tabelas, bloqueiam `UPDATE`/`DELETE` em `audit_events` via trigger `reject_audit_mutation()` e operam sob a role `milet_app` (`NOSUPERUSER`/`NOBYPASSRLS`), tudo testado em memória com `@electric-sql/pglite` nos 5 testes de `infra/test/`.
- **Ressalva honesta:** Falta substituir os headers sintéticos por OIDC/MFA com cookies `HttpOnly`, validar JWT e claims de `tenant_id`/`role` no servidor (`src/middleware.ts` + `TenantGuard`), bloquear headers sintéticos em `NODE_ENV=production` e criar as migrações dos 4 portais (`/portal/*`).
- **Evidência exata:** `apps/api/src/tenancy/tenant.guard.ts:20-30`, `apps/api/src/database/postgres-tenant-database.ts:50-59`, `infra/postgres/migrations/001_transactional_foundation.sql:145-173`, `infra/postgres/migrations/003_outbox_worker.sql:8-24` (`outbox_dead_letters`), `infra/postgres/migrations/006_app_role_grants.sql:3-11`, `apps/api/README.md:29-30,74-75`.

### Q3. Como a segurança do fluxo OCR e LLM protege contra Prompt Injection, XSS e vazamento?
- **Resposta direta (25s):** Aplicamos defesa em camadas alinhada ao OWASP ASVS 5.0.0 L1 e OWASP LLM Top 10:2025. Primeiro, allowlist estrita de MIME (`PDF/PNG/JPEG/WEBP`) e `GEMINI_API_KEY` exclusivamente server-side. Segundo, o modelo não tem *tools*, acesso a banco nem poder decisório (`LLM01`/`LLM06`): sua saída é sugestão e passa pela conferência humana (`step-invoice-review.tsx`) e por `validateInvoice()`. Terceiro, contra XSS (`LLM05`/`V5`), `api/v1/intakes.js` sanitiza toda saída com `escapeHtml()`, comprovado em `api/v1/intakes.test.js` injetando `<img onerror>` e `<script>`. Quarto, `api/v1/intakes.js` aplica fail-closed (`503`) e rate limit (`3 req/15 min`), e `api/v1/extract-invoice.js` aplica fail-closed (`503`).
- **Ressalva honesta:** `src/app/api/extract-invoice/route.ts` ainda aguarda unificação em `P0.1–P0.4` (para receber `503` fail-closed, rate limit, `responseSchema` e `temperature: 0.1` de `api/v1/extract-invoice.js`); antes de PII real, precisamos também adicionar assinatura AWS SigV4 + quarentena/antivírus em `uploadToS3` e migrar o rate limit de `Map` em memória para Redis/Upstash.
- **Evidência exata:** `docs/security/OWASP_ASVS_L1_INTAKE.md:30-80`, `api/v1/intakes.js:44-47,129-168`, `api/v1/intakes.test.js:33-54`, `api/v1/extract-invoice.js:10-40,156-195`, `src/app/api/extract-invoice/route.ts:4-9,48-50`.

### Q4. Por que o cálculo All-In inverteu o ranking da Padaria Horizonte entre Serra Clara e Alvorada?
- **Resposta direta (25s):** O baseline cativo da Padaria Horizonte na Cemig A4 (`12.480 kWh/mês`, `75 kW`) é `R$ 10.920/mês`. Somando apenas fio residual, energia, serviço fixo Milet (`R$ 190` igual nas duas) e tributos, a Serra Clara totaliza `R$ 9.520/mês` (`2.760 + 5.000 + 190 + 1.570`) e pareceria `R$ 200` mais barata que a Alvorada (`R$ 9.720/mês`). Contudo, a Serra Clara exige garantia bancária de `R$ 420/mês` (`costs.financing: 420`). A função `normalizeProposal()` soma todas as parcelas via `calculateBaseline(proposal.costs)`, elevando a Serra Clara para `R$ 9.940/mês` (`9,0%` de economia), e `rankProposals()` coloca a Alvorada em #1 (`R$ 9.720/mês`, economia de `R$ 1.200/mês` = `11,0%` = `R$ 14.400/ano`).
- **Ressalva honesta:** Os valores da Padaria Horizonte e das duas comercializadoras são dados sintéticos de demonstração reproduzíveis em `/diagnostico?demo=1`.
- **Evidência exata:** `src/app/diagnostico/page.tsx:57-94`, `src/domain/energy-engine.ts:79-103`.

### Q5. Por que apenas 2 entrevistas e 76 testes, por que PostHog/A-B não têm resultados e como Projetos II validará?
- **Resposta direta (25s):** Nossa diretriz foi reportar exclusivamente o que foi executado. No software, temos `76/76` testes (`11 + 28 + 5 + 32`, com 100% de cobertura Vitest em 6 módulos de `src/`) e `typecheck`/`check` verdes. Em campo, realizamos 2 entrevistas exploratórias reais no WhatsApp — Dacoli Alimentos (Guilherme, Porto Feliz/SP), que originou o card `US-021` de auditoria solar no roadmap, e CGC Energia (São José do Rio Preto/SP), que confirmou o atrito pós-comissão e o efeito TUSD — além do VOC documental.
- **Ressalva honesta:** O cliente PostHog (opt-in, sem PII) e o experimento `EXP-01` (hash FNV-1a 50/50 entre *"Fazer diagnóstico PME"* no protocolo `VALIDACAO_PROJETO_COMPUTACAO.md:24` — implementado em `src/domain/experiments.ts:23` como *"Começar diagnóstico PME"* — e *"Criar Passaporte Energético"*) estão codificados e testados (4 testes), mas seguem em `status: "collecting_data"` sem tráfego de produção. Em Projetos II (fev–jun/2027), após OIDC, DPA LGPD e Postgres no Brasil, rodaremos coleta com 10+ PMEs, 5+ comercializadoras, LOIs (`EXP-03`) e janela mínima de 14 dias do `EXP-01`.
- **Evidência exata:** `docs/academic/VALIDACAO_PROJETO_COMPUTACAO.md:15-43`, `src/domain/experiments.ts:18-85`, `src/lib/posthog-client.ts:16-49`, `src/content/roadmap.ts:111-118`, `docs/architecture/MVP_GAP_AUDIT_AND_PLAN.md:17,21-29`.

### Q6. Por que existem pilhas paralelas de API (`/api/*`, `api/v1/*`, `apps/api`) e como será a unificação?
- **Resposta direta (25s):** É uma dívida técnica explícita da nossa auditoria. `api/v1/*.js` nasceu no protótipo serverless inicial da Vercel (onde ficaram `extractionSchema` e `escapeHtml`); `apps/api` em NestJS foi estruturado como fundação transacional para PostgreSQL RLS e Outbox; e `src/app/api/*` surgiu na unificação para Next.js 16 para manter `/diagnostico` operante sem depender de banco externo. O plano `P0.1–P0.3` consolida a API em um caminho canônico (Next.js App Router como BFF ou proxy autenticado para `@milet/api` em região Brasil), portando `extractionSchema`, `escapeHtml`, `consentGranted === true` estrito e Resend idempotente, mantendo `/v1/*` apenas por rewrites temporários até deprecação.
- **Ressalva honesta:** Enquanto a unificação não ocorre, os controles mais rígidos de sanitização e schema residem em `api/v1/*`, e `src/app/api/*` atende a UI atual em modo demonstrativo.
- **Evidência exata:** `docs/architecture/MVP_GAP_AUDIT_AND_PLAN.md:15,62-64,83-86`, `vercel.json:5-7`.

### Q7. Por que o Outbox Pattern usa `FOR UPDATE SKIP LOCKED` + `claim_token` e onde o PGlite não basta?
- **Resposta direta (20s):** Para garantir entrega *at-least-once* sem duplicar o processamento quando múltiplos workers concorrem, o `PostgresOutboxStore` seleciona eventos pendentes com `FOR UPDATE SKIP LOCKED` e grava um `claim_token` (*fencing*), aplicando backoff exponencial até mover falhas persistentes para `outbox_dead_letters`.
- **Ressalva honesta:** Como documentado em `apps/api/README.md`, o PGlite roda em memória em processo único e não comprova contenção concorrente real — esse teste será repetido contra PostgreSQL real com duas sessões simultâneas em Projetos II, já hospedado em região Brasil (`gru` ou `southamerica-east1`).
- **Evidência exata:** `apps/worker/src/outbox-worker.ts:46-191`, `apps/api/README.md:74-75`.

### Q8. Como o upload de faturas lida com o limite de 4,5 MB da Vercel e layouts diferentes de Cemig?
- **Resposta direta (20s):** A auditoria detectou dois defeitos concretos em `step-invoice-upload.tsx`: a interface anuncia *"até 10 MB"* (que vira ~13,3 MB em JSON Base64 e estoura o teto de 4,5 MB da Vercel Serverless), e a linha `132` usa `|| invoice.contractedDemandKw || 75`, transformando demanda zero de Grupo B3 em `75 kW`. Nas tarefas `P2.1`/`P2.2`, limitaremos o upload direto a ≤ 1,5 MB (ou *presigned URL* direto para S3), trocaremos `||` por `??` zerando demanda de Grupo B e validaremos um corpus com 3 faturas sintéticas (Cemig A4 Verde, CPFL A4 Azul e Enel B3).
- **Ressalva honesta:** As 3 imagens sintéticas B2B ainda serão geradas e validadas na etapa de implementação pós-auditoria.
- **Evidência exata:** `docs/architecture/MVP_GAP_AUDIT_AND_PLAN.md:101-102,128-152`, `src/components/diagnostic/step-invoice-upload.tsx:132,248`.

### Q9. Se o Decreto 13.097/2026 prevê comparador público da CCEE, a Milet não fica obsoleta?
- **Resposta direta (20s):** Não, porque o artigo 10 do Decreto 13.097/2026 comoditiza justamente a vitrine estática de preços. A tese do nosso Estado da Arte (`S04`) parte dessa premissa: o valor de engenharia está no antes (extrair e estruturar o Passaporte Energético de 104 layouts heterogêneos), no durante (normalizar propostas incompatíveis em All-In e orquestrar o workflow de migração) e no depois (auditar mensalmente na fatura se a economia — ou a geração solar, como pediu a Dacoli — se concretizou).
- **Ressalva honesta:** A integração automática com dados abertos da ANEEL/CCEE e o acompanhamento contínuo pós-migração dependem da conclusão dos 4 portais e da conexão em produção em Projetos II.
- **Evidência exata:** `academico/n2/engenharia-da-computacao/presentation-computacao-n2.html:798,813-818`, `academico/decks/speaker-notes.md:40,56`.
