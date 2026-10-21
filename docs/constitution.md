# Constituição Técnica e Arquitetural Milet (constitution.md)

Este documento define as leis arquiteturais invioláveis do repositório Milet. Todo agente e desenvolvedor deve consultá-lo e segui-lo rigorosamente antes de propor ou alterar código.

---

## 1. Princípios Invioláveis

1. **Domínio Puro e Isolado (`@milet/domain`):**
   - A lógica de cálculos tarifários (TUSD, TE, bandeiras, demanda contratada, abatimento de GD, economia de ACL) reside exclusivamente em `@milet/domain`.
   - O domínio não possui dependências de frameworks web (Next.js, Express), bancos de dados ou bibliotecas externas de UI.

2. **Segurança Multitenant e Isolamento RLS:**
   - Todo dado sensível de fatura, proposta e telemetria é estritamente isolado por `tenant_id` e protegido por Row-Level Security (RLS) no PostgreSQL.
   - Nenhuma query ao banco de dados pode ser executada sem contexto transacional de tenant autenticado.

3. **Governança Regulatória e LGPD:**
   - Consentimento explícito do titular da fatura é obrigatório antes de qualquer processamento, extração com IA (Gemini multimodal) ou arquivamento seguro (S3).
   - Cálculos e estimativas devem respeitar a regulamentação vigente da ANEEL (Resoluções 1.000/2021, 1.011/2022, 1.014/2022, Lei 14.300/2022 e Portaria Normativa 50/2022).

4. **Zero Dependências Supérfluas:**
   - Antes de adicionar qualquer pacote ao `package.json`, justifique custo/benefício e utilize os recursos nativos da stack.
   - Proibido o uso de Tailwind plugins não estritamente necessários, componentes inchados ou parsers secundários.

5. **Tríade de Engenharia: SDD + BDD + TDD:**
   - **Macro (SDD):** Toda nova funcionalidade nasce com `spec.md`, `plan.md` e `tasks.md`.
   - **Meso (BDD):** Critérios de aceitação expressos em Gherkin com exatamente UM `When` por cenário.
   - **Micro (TDD):** Ciclo Red-Green-Refactor em fatias verticais (*tracer bullets*), garantindo 100% de cobertura nos contratos públicos.

---

## 2. Stack Tecnológica Padronizada

| Camada | Tecnologia Adotada | Justificativa |
| :--- | :--- | :--- |
| **Frontend / Web** | Next.js 16 (App Router + Turbopack) + React 19 | SSR/SSG veloz, SEO/GEO nativo, Server Actions para transações protegidas. |
| **Estilização** | CSS Modules + Tailwind CSS v4 + Design Tokens Milet | Estética editorial de alto padrão (*Warm Stone & Milet Amber*), sem dependências pesadas de UI. |
| **Backend & APIs** | Node.js 22 LTS + Next.js Route Handlers + `@milet/api` | Rápido cold-start em serverless Vercel e serviço persistente na Railway. |
| **Banco de Dados** | PostgreSQL com RLS na Railway + `@electric-sql/pglite` para testes locais | Segurança por tenant a nível de banco; testes locais ultra-rápidos e determinísticos sem mocks. |
| **Testes** | Vitest (Next/unit/domain) + Node Test Runner (`node:test`) | Execução paralela em milissegundos com relatórios v8 de cobertura. |
| **Extração Inteligente** | Gemini 2.5 Flash Multimodal (com fallback sintético determinístico) | Leitura estruturada de faturas PDF/imagem sem bloqueio em produção. |

---

## 3. Matriz de Perfis e Acesso (RBAC)

A plataforma Milet possui 4 personas com fronteiras de acesso bem definidas:

1. **`CONSUMIDOR` (PME / Grupo A & B):**
   - Visualiza apenas seus próprios imóveis/faturas, diagnósticos de economia, status de migração e contratos assinados.
2. **`COMERCIALIZADORA` (Varejista ACL):**
   - Visualiza leads qualificados atribuídos, envia propostas de energia com pricing customizado, acompanha aceite e documentação CCEE.
3. **`USINA` (Gerador GD / Consórcio / Autoprodução ACL):**
   - Cadastra ativos de geração, monitora injeção de créditos, alocação de cotas de consumidores e faturamento de assinatura.
4. **`ADMIN` (Backoffice Milet):**
   - Gestão global de tenants, matching algorítmico, auditoria append-only, monitoramento de saúde e liquidação de comissões/success fee.

---

## 4. Padrões de Qualidade e CI/CD

- **Comandos Obrigatórios antes de Qualquer Commit:**
  - `npm run check` (Sintaxe, integridade estática e links)
  - `npm run typecheck` (Tipagem TypeScript estrita sem `any` implícito)
  - `npm test` (Suite completa de testes unitários e de integração)
  - `npm run build` (Build de fundação, arquivos estáticos e Next.js App Router)
- **Commits:** Conventional Commits (`feat(scope): ...`, `fix(scope): ...`) no imperativo, ≤ 72 caracteres.
- **Git Push:** NUNCA executar push automático sem autorização e validação expressa do usuário.
