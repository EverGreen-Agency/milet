# Hipóteses de monetização e cobrança

**Atualizado em:** 2026-10-04  
**Estado:** plano de experimento; não é tabela de preço publicada, oferta comercial,
parecer jurídico ou autorização regulatória.

## Decisão recomendada para o piloto

Começar como serviço B2B assistido pago pela PME, sem receber o valor da energia,
sem split e sem se apresentar como comercializadora ou agente varejista. A primeira
oferta vende um resultado verificável — entendimento da fatura, baseline revisada e
próximos passos — e não acesso ao software. Um parceiro habilitado permanece
responsável pela representação, migração e operação setorial.

O valor métrico inicial é **unidade consumidora ativa sob acompanhamento**. Ele cresce
com o trabalho e com o valor entregue, é legível para o cliente e evita cobrar por
usuário ou clique, que não representam o resultado energético.

## Pacotes a testar

| Fase | Hipótese de oferta | Pagador | Hipótese de preço para aprender | Evento de cobrança |
| --- | --- | --- | --- | --- |
| 0 | Raio-X Energético Verificado: revisão humana, baseline, elegibilidade e próximos passos | PME | R$ 990 por empresa com 1 UC; R$ 300 por UC adicional | diagnóstico entregue e aceito |
| 0/1 | Autopilot Founding: monitoramento, previsto versus realizado, vencimentos e nova comparação assistida | PME | R$ 299/mês com 1 UC; R$ 99/mês por UC adicional | ativação explícita e renovação mensal |
| 1 | Originação/ativação como experimento alternativo | fornecedor | R$ 1.500 por UC ativada, igual por classe de produto | ativação comprovada após janela de reversão |
| 2 | Portfólio multi-UC com workflow, auditoria e relatórios | empresa/rede | R$ 2.500/mês até 10 UCs; excedente a definir | início da assinatura e UCs ativas |
| 2/3 | API ou white-label | ERP, contador, banco ou EPC | setup + mínimo mensal + UC ativa | go-live, mínimo e uso |
| 3 | Application fee de marketplace | a definir | somente após validação jurídica e operacional | pagamento de serviço conciliado pelo PSP |

Esses números são apostas de descoberta, não preços de mercado comprovados. O teste
inicial deve registrar propostas de R$ 690, R$ 990 e R$ 1.490 para o diagnóstico e
R$ 199, R$ 299 e R$ 499 para a recorrência. A decisão usa compra real, margem após
horas humanas e retenção — não intenção declarada isoladamente.

## O que não cobrar no início

- posição no ranking, clique, lead bruto ou RFQ recebido;
- percentual da economia antes de uma baseline independente e auditável;
- spread secreto por MWh;
- comprador e fornecedor ao mesmo tempo sem divulgação individual e consentimento;
- conta de energia ou liquidação setorial por um PSP comum.

## Neutralidade do ranking

Remuneração nunca participa do score. Cada proposta deve mostrar custo total,
premissas, faixa de economia, prazo, reajuste, multas, garantias, riscos, origem e
idade dos dados, versão do algoritmo e quem remunera a Milet.

Controles mínimos:

1. fee idêntico para fornecedores da mesma classe de produto;
2. conteúdo patrocinado separado do ranking orgânico;
3. log append-only de entradas, score, versão e override humano;
4. registro de partes relacionadas e conflitos;
5. teste contrafactual: alterar comissão deve variar o ranking em zero;
6. explicação da posição e revisão humana solicitável.

A LGPD exige transparência, segurança e prestação de contas; decisões automatizadas
que afetem interesses do titular demandam informações claras e canal de revisão. Ver
a [Lei 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm),
especialmente os arts. 6, 20 e 46.

## Eventos e ledger comercial

O domínio de cobrança deve ser independente do PSP:

- `diagnostic_delivered`, `subscription_activated`, `managed_uc_added`;
- `rfq_qualified`, `offer_submitted`, `contract_signed`;
- `energy_contract_activated`, `success_fee_earned`;
- `payment_captured`, `payout_released`, `refund_created`;
- `chargeback_opened`, `subscription_past_due`, `subscription_canceled`.

Uma taxa de sucesso nasce em `energy_contract_activated`, não na simples escolha de
uma proposta. O ledger preserva bruto, tarifa do PSP, fee Milet, líquido, recebedor,
contrato/UC, evidência, data, status e chave de idempotência.

## PSP: ordem de adoção

No piloto, usar checkout/link ou assinatura de **um** provedor, sem contas conectadas
e sem split. A escolha depende de aprovação da conta, checkout, Pix/cartão,
conciliação e suporte brasileiro.

- O Stripe Billing publica 0,7% sobre o volume gerenciado pelo Billing, além do
  Payments; a página brasileira indica 3,99% + R$ 0,50 por cobrança de cartão
  bem-sucedida. Fonte: [Stripe Billing Brasil](https://stripe.com/br/billing/pricing).
- A API de assinaturas do Mercado Pago expõe planos, preapproval, cobranças e novas
  tentativas. Fonte: [Mercado Pago — Assinaturas](https://www.mercadopago.com.br/developers/pt/reference/online-payments/subscriptions/overview).

Depois de validar o papel de plataforma, adicionar webhooks assinados, idempotência,
ledger próprio, conciliação, reembolso, chargeback e emissão fiscal. Só então avaliar
Connect ou Split.

- O Stripe Connect oferece onboarding e repasses; separate charges and transfers
  atribui à plataforma tarifas, reembolsos e chargebacks no desenho correspondente.
  Fontes: [preços do Connect](https://stripe.com/br/connect/pricing) e
  [charges/transfers](https://docs.stripe.com/connect/separate-charges-and-transfers).
- O split 1:1 do Mercado Pago requer OAuth e conta do vendedor com KYC; 1:N depende
  de habilitação comercial. Fontes: [pré-requisitos](https://www.mercadopago.com.br/developers/pt/docs/split-payments/split-1-1/prerequisites)
  e [configuração](https://www.mercadopago.com.br/developers/pt/docs/split-payments/split-1-1/integration-configuration/integrate-marketplace).

Um PSP executar split não concede habilitação para comercialização ou liquidação de
energia.

## Fronteira regulatória a validar

Fatos conferidos em fontes oficiais em 2026-10-04:

- consumidores do Grupo A já podem migrar; carga individual abaixo de 500 kW exige
  participação por agente varejista, segundo o [MME](https://www.gov.br/mme/pt-br/assuntos/noticias/mercado-livre-de-energia-entenda-como-funciona-a-migracao-e-as-regras-para-contratacao-de-energia/);
- o [Decreto 13.097/2026](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d13097.htm)
  prevê abertura da baixa tensão para industriais e comerciais em 25/11/2027 e para
  os demais em 25/11/2028, com representação varejista;
- o decreto atribui à ANEEL regras de medição, faturamento, cobrança e suspensão e
  determina que a CCEE ofereça plataforma centralizada de comparação;
- a ANEEL mantém atos de agentes autorizados em [Comercialização](https://www.gov.br/aneel/pt-br/centrais-de-conteudos/relatorios-e-indicadores/comercializacao).

Antes de cobrar fornecedor, fee por MWh, receber valores ligados ao fornecimento ou
operar marketplace, obter parecer jurídico sobre papel da Milet, autorização,
tributação, responsabilidade, cancelamento, representação e emissão fiscal.

## Métricas e gates

- conversão para diagnóstico e assinatura, receita/margem por UC, churn, CAC e payback;
- erro entre economia prevista e realizada;
- RFQs com três ofertas comparáveis e tempo até a terceira;
- concentração, resposta e ativação por fornecedor;
- 100% das ofertas com remuneração e parte relacionada declaradas;
- variação de ranking por comissão igual a zero;
- overrides, reclamações, reembolsos e chargebacks.

Não lançar marketplace sem três ofertas comparáveis no segmento piloto. Não lançar
split sem parecer jurídico, política de reembolso e conciliação testada. Interromper
recorrência se clientes comprarem diagnóstico, mas não continuidade; testar B2B2C se
CAC e suporte direto não fecharem.

## Decisões abertas

1. ICP inicial: PME Grupo A, geração distribuída empresarial ou um único recorte.
2. Pagador principal e regra para evitar dupla remuneração.
3. Definição contratual e evidência de `energy_contract_activated`.
4. Baseline oficial de economia e processo de contestação.
5. Papel jurídico da Milet versus parceiro varejista habilitado.
6. Stripe versus Mercado Pago após teste do caso de uso, não só da tarifa.
7. Tributação, nota fiscal, controlador/operador LGPD e retenção de evidências.

