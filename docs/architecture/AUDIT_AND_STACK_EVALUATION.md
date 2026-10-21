# Auditoria Técnica e Avaliação de Stack · Milet

> **Data:** 21 de outubro de 2026  
> **Status:** Aprovado para Unificação  
> **Escopo:** Avaliação arquitetural, análise comparativa de frameworks, governança de dados e plano de convergência.

---

## 1. Contexto e Motivação da Auditoria

O projeto Milet evoluiu de um protótipo inicial estático focado em validação de marca e conceito (Stage 1 a Stage 4) para uma plataforma tecnológica transacional (Stage 5 e 6) voltada à migração e gestão de energia no Mercado Livre de Energia (ACL) para PMEs do Grupo A.

Essa evolução rápida resultou em uma **dualidade arquitetural**:
1. Uma fundação moderna em **Next.js (App Router, React 19, TypeScript, Tailwind CSS v4, Motion)** contendo a nova Landing Page (`src/app/page.tsx`), o motor de diagnóstico e intake (`src/app/diagnostico/page.tsx`) e Route Handlers (`src/app/api/`).
2. Páginas institucionais e de transparência legadas em **HTML/CSS/JS estático** na raiz (`build-in-public.html`, `roadmap.html`, `brandbook.html`), exigindo scripts customizados de cópia (`scripts/build-static-site.mjs`) e verificações sintáticas concorrentes (`check-site.js`).

Esta auditoria responde objetivamente: **Por que esta stack foi escolhida? Quais foram as alternativas rejeitadas? Qual é a recomendação definitiva para consolidar o projeto?**

---

## 2. Avaliação da Stack Tecnológica

### 2.1. Framework Fullstack: Next.js (App Router) vs Alternativas

| Critério | Next.js (App Router) | Vite + React SPA | Remix / React Router v7 | Astro | SvelteKit / Nuxt |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEO & SSR Público** (Landing, Changelog, Roadmap) | **Excelente** (Server Components geram HTML sem overhead de hidratação) | **Fraco** (requer pré-renderização complexa ou SSR manual) | **Excelente** (SSR nativo) | **Excelente** (foco em conteúdo estático) | **Bom / Excelente** |
| **Aplicações Interativas Complexas** (Wizard de Diagnóstico, Comparador) | **Excelente** (Client Islands com React 19 + Server Actions / Route Handlers) | **Excelente** | **Excelente** | **Médio** (requer islands de React com hidratação sob demanda) | **Bom** |
| **Proteção de Segredos & Backend Integrado** (Gemini, S3, Resend) | **Nativo** (código de servidor nunca vaza para o bundle do cliente) | **Inexistente** (exige API backend separada) | **Nativo** (loaders/actions) | **Nativo** (endpoints) | **Nativo** |
| **Ecossistema & Adoção no Brasil** | **Líder absoluto** de mercado | Muito alto | Médio | Médio / Crescente | Baixo / Médio |
| **Integração com Vercel / Edge** | **Zero-config** de primeira classe | Requer configuração de rewrites | Bom | Bom | Bom |

#### Por que Next.js App Router é a stack mais recomendada:
1. **Unificação de superfícies:** A Milet não é apenas um site estático (como um blog) nem apenas um dashboard fechado (como um SPA interno). É um produto híbrido: precisa de páginas públicas ultrarrápidas e indexáveis (Landing, Build in Public, Roadmap) e, simultaneamente, de fluxos autenticados e pesados de engenharia de dados (upload de fatura, OCR com Gemini, simulação tarifária instantânea). O Next.js resolve ambos em um único repositório sem a complexidade de manter dois deploys independentes.
2. **Segurança de API sem servidor extra:** O upload de faturas exige assinar URLs para buckets S3 privados e enviar imagens para a API do Google Gemini com chaves de API secretas. Com os Route Handlers do Next.js (`src/app/api/*`), o segredo nunca toca o navegador do cliente.

---

### 2.2. Linguagem e Tipagem: TypeScript End-to-End

- **Decisão:** TypeScript strict com workspaces npm (`apps/*`, `packages/*`).
- **Justificativa:** No setor de energia elétrica brasileiro, os cálculos de demanda (kW), consumo na ponta e fora de ponta (kWh), tarifas TUSD e TE, e alíquotas tributárias (PIS, COFINS, ICMS) lidam com dezenas de variáveis de alta precisão. Qualquer incoerência de tipo ou campo ausente causaria propostas distorcidas. O TypeScript compartilhado via `@milet/contracts` e `@milet/domain` garante que o backend, o frontend e os testes utilizem exatamente o mesmo contrato canônico.

---

### 2.3. Estilização e Motion: Tailwind CSS v4 + Motion

- **Decisão:** Tailwind CSS v4 com variáveis semânticas de Brandbook (`--color-milet-amber: #CC8800`, `--color-milet-canvas: #090B0E`, etc.) + `motion` (Framer Motion).
- **Por que não styled-components ou CSS-in-JS legado?** CSS-in-JS em tempo de execução adiciona overhead significativo no tempo de renderização e conflita com React Server Components. O Tailwind v4 compila em CSS estático de alto desempenho com suporte direto ao novo compilador do Tailwind.
- **Por que `motion`?** Garante física de animação consistente (`cubic-bezier`, molas, transições de layout suaves) para micro-interações de dados, mantendo fidelidade aos princípios da skill `/impeccable` e `/find-animation-opportunities`.

---

### 2.4. Inteligência Artificial Multimodal: Google Gemini 1.5/2.0 Flash

- **Decisão:** Gemini Flash via SDK oficial do Google.
- **Justificativa frente a GPT-4o e Claude 3.5 Sonnet:**
  1. **Tamanho da janela de contexto:** Capacidade de receber faturas multipáginas inteiras de concessionárias em alta resolução.
  2. **Estruturação JSON nativa:** Suporte a `responseSchema` com validação de esquema estrita.
  3. **Custo e Latência:** O processamento com Gemini Flash custa uma fração do valor de modelos concorrentes, permitindo que a Milet ofereça diagnóstico gratuito para PMEs com viabilidade econômica unitária sustentável.

---

### 2.5. Banco de Dados e Isolamento: PostgreSQL + RLS + Outbox Pattern

- **Decisão:** PostgreSQL com Row-Level Security (RLS) mandatário por tenant, tabela de auditoria append-only e Outbox Pattern para processamento assíncrono.
- **Justificativa:** Faturas de energia são documentos comerciais protegidos por sigilo fiscal e LGPD. O uso de RLS no nível do banco garante que, mesmo em caso de falha lógica em uma query de aplicação, um cliente jamais consiga visualizar os dados de outro tenant. O Outbox Pattern assegura entrega garantida de eventos para notificações de e-mail e workers sem perda de mensagens.

---

## 3. Padrão Arquitetural e Nomenclatura

### 3.1. Arquitetura Hexagonal / DDD (Domain-Driven Design)
O código está organizado em camadas concêntricas com inversão de dependência:
```
┌─────────────────────────────────────────────────────────────┐
│                    Entrada / Adaptadores                    │
│      Next.js (src/app/)  |  apps/api  |  apps/worker       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     Contratos e Tipos                        │
│                   @milet/contracts                           │
│               (OpenAPI, JSON Schemas)                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Domínio Puro (Core)                      │
│                      @milet/domain                           │
│       (Tarifas, Mercado Livre, CCEE, Validações)             │
│            [Zero dependências de frameworks]                │
└─────────────────────────────────────────────────────────────┘
```

### 3.2. Padrões de Nomenclatura
- **Diretórios e Arquivos de Código:** `kebab-case` estrito (ex: `energy-engine.ts`, `route-handlers.test.ts`, `build-in-public`). Previne quebras em sistemas de arquivos case-sensitive (Linux no GitHub Actions e Vercel vs Windows local).
- **Componentes React:** `PascalCase` nas declarações e exportações (`Navbar`, `ComparisonSection`).
- **Pacotes Internos do Monorepo:** `@milet/<pacote>`.
- **Commits:** Conventional Commits (`feat(...)`, `fix(...)`, `refactor(...)`).

---

## 4. Auditoria de Dívida Técnica e Plano de Ação

| Item | Estado Atual | Risco / Problema | Solução Recomendada |
| :--- | :--- | :--- | :--- |
| **Páginas Institucionais** | HTML estático solto na raiz (`build-in-public.html`, `roadmap.html`) | Fragmentação de design, duplicidade de layout e dependência de script `build-static-site.mjs`. | **Migrar para `src/app/build-in-public/page.tsx` e `src/app/roadmap/page.tsx`**, unificando na mesma árvore Next.js. |
| **API Endpoints** | Duplicidade: `api/v1/*.js` na raiz e `src/app/api/*/route.ts` | Confusão sobre qual endpoint atende a produção na Vercel. | Consolidar nos Route Handlers do Next.js (`src/app/api/`) com testes Vitest já integrados. |
| **Verificações de CI (`check-site.js`)** | Script checa arquivos `.html` na raiz antes do build | Quebra no GitHub Actions se houver referências a arquivos gerados dinamicamente em `public/`. | Ajustar o script para verificar rotas ativas do Next.js e caminhos de arquivo reais. |

---

## 5. Veredito da Auditoria

A stack tecnológica **Next.js (App Router) + TypeScript + PostgreSQL (RLS) + Tailwind v4 + Gemini** é **tecnicamente superior, economicamente viável e arquiteturalmente sólida** para os objetivos de negócio e produto da Milet.

A recomendação imediata é **eliminar a camada de HTML estático legado**, migrando as rotas públicas diretamente para componentes Next.js nativos.
