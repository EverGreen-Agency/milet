import { demoCase } from "./fixtures.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class DemoEnergyAdapter {
  async getCase() {
    await delay(120);
    return structuredClone(demoCase);
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
