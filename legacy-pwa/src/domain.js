export const STORY_IDS = Object.freeze([
  "US-001", "US-002", "US-003", "US-006",
  "US-007", "US-008", "US-009", "US-013"
]);

export const JOURNEY_STEPS = Object.freeze([
  { id: "triage", label: "Entender seu momento", stories: ["US-001"] },
  { id: "invoice", label: "Adicionar fatura", stories: ["US-002"] },
  { id: "review", label: "Conferir dados", stories: ["US-003"] },
  { id: "diagnosis", label: "Ver diagnóstico", stories: ["US-006", "US-007", "US-008", "US-009"] },
  { id: "compare", label: "Comparar propostas", stories: ["US-013"] }
]);

export function money(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL", maximumFractionDigits: 0
  }).format(value);
}

export function calculateBaseline(components) {
  return Object.values(components).reduce((sum, value) => sum + Number(value || 0), 0);
}

export function normalizeProposal(proposal, baselineTotal) {
  const total = calculateBaseline(proposal.costs);
  const monthlySaving = baselineTotal - total;
  return {
    ...proposal,
    total,
    monthlySaving,
    savingPercent: baselineTotal ? (monthlySaving / baselineTotal) * 100 : 0
  };
}

export function rankProposals(proposals, baselineTotal) {
  return proposals
    .map((proposal) => normalizeProposal(proposal, baselineTotal))
    .sort((a, b) => a.total - b.total)
    .map((proposal, index) => ({ ...proposal, rank: index + 1 }));
}

export function validateInvoice(invoice) {
  const errors = {};
  if (!invoice.consumptionKwh || invoice.consumptionKwh <= 0) errors.consumptionKwh = "Informe o consumo do período.";
  if (!invoice.total || invoice.total <= 0) errors.total = "Informe o valor total da fatura.";
  if (!invoice.period) errors.period = "Informe o período de referência.";
  return errors;
}
