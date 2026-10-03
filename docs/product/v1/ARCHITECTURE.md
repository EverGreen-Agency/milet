# Arquitetura alvo Milet v1

**Versão:** 1.0.0 · **Estado:** proposta aceita para implementação

## 1. Resultado e limites

O sistema deve sustentar o ciclo:

`descoberta → fatura → revisão → diagnóstico → RFQ → propostas → escolha → documentos → ativação → economia → reavaliação`

O primeiro usuário é o decisor de uma PME. Fornecedor e operador Milet fecham o
ciclo. EPC, ativos, usinas, SPEs, investidores e financiadores existem como limites
de integração e entidades de referência; suas operações completas não pertencem à
v1.

O site estático atual continua sendo o portal público. O produto nasce em uma
aplicação separada para que apresentações e brandbook não se tornem dependência de
runtime nem sejam confundidos com software transacional.

## 2. Topologia alvo

```text
Browser/PWA ──HTTPS──> Web/BFF ──HTTPS──> API modular ──> PostgreSQL
    │                     │                    │              │
    │                     │                    ├──> Outbox ───┼──> Worker
    │                     │                    │              │      │
    └── CDN/assets        └── sessão segura   └──> Storage   │      ├── OCR
                                                               │      ├── notificações
Admin web ─────────────── mesmos contratos e API ──────────────┘      ├── e-sign
                                                                      ├── billing
                                                                      └── analytics
```

### Stack recomendada

| Camada | Escolha v1 | Motivo | Alternativa quando houver gatilho |
|---|---|---|---|
| Web/PWA | Next.js + TypeScript, design tokens existentes | SSR quando útil, formulários acessíveis, rotas e instalação PWA | React Native/Expo para mobile nativo |
| API | TypeScript + NestJS, monólito modular | contratos, validação, DI, OpenAPI e jobs sem microserviços prematuros | separar serviço somente por escala, segurança ou equipe |
| Dados | PostgreSQL; migrações versionadas | transações, constraints, JSONB controlado e RLS opcional | serviço analítico separado para alto volume |
| Assíncrono | outbox transacional + worker; fila gerenciada | não perder eventos depois do commit | Kafka apenas com volume/replay multi-consumidor comprovado |
| Arquivos | storage de objetos privado, URLs assinadas curtas | PDFs/imagens fora do banco | cofre documental especializado se exigido por compliance |
| Contratos | OpenAPI + JSON Schema; IDs UUIDv7 | clientes tipados e ordenação temporal | protobuf apenas para comunicação interna de alta escala |

Estrutura inicial sugerida:

```text
apps/public-site/       # conteúdo estático hoje publicado
apps/web/               # consumidor, fornecedor e operador responsivos
apps/api/               # composição HTTP e módulos de aplicação
apps/worker/            # outbox, OCR, notificações e webhooks
packages/domain/        # entidades, value objects, estados e políticas puras
packages/contracts/     # OpenAPI, schemas de eventos e tipos gerados
packages/ui/            # tokens e componentes sem regra de domínio
packages/test-fixtures/ # dados sintéticos explicitamente marcados
infra/                  # IaC, ambientes, dashboards e runbooks
```

Não migrar o portal público antes de a nova aplicação exigir compartilhamento real
de componentes. A nova estrutura é um alvo para a primeira implementação, não uma
mudança já realizada por estes documentos.

## 3. Fronteiras do monólito modular

Cada módulo possui tabelas, serviços de aplicação e eventos próprios. Leitura entre
módulos usa interfaces públicas; escrita ocorre por comando ao módulo dono. Nenhum
adaptador externo contém regra de negócio.

| Módulo | Responsabilidade | Entidades raiz | Não faz |
|---|---|---|---|
| Identity & Tenancy | organizações, usuários, papéis, escopos | Organization, User, Membership | autorização apenas na UI |
| Intake | descoberta, UCs, arquivos e extração | ConsumerUnit, Invoice, Extraction | decidir elegibilidade |
| Passport | visão versionada aprovada e consentimentos | EnergyPassport, ConsentGrant | guardar senha de distribuidora |
| Decisioning | regras, baseline, cenário e recomendação | RuleSet, Baseline, Scenario, Recommendation | prometer economia |
| Marketplace | RFQ, matching, proposta, comparação e escolha | RFQ, Proposal, Selection | vender posição no ranking |
| Fulfillment | checklist, contrato, tarefas e ativação | FulfillmentCase, Contract, Task | atuar como signatário sem mandato |
| Savings | previsto, contratado, apurado e reavaliação | SavingsLedger, SavingsEntry | sobrescrever baseline histórica |
| Operations | fila, exceções, SLA e intervenção humana | WorkItem, ExceptionCase | editar log de auditoria |
| Trust | evidência, lineage, auditoria e políticas | Evidence, AuditEvent, PolicyVersion | analytics de marketing |
| Commercial | planos, cobrança Milet e disclosure | Subscription, ServiceOrder, SuccessFeeRule | cobrar energia ou custodiar capital |
| Ecosystem | referências a EPC, projeto, ativo, SPE e financiamento | PartnerRef, ProjectRef, FinancingRef | operar esses verticais na v1 |

## 4. Modelo de domínio mínimo

Todas as entidades persistidas têm `id`, `organization_id` quando aplicável,
`created_at`, `updated_at`, `version` otimista e classificação de dados.

| Entidade | Campos mínimos e invariantes |
|---|---|
| Organization | `legal_name`, `tax_id_encrypted`, `status`; tenant obrigatório |
| Membership | `user_id`, `organization_id`, `role`, `scopes`; menor privilégio |
| ConsumerUnit | distribuidora, identificador mascarado, endereço, grupo/modalidade; nunca exposta fora do tenant |
| Invoice | período, arquivo, hash SHA-256, status, origem; arquivo imutável após ingestão |
| Extraction | provedor/modelo/versão, campos, confiança por campo, evidência de página/região |
| InvoiceRevision | valores corrigidos, autor, motivo, timestamp; não apaga extração original |
| EnergyPassport | snapshot versionado das UCs/faturas/contratos aprovados |
| ConsentGrant | finalidade, dados, destinatário, base legal, início, expiração/revogação |
| RuleSet | modalidade, jurisdição, fonte, vigência e versão imutável |
| Baseline | período, consumo, custos componentes, ausências, premissas e versão |
| Scenario | baseline_id, rota, horizonte, custos totais, riscos, confiança |
| RFQ | snapshot compartilhável, prazo, status, destinatários e consentimento usado |
| Proposal | fornecedor, versão, validade, preço, custos, SLA, riscos e anexos |
| Selection | proposta, ator, disclosure visto, justificativa e timestamp |
| FulfillmentCase | estado atual, responsável, SLA e próxima ação |
| Contract | proposta origem, documento final, hash, assinatura/aceite e versão |
| SavingsEntry | período, baseline congelada, previsto/contratado/apurado, reconciliação |
| AuditEvent | ator, ação, alvo, before/after redigido, correlação, IP truncado, timestamp |

Valores monetários usam inteiro em centavos + ISO 4217. Energia explicita unidade
(`kWh`, `MWh`) e período. Datas são UTC em persistência e exibidas no fuso escolhido.
Resultados derivados carregam `source_evidence_ids`, `calculation_version` e
`confidence`.

### Economia líquida

```text
economia_liquida = baseline_contrafactual
                  - (conta_residual + fornecedor + servicos_milet
                     + taxas_explicitas + financiamento + outros_custos_aplicaveis)
```

O cálculo compara mesmo consumo, horizonte e base tributária. A UI e a API sempre
distinguem `estimada`, `contratada` e `apurada`; incerteza e dados ausentes são
parte do resultado.

## 5. Máquina de estados

`EnergyJourney` é uma projeção do caso, não uma tabela que substitui os agregados.

| Estado | Entrada permitida | Saída / guard |
|---|---|---|
| DISCOVERY | caso criado | `INVOICE_PENDING` após triagem |
| INVOICE_PENDING | UC mínima presente | `EXTRACTION_PENDING` com arquivo aceito |
| EXTRACTION_PENDING | hash e malware scan OK | `REVIEW_REQUIRED` mesmo com alta confiança |
| REVIEW_REQUIRED | campos extraídos ou entrada manual | `DIAGNOSIS_READY` só com aprovação humana |
| DIAGNOSIS_READY | invoice revision aprovada | `DIAGNOSED` com RuleSet e Baseline versionados |
| DIAGNOSED | cenários calculados | `RFQ_DRAFT` por ação explícita |
| RFQ_DRAFT | snapshot e disclosure do compartilhamento | `RFQ_OPEN` com consentimento válido |
| RFQ_OPEN | prazo vigente | `PROPOSALS_RECEIVED` ou `RFQ_CLOSED_NO_OFFER` |
| PROPOSALS_RECEIVED | ≥1 proposta válida | `OFFER_SELECTED` por decisor autorizado |
| OFFER_SELECTED | disclosure de remuneração registrado | `DOCUMENTS_PENDING` |
| DOCUMENTS_PENDING | checklist completo | `CONTRACT_PENDING` |
| CONTRACT_PENDING | versão final e aceite/assinatura | `ACTIVATION_PENDING` |
| ACTIVATION_PENDING | evidência do operador/parceiro | `ACTIVE` |
| ACTIVE | contrato vigente | `MONITORING` após primeira referência pós-ativação |
| MONITORING | lançamentos reconciliados | `REEVALUATION_DUE`, `CLOSED` ou permanece |
| REEVALUATION_DUE | gatilho transparente | novo `RFQ_DRAFT` somente com confirmação |

`CANCELLED` exige motivo e é terminal para a instância. Correções não retrocedem
silenciosamente: criam nova versão e podem invalidar projeções posteriores. Cada
transição grava evento de domínio e `AuditEvent` na mesma transação.

## 6. Portas e adaptadores

O contrato interno nunca expõe SDK do fornecedor. Todo adaptador implementa
timeouts, idempotência, correlação, métricas, circuit breaker e tradução de erros.

| Porta | MVP de baixo custo | Alternativas de produção | Build vs buy |
|---|---|---|---|
| OCR | extração assíncrona gerenciada + revisão humana; avaliar AWS Textract primeiro | Azure Document Intelligence ou Google Document AI, inclusive modelos customizados | não construir OCR; construir normalização Milet e corpus de avaliação |
| Storage | Supabase Storage ou S3 compatível, bucket privado | S3 + KMS + lifecycle + Object Lock quando requerido | comprar storage; construir política e metadados |
| Auth | Supabase Auth com MFA para operador | Cognito, Auth0 ou provedor OIDC corporativo | trocar se SSO/SAML, residência ou SLA justificar |
| Notifications | Resend para e-mail transacional | SES; WhatsApp/SMS por Zenvia/Twilio após opt-in | templates e preferências são Milet; entrega é comprada |
| E-signature | aceite interno apenas para demo; Clicksign em piloto | D4Sign ou DocuSign por requisito jurídico/cliente | nunca construir assinatura qualificada |
| Analytics | PostHog com eventos pseudonimizados ou self-hosted | warehouse + transformação e BI quando volume justificar | eventos de produto sim; PII e documentos não |
| Billing | cobrança Milet separada via Asaas ou Stripe | Pagar.me/Adyen conforme meios, conciliação e escala | não construir adquirência nem ledger financeiro regulado |

Essas escolhas não são contratos vigentes. Preço, região de dados, SLA, DPA,
subprocessadores e aderência jurídica devem ser verificados antes da contratação.

### Contratos essenciais

```ts
interface OcrPort {
  submit(input: { invoiceId: string; objectKey: string; sha256: string }): Promise<{ jobId: string }>;
  read(jobId: string): Promise<{ status: 'pending'|'succeeded'|'failed'; fields?: ExtractedField[] }>;
}

interface SignaturePort {
  createEnvelope(input: { contractId: string; objectKey: string; signers: Signer[] }): Promise<{ envelopeId: string }>;
  verifyWebhook(rawBody: Uint8Array, headers: Record<string,string>): VerifiedSignatureEvent;
}

interface BillingPort {
  createCharge(input: { commercialAccountId: string; invoiceId: string; amountCents: number }): Promise<{ chargeId: string }>;
}
```

Webhooks são autenticados, persistidos por `provider_event_id`, respondidos rápido e
processados de modo idempotente pelo worker. Falha permanente abre `WorkItem` para
operação; nenhuma etapa crítica avança só porque o provedor respondeu HTTP 200.

## 7. Web/PWA agora, nativo depois

A PWA v1 entrega layout adaptativo, upload por arquivo/câmera, cache apenas de shell
público, retomada segura de formulários e notificações web quando consentidas. PDFs,
PII, tokens e respostas autenticadas não entram em cache offline. Service worker é
versionado e possui kill switch.

Aplicativo nativo é iniciado quando dois ou mais gatilhos forem observados por dois
ciclos: uso recorrente mobile relevante; câmera/OCR limitado pela web; push essencial
ao SLA; necessidade de biometria/secure enclave; distribuição via lojas como canal;
ou desempenho/acessibilidade insuficiente na PWA. Nesse ponto, usar Expo/React Native
compartilhando `domain`, `contracts` e tokens, não componentes DOM.

## 8. Gates para receber faturas reais

Nenhum dado real entra antes de todos os itens abaixo terem dono e evidência:

1. inventário de dados, classificação, finalidade e base legal aprovados;
2. aviso de privacidade, termos, canal do titular e política de retenção/deleção;
3. controlador/operador e contratos/DPA com cada suboperador definidos;
4. tenant isolation testado na API e no banco; RBAC/ABAC e MFA para privilegiados;
5. criptografia TLS e em repouso, secrets manager, rotação e acessos auditados;
6. upload com allowlist, limite, antivírus, quarantine e download com URL curta;
7. logs redigidos sem fatura, CPF/CNPJ completo, credencial ou conteúdo sensível;
8. threat model, revisão de dependências, SAST/DAST e teste de autorização;
9. backups criptografados com restauração ensaiada e RPO/RTO aceitos;
10. plano de incidente e violação, contatos, exercícios e procedimento ANPD/titular;
11. revisão humana obrigatória do OCR e das recomendações do piloto;
12. avaliação jurídica/regulatória para compartilhamento, contratação e remuneração.

Credenciais de distribuidoras não são coletadas na v1. Se isso se tornar necessário,
exige ADR própria, cofre de credenciais, mandato explícito e revisão jurídica.

## 9. Observabilidade e SLO inicial

- logs JSON com `trace_id`, `request_id`, `organization_id` pseudonimizado e código
  de evento; nunca corpo de documento;
- OpenTelemetry em web, API, worker, DB e chamadas externas;
- Sentry (ou equivalente) com scrub de PII e replay desabilitado em telas sensíveis;
- métricas RED da API, fila/outbox, idade do job, taxa de OCR por estado, webhook
  duplicado, transição rejeitada e reconciliação da economia;
- trilha de auditoria append-only com exportação verificável; analytics não a substitui;
- SLO piloto: 99,5% mensal para leitura/autosserviço, p95 API < 800 ms excluindo
  jobs externos, 99% dos eventos outbox processados em até 5 min;
- alertas por burn rate, fila parada, backup falho, aumento de 401/403/5xx e queda
  anormal de webhook; cada alerta tem runbook e owner.

## 10. Ambientes e implantação

`local` usa containers e provedores fake; `preview` usa somente dados sintéticos;
`staging` espelha controles com contas sandbox; `production` usa contas e chaves
separadas. Nunca copiar produção para preview.

MVP de baixo custo: Vercel para web, serviço de containers gerenciado para API e
worker, PostgreSQL/Storage gerenciados. Produção recomendada quando os gates exigirem:
AWS `sa-east-1` com CloudFront/WAF, ECS Fargate, RDS PostgreSQL Multi-AZ, S3/KMS,
SQS, Secrets Manager e backups cross-account. Região é preferência de arquitetura,
não prova automática de conformidade LGPD.

Pipeline: lint/typecheck → unit → contract → migration check → integration com DB →
SAST/dependencies → build imutável/SBOM → deploy staging → smoke → aprovação →
produção canário/blue-green. Migrações são backward-compatible; rollback de app não
depende de rollback destrutivo de schema. Infra é IaC e mudanças deixam audit trail.
