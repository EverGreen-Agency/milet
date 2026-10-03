# ADRs — Milet v1

**Versão:** 1.0.0 · **Data:** 2026-10-03

## ADR-001 — Monólito modular antes de microserviços

**Decisão:** uma API e um worker implantáveis, módulos com ownership explícito e
PostgreSQL compartilhado com schemas/limites lógicos.

**Consequências:** transações e operação simples; disciplina de fronteiras é
obrigatória.

**Revisar quando:** um módulo precisar de escala, isolamento regulatório, ciclo de
deploy ou equipe própria de forma sustentada.

## ADR-002 — Web responsiva/PWA é o primeiro aplicativo

**Decisão:** validar desktop e celular na mesma web; não chamar PWA de app nativo.

**Consequências:** menor custo e feedback rápido, com limites de câmera, push e
background documentados.

**Revisar quando:** os gatilhos objetivos de mobile em `ARCHITECTURE.md` forem
observados.

## ADR-003 — PostgreSQL é o sistema de registro

**Decisão:** domínio transacional em PostgreSQL; arquivos em object storage;
analytics e busca são projeções descartáveis.

**Consequências:** constraints e transações protegem o fluxo; JSONB não substitui
modelagem dos campos críticos.

**Revisar quando:** telemetria ou busca excederem o perfil relacional.

## ADR-004 — Outbox transacional para efeitos externos

**Decisão:** gravar estado e evento outbox na mesma transação; workers idempotentes
chamam OCR, mensagens, assinatura, billing e analytics.

**Consequências:** consistência eventual visível e recuperável; exige painel de jobs,
retry com backoff e dead-letter.

**Revisar quando:** múltiplos consumidores e replay exigirem um log distribuído.

## ADR-005 — Provedores atrás de portas Milet

**Decisão:** domínio não importa SDKs de fornecedor; payload bruto fica restrito ao
adaptador e com retenção definida.

**Consequências:** troca e teste são possíveis; o menor denominador comum não pode
eliminar recursos críticos, que entram como capabilities.

**Build vs buy:** construir normalização, regras, lineage e reconciliação; comprar
OCR, storage, identidade, entrega, assinatura e cobrança.

## ADR-006 — Revisão humana antes de decisões materiais

**Decisão:** OCR, recomendação, resumo contratual e exceções carregam confiança e
podem exigir aprovação humana. Nada assina, contrata, move capital ou troca
fornecedor automaticamente na v1.

**Consequências:** operação manual é parte mensurável do produto; automação só avança
por nível `alertar → recomendar → preparar → executar autorizado`.

## ADR-007 — Auditoria não é analytics

**Decisão:** `AuditEvent` é append-only, orientado a reconstrução de decisão;
analytics é pseudonimizado, consentido quando aplicável e pode ser descartado.

**Consequências:** nenhum dashboard de produto serve como prova de aceite, cálculo
ou transição.

## ADR-008 — Neutralidade e sem spread como invariantes

**Decisão:** preço/condição do fornecedor é preservado; remuneração Milet é item
separado e divulgado antes da escolha; pagamento não altera ranking.

**Consequências:** proposals guardam preço de origem, disclosures e versão do
ranking; qualquer exceção bloqueia publicação. Não há campo `hidden_margin` nem
transformação que aumente tarifa silenciosamente.

## ADR-009 — Separar quatro ledgers econômicos

**Decisão:** faturamento da Milet, equity da Milet, capital de projeto/SPE e
financiamento de parceiro têm entidades, contas, permissões e relatórios distintos.

**Consequências:** a v1 pode referenciar status externos, mas não custodia ou mistura
recursos. Intermediação financeira ou captação pública exige entidade, licença,
parceiro e ADR próprios.

## ADR-010 — Custos de serviço são hipóteses até procurement

**Decisão:** comparar fornecedores por custo unitário, mínimo mensal, região, SLA,
segurança, DPA, exportabilidade e custo operacional; não registrar preços de site
como orçamento aprovado.

**Consequências:** cada integração possui planilha de volume e teste de saída antes
do contrato. Gatilho de troca: custo total, lock-in, falha de compliance ou SLO.
