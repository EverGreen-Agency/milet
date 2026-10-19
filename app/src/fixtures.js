export const demoCase = Object.freeze({
  organization: {
    id: "ORG-0007",
    name: "Padaria Horizonte",
    cnpj: "12.345.678/0001-90",
    city: "Belo Horizonte",
    state: "MG",
    address: "Av. Amazonas, 1420",
    neighborhood: "Prado",
    postalCode: "30411-000",
    roofAreaM2: 450,
    roofType: "Metálico / Trapezoidal",
    coordinates: { lat: -19.9238, lng: -43.9572 }
  },
  unit: {
    id: "UC-MG-00482",
    voltageGroup: "A4",
    tariffModality: "Verde (Horossazonal)",
    distributor: "Cemig",
    business: "Panificação",
    substationType: "Própria do cliente",
    contractedDemandKw: 75
  },
  invoice: {
    id: "INV-2026-08-00482", fileName: "fatura-sintetica-agosto-2026.pdf", period: "2026-08",
    consumptionKwh: 12480, total: 10920, contractedDemandKw: 75, tariffFlag: "Verde",
    postalCode: "30411-000", address: "Av. Amazonas, 1420", neighborhood: "Prado",
    roofAreaM2: 450, roofType: "Metálico / Trapezoidal", voltageGroup: "A4", tariffModality: "Verde (Horossazonal)",
    substationType: "Própria do cliente",
    confidence: { period: .98, consumptionKwh: .96, total: .97, contractedDemandKw: .63, tariffFlag: 0.95 }
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

export const profilePresets = Object.freeze({
  company: {
    id: "company",
    label: "Empresa / PME",
    badge: "Grupo A / Comercial",
    subtitle: "Comércio, padarias, clínicas, indústrias e serviços",
    defaultBill: "mid",
    state: "MG",
    distributor: "Cemig",
    business: "Padaria Horizonte",
    kwh: 12480,
    total: 10920,
    case: demoCase
  },
  supplier: {
    id: "supplier",
    label: "Comercializadora / Fornecedor",
    badge: "Parceiro de Oferta",
    subtitle: "Trading, comercializadoras varejistas e gestores de portfólio",
    defaultBill: "high",
    state: "SP",
    distributor: "CPFL Paulista",
    business: "Portfólio PMEs Sudeste",
    kwh: 85000,
    total: 68500,
    case: {
      ...demoCase,
      organization: { id: "ORG-0042", name: "Portfólio PMEs Sudeste", city: "Campinas", state: "SP" },
      unit: { id: "UC-SP-01290", voltageGroup: "A4", distributor: "CPFL Paulista", business: "Agrupamento Comercial" },
      invoice: {
        id: "INV-2026-08-01290", fileName: "fatura-agrupada-agosto-2026.pdf", period: "2026-08",
        consumptionKwh: 85000, total: 68500, contractedDemandKw: 350, tariffFlag: "",
        confidence: { period: .99, consumptionKwh: .98, total: .98, contractedDemandKw: .95, tariffFlag: 0 }
      }
    }
  },
  home: {
    id: "home",
    label: "Residencial / Condomínio",
    badge: "Grupo B / GD Solar",
    subtitle: "Residências, consultórios e condomínios com conta individual",
    defaultBill: "low",
    state: "RJ",
    distributor: "Light",
    business: "Residência / Condomínio",
    kwh: 1450,
    total: 1580,
    case: {
      ...demoCase,
      organization: { id: "ORG-0099", name: "Condomínio / Unidade Residencial", city: "Rio de Janeiro", state: "RJ" },
      unit: { id: "UC-RJ-09182", voltageGroup: "B1", distributor: "Light", business: "Residencial" },
      invoice: {
        id: "INV-2026-08-09182", fileName: "fatura-residencial-agosto-2026.pdf", period: "2026-08",
        consumptionKwh: 1450, total: 1580, contractedDemandKw: 0, tariffFlag: "",
        confidence: { period: .98, consumptionKwh: .97, total: .98, contractedDemandKw: 1.0, tariffFlag: 0 }
      }
    }
  }
});
