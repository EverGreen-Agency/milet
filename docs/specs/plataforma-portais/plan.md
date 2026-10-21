# Plano Técnico de Implementação: Plataforma Multitenant de Portais Milet (plan.md)

- **Feature:** Plataforma Multitenant de Portais (Fase 3 SDD)
- **Status:** Planejamento Arquitetural Concluído
- **Data:** 2026-10-21

---

## 1. Arquitetura e Fronteiras Públicas (Seams)

A plataforma é desenhada segundo os princípios de Clean Architecture e isolamento modular em TypeScript:

```
┌────────────────────────────────────────────────────────┐
│                   Next.js App Router                   │
│   /portal/consumidor   |  /portal/comercializadora     │
│   /portal/usinas       |  /portal/admin                │
└──────────────────────────┬─────────────────────────────┘
                           │ Server Actions / API Routes
                           ▼
┌────────────────────────────────────────────────────────┐
│             @milet/contracts (Seam de Tipos)           │
│   Schemas Zod/JSON-Schema, DTOs de Propostas & Faturas │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│             @milet/domain (Lógica Pura de Energia)     │
│   Tarifas ANEEL, Matching Engine, Economia GD/ACL      │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│          @milet/api (Persistência & Repositórios)      │
│   PostgreSQL + RLS (Railway) | Trilha Imutável de Audit│
└────────────────────────────────────────────────────────┘
```

### Seams Sob Teste (Pre-Agreed Boundaries para TDD):
1. **`AuthGuardSeam`:** Middleware / decorador de sessão que extrai o tenant e valida se a role do usuário possui permissão para a rota.
2. **`EnergyEngineSeam` (`@milet/domain`):** Cálculo de viabilidade tarifária (Cativo vs ACL vs GD).
3. **`ProposalMatchingSeam` (`@milet/domain`):** Motor de matching que cruza a demanda/submercado do lead com as usinas disponíveis e tabelas de preço das comercializadoras.
4. **`TenantRepositorySeam` (`@milet/api`):** Camada de dados com injeção automática de `tenant_id` em transações do PostgreSQL com RLS.

---

## 2. Modelo de Dados e Esquema de Tabelas (PostgreSQL RLS)

```sql
-- 1. Tenants e Perfis de Acesso
CREATE TYPE user_role AS ENUM ('CONSUMIDOR', 'COMERCIALIZADORA', 'USINA', 'ADMIN');

CREATE TABLE tenants (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    document VARCHAR(18) NOT NULL, -- CNPJ / CPF
    role user_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Casos de Diagnóstico / Leads
CREATE TABLE energy_cases (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id),
    distributor VARCHAR(50) NOT NULL,
    submarket VARCHAR(20) NOT NULL, -- SE/CO, S, NE, N
    voltage_group VARCHAR(10) NOT NULL, -- A4, A3a, B3
    consumption_kwh NUMERIC(12, 2) NOT NULL,
    contracted_demand_kw NUMERIC(10, 2),
    status VARCHAR(30) NOT NULL DEFAULT 'ANALYZED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Ativos de Usinas (GD e ACL)
CREATE TABLE generation_assets (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(30) NOT NULL, -- SOLAR, PCH, BIOMASSA, EOLICA
    modality VARCHAR(30) NOT NULL, -- GD_COMPARTILHADA, AUTOPRODUCAO_ACL
    capacity_kw NUMERIC(10, 2) NOT NULL,
    available_kw NUMERIC(10, 2) NOT NULL,
    distributor VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'
);

-- 4. Propostas de Comercializadoras / Usinas
CREATE TABLE energy_proposals (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL REFERENCES energy_cases(id),
    supplier_tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id),
    proposal_type VARCHAR(30) NOT NULL, -- ACL_VAREJISTA, GD_ASSINATURA, AUTOPRODUCAO
    discount_percentage NUMERIC(5, 2),
    fixed_kwh_rate NUMERIC(10, 4),
    contract_term_months INT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Auditoria Append-Only
CREATE TABLE audit_trail (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    actor_id VARCHAR(36) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(36) NOT NULL,
    payload JSONB NOT NULL,
    hash VARCHAR(64) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Inventário de Arquivos a Criar/Modificar

### Novos Arquivos:
- `src/app/portal/layout.tsx` (Layout compartilhado dos portais com barra lateral expansível e alternância de temas)
- `src/app/portal/consumidor/page.tsx` (Painel do Consumidor: faturas e diagnósticos)
- `src/app/portal/comercializadora/page.tsx` (Mesa de Pricing e leads para Comercializadoras)
- `src/app/portal/usinas/page.tsx` (Painel de Ativos e cotas de usinas)
- `src/app/portal/admin/page.tsx` (Console Backoffice Milet)
- `src/domain/matching-engine.ts` (Motor de matching entre leads, usinas e comercializadoras)
- `src/domain/matching-engine.test.ts` (Testes BDD/TDD do motor de matching)
- `packages/contracts/src/portals.ts` (Contratos e DTOs tipados dos portais)

### Arquivos Existentes a Preservar:
- `src/domain/energy-engine.ts` (Permanece como o núcleo de cálculo tarifário ANEEL)
- `src/app/diagnostico/page.tsx` (Permanece como a experiência pública de intake/demo do pitch)
- `src/app/not-found.tsx` (Página 404 personalizada)

---

## 4. Plano de Segurança e Rollback

- **Segurança:** Todo acesso a `/portal/*` é interceptado por middleware verificando cookie de sessão JWT/Auth.
- **Rollback:** As migrações de banco são incrementais e reversíveis (scripts `down`). O frontend do Next.js continuará servindo a landing page e a ferramenta de diagnóstico sem interrupções mesmo durante a liberação dos novos módulos.
