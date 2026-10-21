# Matriz de Tarefas: Plataforma Multitenant de Portais (tasks.md)

Este documento lista as tarefas ordenadas em **fatias verticais (tracer bullets)** com dependências e testes acoplados.

---

## Bloco 1: Infraestrutura e Roteamento Vercel (Concluído)

- [x] **1.1 Correção do Roteamento na Vercel e Página 404**
  - [x] 1.1.1 Configurar `"framework": "nextjs"` em `vercel.json` para forçar o build runner correto na Vercel.
  - [x] 1.1.2 Implementar página 404 de alto padrão com design system Milet em `src/app/not-found.tsx`.
  - [x] 1.1.3 Validar suíte de testes `npm test`, checagens estáticas e build completo do Next.js.

---

## Bloco 2: Contratos & Domínio de Matching (Próximo Passo)

- [ ] **2.1 Motor de Matching e Scoring de Viabilidade**
  - [ ] 2.1.1 Escrever cenários de teste BDD em `src/domain/matching-engine.test.ts` (Regra: cruzamento de submercado, demanda mínima e modalidade GD vs ACL).
  - [ ] 2.1.2 Implementar o serviço de matching puro em `src/domain/matching-engine.ts`.
  - [ ] 2.1.3 Adicionar DTOs e tipos TypeScript em `packages/contracts/src/portals.ts`.

---

## Bloco 3: Camada de Acesso & RBAC

- [ ] **3.1 Guardião de Autenticação e Sessão Multitenant**
  - [ ] 3.1.1 Escrever testes unitários em Vitest para validação de RBAC (`CONSUMIDOR`, `COMERCIALIZADORA`, `USINA`, `ADMIN`).
  - [ ] 3.1.2 Implementar middleware / decorador de sessão com controle de roles e tenant ID.
  - [ ] 3.1.3 Criar layout base `/src/app/portal/layout.tsx` com navegação contextual por papel.

---

## Bloco 4: Portais Especializados (Fatias Verticais)

- [ ] **4.1 Portal do Consumidor (`/portal/consumidor`)**
  - [ ] 4.1.1 Criar página de resumo de faturas e status de migração.
  - [ ] 4.1.2 Conectar visualizador de economia e histórico com o `@milet/domain`.
  - [ ] 4.1.3 Adicionar fluxo de aceite e download de proposta.

- [ ] **4.2 Portal da Comercializadora (`/portal/comercializadora`)**
  - [ ] 4.2.1 Criar mesa de leads qualificados com filtros de submercado e demanda.
  - [ ] 4.2.2 Implementar formulário de envio de proposta de energia com pricing dinâmico.
  - [ ] 4.2.3 Adicionar tela de acompanhamento de migrações na CCEE.

- [ ] **4.3 Portal da Usina / Gerador (`/portal/usinas`)**
  - [ ] 4.3.1 Criar formulário de cadastro de ativos de geração (solar, PCH, biogás).
  - [ ] 4.3.2 Implementar monitor de alocação de capacidade e gestão de cotistas de GD.

- [ ] **4.4 Console Backoffice Milet (`/portal/admin`)**
  - [ ] 4.4.1 Painel consolidado com métricas globais de MWh transacionados e comissões.
  - [ ] 4.4.2 Visualizador da trilha imutável de auditoria com hashes criptográficos.
