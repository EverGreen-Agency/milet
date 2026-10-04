import { demoCase } from "./fixtures.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class DemoEnergyAdapter {
  constructor({ apiBaseUrl = "", fetchImpl = globalThis.fetch, timeoutMs = 2_500, artificialDelayMs = 120 } = {}) {
    this.apiBaseUrl = apiBaseUrl.trim().replace(/\/$/, "");
    this.fetchImpl = fetchImpl;
    this.timeoutMs = timeoutMs;
    this.artificialDelayMs = artificialDelayMs;
  }

  async getCase() {
    if (!this.apiBaseUrl) {
      await delay(this.artificialDelayMs);
      return withRuntime(structuredClone(demoCase), "fixture", "API não configurada; usando fixture sintética local.");
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetchImpl(`${this.apiBaseUrl}/v1/cases/CASE-UC-MG-00482`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-organization-id": "ORG-0007",
          "x-user-id": "USR-DEMO-0001",
          "x-correlation-id": globalThis.crypto?.randomUUID?.() ?? `demo-${Date.now()}`,
        },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`ApiHttp${response.status}`);
      const contract = await response.json();
      return withRuntime(mapApiContract(contract), "api", "Caso sintético carregado da API configurada.");
    } catch (error) {
      const reason = error?.name === "AbortError" ? "tempo limite da API" : "API indisponível ou resposta inválida";
      return withRuntime(structuredClone(demoCase), "fixture_fallback", `Fallback explícito: ${reason}; usando fixture sintética local.`);
    } finally {
      clearTimeout(timer);
    }
  }

  async extractInvoice(file, { fail = false } = {}) {
    await delay(650);
    if (fail) throw new Error("Não foi possível ler este arquivo sintético.");
    if (file && !/\.(pdf|png|jpe?g)$/i.test(file.name)) {
      throw new Error("Formato não aceito. Use PDF, PNG ou JPG.");
    }
    return structuredClone(demoCase.invoice);
  }

  async saveReviewedInvoice(invoice) {
    await delay(180);
    return { ...structuredClone(invoice), reviewedAt: new Date().toISOString(), status: "reviewed" };
  }
}

function mapApiContract(contract) {
  if (contract?.classification !== "synthetic_demo_only" || contract?.caseId !== "CASE-UC-MG-00482") {
    throw new Error("UnexpectedApiContract");
  }
  for (const key of ["organization", "consumerUnit", "invoice", "baseline"]) {
    if (!contract[key] || typeof contract[key] !== "object") throw new Error("UnexpectedApiContract");
  }
  const result = structuredClone(demoCase);
  result.organization.id = contract.organization.publicId;
  result.organization.name = contract.organization.legalName;
  result.unit.id = contract.consumerUnit.publicId;
  result.unit.voltageGroup = contract.consumerUnit.voltageGroup;
  result.unit.distributor = contract.consumerUnit.distributor;
  result.invoice.id = contract.invoice.publicId;
  result.invoice.period = contract.invoice.period;
  if (Number.isInteger(contract.baseline.totalCents)) {
    const total = contract.baseline.totalCents / 100;
    result.baseline.components = { apiBaseline: total };
  }
  result.baseline.period = `${contract.baseline.periodStart} a ${contract.baseline.periodEnd}`;
  result.baseline.assumptions = [...contract.baseline.assumptions, "Comparação visual permanece sintética e local nesta Stage 2"];
  return result;
}

function withRuntime(data, mode, message) {
  data.runtime = Object.freeze({ mode, message });
  return data;
}
