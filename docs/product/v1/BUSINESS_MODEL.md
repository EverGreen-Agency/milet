# Modelo de negócio transparente — Milet v1

**Versão:** 1.0.0 · **Estado:** hipóteses a validar, não preços aprovados

## 1. Invariável sem spread

Milet não adiciona margem escondida ao preço de energia, serviço, EPC, crédito ou
proposta de parceiro. O preço de origem e sua versão são preservados. Qualquer valor
devido à Milet aparece em linha separada, com pagador, fato gerador, fórmula,
periodicidade, impostos aplicáveis e condição de cancelamento antes da decisão.

Também é proibido:

- cobrar para melhorar posição no ranking sem rotulagem e separação de publicidade;
- ocultar relacionamento societário/comercial com ofertante;
- calcular economia sem incluir a remuneração Milet e demais custos aplicáveis;
- apresentar receita de projeto/SPE ou juros do financiador como receita operacional
  da plataforma;
- usar `taxa`, `desconto` ou `economia` sem base, período e fórmula.

## 2. Hipóteses de receita permitidas

| Hipótese | Pagador | Unidade transparente | Teste antes de escalar |
|---|---|---|---|
| Assinatura PME | organização consumidora | valor fixo por organização/faixa de UCs e período | willingness-to-pay após contratação e retenção |
| Assinatura B2B | fornecedor, canal ou operador | licença/assento/volume, sem compra de ranking | ganho de produtividade e acesso não discriminatório |
| Serviço/concierge | parte que solicita | escopo e preço fixo ou horas aprovadas | margem após custo humano e SLA |
| Success fee | consumidor, somente se aceito | percentual ou valor sobre economia **apurada** conforme baseline versionada, com teto | reconciliação, contestação, prazo e parecer jurídico/tributário |

Success fee não é spread: precisa de contrato separado, fórmula reproduzível,
baseline congelada, custos completos, período de apuração, teto, tratamento de dados
faltantes e mecanismo de disputa. Se essas condições não forem cumpridas, não cobrar.

Comissões de indicação só podem existir como serviço divulgado e não podem alterar
comparação ou recomendação. A decisão entre pagador comprador, fornecedor ou ambos
permanece experimento; nunca esconder duplicidade.

## 3. Quatro fluxos que não se misturam

| Fluxo | Finalidade | Instrumento/registro | Papel da Milet v1 |
|---|---|---|---|
| Receita operacional Milet | software e serviços | invoice/nota e ledger comercial Milet | cobrar assinatura/serviço/success fee divulgado |
| Equity Milet | financiar empresa, produto e distribuição | cap table, acordo e conta corporativa | relação societária fora do marketplace |
| Capital de projeto/SPE | CAPEX/OPEX e retorno de um ativo específico | SPE, data room, waterfall e contas próprias | referência/status; não captar nem custodiar na v1 |
| Financiamento parceiro | crédito a consumidor/projeto | proposta e contrato do financiador | encaminhar com consentimento; parceiro decide e desembolsa |

Quark, Milet, cada SPE e qualquer EPC/parceiro mantêm identidade, contrato e
beneficiário efetivo próprios. ElectROM é potencial parceiro independente; não é
parte relacionada por padrão.

## 4. Controles de produto

Antes da escolha de uma proposta, a API retorna:

```json
{
  "supplierPriceCents": 0,
  "miletCharges": [{"type": "subscription|service|success_fee", "formulaVersion": "..."}],
  "relatedParty": false,
  "rankingVersion": "...",
  "paidPlacement": false,
  "disclosureVersion": "..."
}
```

`Selection` só é criada com `disclosure_version` visto e ator autorizado. Auditoria
consegue reproduzir preço, custos, ranking e economia exibidos. Alteração comercial
gera nova versão e nunca reescreve proposta já recebida.

## 5. Hipóteses de custo

O modelo financeiro deve simular, sem chamar de cotação atual:

- custo fixo mensal por ambiente e por provedor;
- custo variável por página OCR, GB/mês, mensagem, assinatura, cobrança e usuário;
- impostos, câmbio, suporte, observabilidade e revisão humana;
- cenários baixo/base/alto de volume e taxa de falha;
- custo de saída: exportação, migração, dupla operação e retenção legal.

Procurement registra data, moeda, impostos, fonte e validade de cada preço obtido.
Até isso existir, documentos e apresentações usam apenas `hipótese de custo`.

## 6. Gates de validação

1. entrevistas separadas com PMEs, fornecedores e canais;
2. teste de preço sem alterar ranking nem esconder pagador;
3. unit economics incluindo concierge e correções de OCR;
4. parecer jurídico/tributário para cada fato gerador;
5. baseline e economia reconciliadas em casos autorizados;
6. processo de contestação e estorno testado;
7. aprovação explícita antes de qualquer success fee;
8. nenhuma captação, custódia ou oferta pública de investimento pelo produto v1.
