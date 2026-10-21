# Memória Compartilhada e Diretrizes de Agentes · Milet (AGENTS.md)

Este documento é a fonte única de contexto, memória e regras operacionais compartilhada entre todos os agentes e sessões de desenvolvimento (Antigravity IDE, Claude Code, Gemini CLI e OpenAI Codex).

---

## 1. Visão Geral do Produto e Posicionamento

- **O que é a Milet:** Plataforma independente de inteligência energética e matching que desmistifica a conta de luz e conecta consumidores (PMEs e indústrias) a Comercializadoras Varejistas (Mercado Livre / ACL) e Geradores de Energia (Geração Distribuída / GD e Autoprodução).
- **Proposta de Valor:** Transparência radical e cálculo determinístico auditável. A Milet não é uma comercializadora disfarçada de software; ela atua como árbitro técnico neutro comissionado por sucesso e recorrência.
- **Momento Atual:** Candidatura ao **Sebrae Supernova 2026** (Pitch v3 gravado por Eduardo, 3:00, foco em dor real de PME, unit economics e demonstração navegável do diagnóstico).

---

## 2. Histórico de Sessões Recentes (Claude & Antigravity)

1. **Roteiro de Pitch Supernova v3:**
   - [supernova/pitch/roteiro.md](file:///c:/Users/Lenovo/Desktop/milet/supernova/pitch/roteiro.md) calibrado para 3 minutos no estilo *talking head* com motion graphics e evidências de mercado VOC ([supernova/pesquisa/voc-evidencias-mercado.md](file:///c:/Users/Lenovo/Desktop/milet/supernova/pesquisa/voc-evidencias-mercado.md)).
2. **Unificação Next.js 16 (App Router + Turbopack):**
   - As páginas públicas [/build-in-public](file:///c:/Users/Lenovo/Desktop/milet/src/app/build-in-public/page.tsx) e [/roadmap](file:///c:/Users/Lenovo/Desktop/milet/src/app/roadmap/page.tsx) foram migradas de arquivos HTML estáticos para componentes Next.js nativos tipados com dados em [src/content/status.ts](file:///c:/Users/Lenovo/Desktop/milet/src/content/status.ts), [src/content/changelog.ts](file:///c:/Users/Lenovo/Desktop/milet/src/content/changelog.ts) e [src/content/roadmap.ts](file:///c:/Users/Lenovo/Desktop/milet/src/content/roadmap.ts).
   - Preservação de 100% dos dados históricos (#000 a #005) e adição da entrada #006 documentando a arquitetura dos 4 portais.
3. **Resolução de Erro de Deploy Vercel (404 Not Found):**
   - Diagnóstico: O projeto na Vercel estava configurado como estático (`output: public`).
   - Solução: Adicionado `"framework": "nextjs"` em [vercel.json](file:///c:/Users/Lenovo/Desktop/milet/vercel.json) e criada página [src/app/not-found.tsx](file:///c:/Users/Lenovo/Desktop/milet/src/app/not-found.tsx) com a identidade visual da marca Milet.
4. **Fundação SDD / BDD / TDD:**
   - Criados [docs/constitution.md](file:///c:/Users/Lenovo/Desktop/milet/docs/constitution.md), [docs/specs/plataforma-portais/spec.md](file:///c:/Users/Lenovo/Desktop/milet/docs/specs/plataforma-portais/spec.md), [docs/specs/plataforma-portais/plan.md](file:///c:/Users/Lenovo/Desktop/milet/docs/specs/plataforma-portais/plan.md) e [docs/specs/plataforma-portais/tasks.md](file:///c:/Users/Lenovo/Desktop/milet/docs/specs/plataforma-portais/tasks.md) para orientar o desenvolvimento da área de membros dos 4 portais (`CONSUMIDOR`, `COMERCIALIZADORA`, `USINA`, `ADMIN`).

---

## 3. Arquitetura Técnica e Decisões de Stack

- **Stack Escolhida:**
  - **Fullstack:** Next.js 16 + React 19 + TypeScript Monorepo.
  - **Domínio Puro (`@milet/domain`):** Fórmulas de apuração tarifária ANEEL, bandeiras e cálculo de economia compartilhados entre cliente (simulações instantâneas) e servidor (validações estritas).
  - **Contratos (`@milet/contracts`):** Schemas Zod/JSON-Schema compartilhados de ponta a ponta.
  - **Banco de Dados:** PostgreSQL com Row-Level Security (RLS) multitenant na Railway + `@electric-sql/pglite` para testes de integração ultra-rápidos em memória.
  - **IA de Extração:** Gemini 2.5 Flash Multimodal para OCR de faturas de energia com fallback sintético determinístico.
- **Por que não stacks heterogêneas (ex: Python/FastAPI ou Go no backend)?**
  - **Zero Type Drift:** No setor elétrico, regras tarifárias mudam com frequência. Manter TypeScript no frontend e backend permite que a mesma função matemática e tipagem de fatura execute no navegador e na API sem descompasso de schemas.
  - **Cold Start e Serverless:** Next.js na Vercel opera com cold-starts de ~50ms. Runtimes de Python (FastAPI/Django) em serverless impõem overheads de inicialização de pacotes pesados (Pydantic, Pandas) de 1s a 3s.
  - **Orquestração Persistente:** Serviços que exigem conexão contínua e workers assíncronos (fila Outbox, polling) residem no `@milet/worker` rodando em contêiner persistente na Railway.

---

## 4. Mapa Operacional: APIs vs Concierge/Backoffice Humano

| Processo Energético | Camada de Execução | Viabilidade e Solução |
| :--- | :--- | :--- |
| **Tarifas Vigentes e Bandeiras** | **API Automatizada** | APIs públicas de dados abertos da ANEEL (tarifas homologadas de TUSD/TE por concessionária) e CCEE (PLD horário). |
| **Extração de Faturas de Energia** | **API Automatizada** | Gemini Multimodal com prompt estruturado + validação de checksum matemático. |
| **Simulação de Economia GD / ACL** | **API Automatizada** | `@milet/domain` processando grupos tarifários (A4, B3), demanda contratada e sazonalidade. |
| **Solicitação de Migração na Distribuidora** | **Concierge / Backoffice Assistido** | A maioria das 104 distribuidoras brasileiras exige envio de Carta de Denúncia via portal autenticado do titular ou protocolo por e-mail com assinatura digital do representante legal. A plataforma gera o documento pré-preenchido e o concierge acompanha o protocolo. |
| **Habilitação e Liquidação na CCEE** | **Comercializadora Parceira** | No ACL Varejista, a responsabilidade perante a CCEE é 100% da Comercializadora Varejista parceira. A Milet integra via webhook/API com a comercializadora para monitorar o status. |
| **Adesão a Consórcio/Cooperativa de GD** | **Híbrido (DocuSign/Gov.br + Backoffice)** | Assinatura digital do termo de adesão pelo consumidor e homologação pelo operador da usina junto à distribuidora. |

---

## 5. Regras Inegociáveis para Agentes

1. **Idioma:** Toda comunicação com o usuário deve ser em **Português do Brasil (PT-BR)**, técnica, concisa e acionável.
2. **Git & Commits:**
   - Usar estritamente Conventional Commits: `<type>(<scope>): <subject>`.
   - **NUNCA executar `git push` sem autorização explícita.**
   - Apresentar diffs antes de alterações críticas.
3. **Qualidade de Código:**
   - NUNCA quebrar os scripts de verificação: `npm run check`, `npm run typecheck`, `npm test` e `npm run build` devem permanecer 100% verdes.
4. **Preservação de Conteúdo:**
   - Jamais apagar código legado ou histórico de documentação sem criar substitutos equivalentes e aprovados.
