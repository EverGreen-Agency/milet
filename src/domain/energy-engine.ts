export interface InvoiceInput {
  consumptionKwh: number;
  total: number;
  period: string;
  distributor?: string;
  contractedDemandKw?: number;
  voltageGroup?: string;
  tariffFlag?: string;
}

export interface BaselineComponents {
  energy?: number;
  distribution?: number;
  taxes?: number;
  flags?: number;
  [key: string]: number | undefined;
}

export interface ProposalCosts {
  residualBill?: number;
  supplier?: number;
  miletService?: number;
  taxes?: number;
  financing?: number;
  [key: string]: number | undefined;
}

export interface ProposalInput {
  id: string;
  supplier: string;
  route: string;
  termMonths: number;
  renewable: string;
  adjustment: string;
  risk: string;
  missing: readonly string[];
  costs: ProposalCosts;
  remuneration: string;
}

export interface NormalizedProposal extends ProposalInput {
  total: number;
  monthlySaving: number;
  savingPercent: number;
  rank?: number;
}

export interface EligibilityResult {
  route: string;
  status: "eligible" | "review" | "ineligible";
  reason: string;
}

export type InvoiceValidationErrors = Partial<Record<keyof InvoiceInput, string>>;

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}

export function validateInvoice(invoice: InvoiceInput): InvoiceValidationErrors {
  const errors: InvoiceValidationErrors = {};
  if (!invoice.consumptionKwh || invoice.consumptionKwh <= 0) {
    errors.consumptionKwh = "Informe o consumo do período.";
  }
  if (!invoice.total || invoice.total <= 0) {
    errors.total = "Informe o valor total da fatura.";
  }
  if (!invoice.period || invoice.period.trim() === "") {
    errors.period = "Informe o período de referência.";
  }
  return errors;
}

export function calculateBaseline(components: BaselineComponents): number {
  return Object.values(components).reduce<number>((sum, val) => sum + Number(val || 0), 0);
}

export function normalizeProposal(proposal: ProposalInput, baselineTotal: number): NormalizedProposal {
  const total = calculateBaseline(proposal.costs);
  const monthlySaving = baselineTotal - total;
  const savingPercent = baselineTotal > 0 ? (monthlySaving / baselineTotal) * 100 : 0;
  return {
    ...proposal,
    total,
    monthlySaving,
    savingPercent
  };
}

export function rankProposals(proposals: readonly ProposalInput[], baselineTotal: number): NormalizedProposal[] {
  return proposals
    .map((p) => normalizeProposal(p, baselineTotal))
    .sort((a, b) => a.total - b.total)
    .map((proposal, index) => ({
      ...proposal,
      rank: index + 1
    }));
}

export function evaluateEligibility(invoice: InvoiceInput): EligibilityResult[] {
  const isHighVoltageGroupA = invoice.voltageGroup?.startsWith("A") ?? false;
  const hasSubstantialDemand = (invoice.contractedDemandKw ?? 0) >= 30;

  if (isHighVoltageGroupA || hasSubstantialDemand) {
    return [
      {
        route: "Mercado livre varejista",
        status: "eligible",
        reason: "Perfil de média/alta tensão (Grupo A) compatível com migração varejista conforme Portaria 50/2022."
      },
      {
        route: "Geração solar local",
        status: "review",
        reason: "Estrutura do telhado e viabilidade técnica requerem conferência estrutural."
      },
      {
        route: "Geração compartilhada (GD)",
        status: "ineligible",
        reason: "Para unidades do Grupo A com demanda contratada, o Mercado Livre oferece maior economia líquida."
      }
    ];
  }

  return [
    {
      route: "Mercado livre varejista",
      status: "ineligible",
      reason: "Unidades do Grupo B (baixa tensão) ainda aguardam abertura regulatória completa da ANEEL."
    },
    {
      route: "Geração compartilhada (GD)",
      status: "eligible",
      reason: "Economia imediata na conta de luz via créditos de energia solar por assinatura, sem obras."
    },
    {
      route: "Geração solar local",
      status: "review",
      reason: "Disponibilidade de telhado próprio e espaço físico dependem de inspeção técnica."
    }
  ];
}
