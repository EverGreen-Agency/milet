export const demoCase = Object.freeze({
  organization: { id: "ORG-0007", name: "Padaria Horizonte", city: "Belo Horizonte", state: "MG" },
  unit: { id: "UC-MG-00482", voltageGroup: "A4", distributor: "Cemig", business: "Panificação" },
  invoice: {
    id: "INV-2026-08-00482", fileName: "fatura-sintetica-agosto-2026.pdf", period: "2026-08",
    consumptionKwh: 12480, total: 10920, contractedDemandKw: 75, tariffFlag: "",
    confidence: { period: .98, consumptionKwh: .96, total: .97, contractedDemandKw: .63, tariffFlag: 0 }
  },
  baseline: {
    period: "set/2025 a ago/2026", components: { energy: 5360, distribution: 3100, taxes: 2040, flags: 420 },
    assumptions: ["Consumo médio mensal de 12.480 kWh", "Mesma unidade e horizonte de 12 meses", "Valores nominais, sem garantia de economia"]
  },
  eligibility: [
    { route: "Mercado livre varejista", status: "eligible", reason: "Perfil A4 e demanda contratada compatíveis com a triagem da demo." },
    { route: "Geração solar local", status: "review", reason: "Área útil e estrutura do telhado ainda não foram informadas." },
    { route: "Geração compartilhada", status: "ineligible", reason: "A regra sintética deste caso prioriza migração varejista para este perfil." }
  ],
  proposals: [
    {
      id: "PROP-ALVORADA-01", supplier: "Alvorada Energia", route: "Mercado livre", termMonths: 36,
      renewable: "Incentivada 50%", adjustment: "IPCA anual", risk: "Médio", missing: [],
      costs: { residualBill: 2940, supplier: 4900, miletService: 280, taxes: 1600, financing: 0 },
      remuneration: "R$ 280/mês de serviço Milet, já incluídos no total. Sem comissão do fornecedor."
    },
    {
      id: "PROP-SERRA-02", supplier: "Serra Clara", route: "Mercado livre", termMonths: 24,
      renewable: "Fonte não declarada", adjustment: "IPCA anual", risk: "Revisar", missing: ["Fonte da energia"],
      costs: { residualBill: 2760, supplier: 5000, miletService: 190, taxes: 1570, financing: 420 },
      remuneration: "R$ 190/mês de serviço Milet, já incluídos no total. Financiamento de garantia: R$ 420/mês."
    }
  ]
});
