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
      return withRuntime(structuredClone(demoCase), "fixture", "Diagnóstico Milet ativo · Dados de referência setorial.");
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
    if (fail) throw new Error("Não foi possível ler este arquivo sintético.");
    if (file && !/\.(pdf|png|jpe?g|webp)$/i.test(file.name)) {
      throw new Error("Formato não aceito. Use PDF, PNG ou JPG.");
    }

    if (file && typeof FileReader !== "undefined") {
      try {
        const base64 = await readFileAsBase64(file);
        const mimeType = file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg");
        const baseUrl = this.apiBaseUrl ? this.apiBaseUrl.replace(/\/$/, "") : "";
        const response = await this.fetchImpl(`${baseUrl}/v1/extract-invoice`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            fileBase64: base64,
            mimeType,
            fileName: file.name
          })
        });

        if (response.ok) {
          const res = await response.json();
          if (res?.data) {
            const d = res.data;
            const merged = structuredClone(demoCase.invoice);
            merged.fileName = file.name;
            if (d.distributor) merged.distributor = d.distributor;
            if (d.consumptionKwh) merged.consumptionKwh = Number(d.consumptionKwh);
            if (d.totalAmount) merged.total = Number(d.totalAmount);
            if (d.contractedDemandKw) merged.contractedDemandKw = Number(d.contractedDemandKw);
            if (d.voltageGroup) merged.voltageGroup = d.voltageGroup;
            if (d.tariffModality) merged.tariffModality = d.tariffModality;
            if (d.city) merged.city = d.city;
            if (d.state) merged.state = d.state;
            if (d.postalCode) merged.postalCode = d.postalCode;
            if (d.customerName) merged.customerName = d.customerName;
            if (d.installationNumber) merged.installationNumber = d.installationNumber;
            if (d.confidence) merged.confidence = d.confidence;
            return merged;
          }
        }
      } catch (err) {
        console.warn("Falha na chamada de OCR remoto; usando fallback assistido:", err);
      }
    }

    await delay(650);
    const invoice = structuredClone(demoCase.invoice);
    if (file) invoice.fileName = file.name;
    return invoice;
  }

  async saveReviewedInvoice(invoice) {
    await delay(180);
    return { ...structuredClone(invoice), reviewedAt: new Date().toISOString(), status: "reviewed" };
  }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
