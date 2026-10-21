# Especificação: Plataforma Multitenant de Portais Milet (spec.md)

- **Feature:** Plataforma Unificada de Gestão de Energia e Matching (4 Portais)
- **Status:** Proposta de Arquitetura & Planejamento (SDD Fase 2)
- **Versão:** 1.0.0
- **Data:** 2026-10-21

---

## 1. Visão Geral e Valor de Negócio

A Milet é a plataforma independente de inteligência e matching entre consumidores de energia (PMEs e indústrias), comercializadoras varejistas de ACL e geradores de usinas (GD e Autoprodução). 

Atualmente o MVP conta com intake de faturas e diagnóstico tarifário navegável. Esta especificação formaliza a expansão para os **4 Portais Especializados** com controle de acesso baseado em papéis (RBAC) e isolamento multitenant estrito.

---

## 2. Personas e User Stories

### Persona 1: Consumidor de Energia (PME / Grupo A ou B)
> **US-01:** Como **Consumidor**, quero fazer upload da minha fatura de energia e ver um diagnóstico detalhado com comparação de economia entre Mercado Livre (ACL) e Geração Distribuída (GD), para que eu possa tomar uma decisão informada sem depender de consultores tendenciosos.
>
> **US-02:** Como **Consumidor**, quero acompanhar o status da minha migração ou adesão de cota de GD em tempo real com alertas de prazos da concessionária, para garantir que não haja cobranças indevidas na transição.

### Persona 2: Comercializadora Varejista (ACL)
> **US-03:** Como **Comercializadora**, quero receber leads qualificados com faturas já pré-auditadas (histórico de consumo, demanda ponta/fora de ponta e submercado CCEE), para que minha equipe envie propostas de fornecimento em minutos com pricing dinâmico.
>
> **US-04:** Como **Comercializadora**, quero gerenciar os contratos vigentes dos meus clientes varejistas e notificar a Milet sobre confirmações de migração na CCEE para liquidação de success fee.

### Persona 3: Usina / Gerador (GD Compartilhada & Autoprodução ACL)
> **US-05:** Como **Gerador/Usina**, quero cadastrar meus ativos de geração (capacidade MWp, concessionária local, fonte solar/PCH) e disponibilizar cotas de injeção para consumidores de GD ou lastro de energia para contratos de autoprodução no ACL.
>
> **US-06:** Como **Gerador/Usina**, quero visualizar o mapa de alocação de créditos e os relatórios de faturamento mensal de assinatura de energia injetada.

### Persona 4: Administrador Backoffice (Equipe Milet)
> **US-07:** Como **Admin Milet**, quero monitorar o funil de intakes de faturas, taxas de conversão de propostas, saúde dos conectores Gemini/concessionárias e trilha imutável de auditoria.
>
> **US-08:** Como **Admin Milet**, quero aprovar o credenciamento de comercializadoras e usinas parceiras garantindo compliance regulatório ANEEL/CCEE.

---

## 3. Delimitação de Escopo (Scope Boundaries)

### Em Escopo (IN SCOPE)
1. **Autenticação Segura & RBAC:** Sessões com papéis `CONSUMIDOR`, `COMERCIALIZADORA`, `USINA` e `ADMIN`.
2. **Dashboard do Consumidor:** Visualização de faturas arquivadas, gráficos de consumo sazonal, diagnósticos salvos e propostas recebidas.
3. **Mesa de Pricing da Comercializadora:** Visualização de leads anonimizados, envio de propostas de fornecimento (preço fixo kWh ou desconto garantido sobre a tarifa cativa) e gestão de contratos.
4. **Painel de Ativos da Usina:** Cadastro de usinas, controle de capacidade instalada vs alocada, gestão de cotistas de GD.
5. **Console Administrativo Milet:** Gestão de tenants, aprovação de fornecedores, visualização de logs de auditoria e cálculo de comissões.
6. **Políticas RLS no PostgreSQL:** Nenhuma entidade acessa dados de outro tenant.

### Fora de Escopo (OUT OF SCOPE - Fases Futuras)
1. Conexão direta via scraping autenticado nos portais de todas as 104 distribuidoras do Brasil (foco atual em intake por PDF/imagem e APIs oficiais abertas).
2. Agente de liquidação direta de garantias na CCEE pela Milet (a responsabilidade de liquidação é da Comercializadora Varejista credenciada perante a CCEE).
3. Processamento de pagamentos de cartão de crédito no portal (pagamentos de energia ocorrem via boleto/fatura das comercializadoras/distribuidoras).

---

## 4. Critérios de Aceitação BDD (Gherkin Scenarios)

### Feature 1: Isolamento de Acesso e Autenticação Multitenant

```gherkin
Scenario: Consumidor tenta acessar área restrita de comercializadora
  Given um usuário autenticado com perfil "CONSUMIDOR"
  When ele tenta acessar a rota restrita "/portal/comercializadora/leads"
  Then o sistema bloqueia o acesso com status 403 Forbidden
  And o evento de tentativa não autorizada é registrado na trilha de auditoria
```

```gherkin
Scenario: Comercializadora visualiza dados de fatura de lead com consentimento
  Given um consumidor enviou sua fatura e marcou o consentimento de compartilhamento
  And uma comercializadora credenciada está autenticada no portal
  When a comercializadora consulta o lead qualificado no seu painel
  Then o sistema exibe os dados técnicos pré-auditados de demanda e consumo
  And os dados pessoais do titular permanecem mascarados até o envio de proposta
```

---

### Feature 2: Mesa de Propostas da Comercializadora

```gherkin
Scenario: Comercializadora submete proposta de economia garantida para lead Grupo A
  Given um lead qualificado do submercado Sudeste/Centro-Oeste com demanda de 150 kW
  And a comercializadora parceira formula uma oferta de 22% de desconto sobre a tarifa de energia
  When a comercializadora confirma o envio da proposta pela plataforma
  Then a proposta é vinculada ao caso do consumidor com status "PENDING_REVIEW"
  And o consumidor recebe uma notificação com o comparativo de economia anual projetada
```

---

### Feature 3: Cadastro e Alocação de Ativos de Usina

```gherkin
Scenario: Usina cadastra nova planta solar para Geração Distribuída
  Given uma usina solar de 1.5 MWp aprovada na área de concessão da Cemig
  When o operador da usina cadastra a planta no Portal da Usina
  Then a usina fica disponível no catálogo com capacidade total de 1.5 MWp
  And o backoffice Milet recebe o alerta para validação documental de parecer de acesso
```

```gherkin
Scenario: Alocação automática de consumidor em cota de GD
  Given uma usina de GD com saldo de geração disponível de 50.000 kWh/mês
  And um consumidor do Grupo B com consumo médio de 3.200 kWh/mês aprovado
  When o algoritmo de matching vincula o consumidor à usina
  Then o saldo de capacidade disponível da usina é reduzido para 46.800 kWh/mês
  And o contrato de associação ao consórcio de GD é gerado para assinatura digital
```

---

### Feature 4: Auditoria e Governança do Administrador

```gherkin
Scenario: Registro imutável de transição de status de contrato
  Given um contrato firmado entre consumidor e comercializadora
  When a comercializadora confirma o início do fornecimento no mercado livre
  Then o status do contrato passa para "ACTIVE"
  And um registro imutável com timestamp e hash criptográfico é persistido na tabela de auditoria
```

---

## 5. Requisitos Não-Funcionais

1. **Performance:** Resposta de endpoints de API p95 < 200ms.
2. **Segurança:** Isolamento RLS forçado em todas as tabelas transacionais (`cases`, `invoices`, `proposals`, `assets`).
3. **Conformidade Regulatória:** As fórmulas de apuração de bandeiras tarifárias e compensação de GD devem seguir estritamente as regras de transição da Lei 14.300/2022 (Fio B escalonado).
4. **Acessibilidade:** Conformidade WCAG 2.1 AA em todos os portais.
