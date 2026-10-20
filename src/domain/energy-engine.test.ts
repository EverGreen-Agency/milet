import { describe, it, expect } from "vitest";
import {
  calculateBaseline,
  normalizeProposal,
  rankProposals,
  validateInvoice,
  evaluateEligibility,
  formatCurrencyBRL,
  type InvoiceInput,
  type ProposalInput,
  type BaselineComponents
} from "./energy-engine";

describe("Feature: Energy Baseline Calculation and Diagnostics Engine", () => {
  describe("Rule: Invoice intake must be strictly validated before processing", () => {
    it("Scenario: Valid invoice intake passes with zero errors", () => {
      // Given: A valid invoice with positive consumption, total, and period
      const invoice: InvoiceInput = {
        consumptionKwh: 12480,
        total: 10920,
        period: "2026-08",
        distributor: "Cemig",
        contractedDemandKw: 75,
        voltageGroup: "A4"
      };

      // When: The invoice validation runs
      const errors = validateInvoice(invoice);

      // Then: No validation errors are returned
      expect(errors).toEqual({});
      expect(Object.keys(errors).length).toBe(0);
    });

    it("Scenario: Invoice with missing or invalid metrics returns specific actionable errors", () => {
      // Given: An incomplete invoice with non-positive values
      const invalidInvoice: InvoiceInput = {
        consumptionKwh: 0,
        total: -10,
        period: "",
        distributor: ""
      };

      // When: The invoice validation runs
      const errors = validateInvoice(invalidInvoice);

      // Then: Errors for consumption, total, and period are reported
      expect(errors.consumptionKwh).toBe("Informe o consumo do período.");
      expect(errors.total).toBe("Informe o valor total da fatura.");
      expect(errors.period).toBe("Informe o período de referência.");
    });
  });

  describe("Rule: Baseline accurately aggregates all bill components", () => {
    it("Scenario: Baseline total is the exact sum of energy, distribution, taxes, and flags", () => {
      // Given: Decomposed bill components
      const components: BaselineComponents = {
        energy: 5360,
        distribution: 3100,
        taxes: 2040,
        flags: 420
      };

      // When: Baseline is calculated
      const total = calculateBaseline(components);

      // Then: The total equals 10920 BRL
      expect(total).toBe(10920);
    });

    it("Scenario: Baseline safely handles empty or zero components", () => {
      // Given: Incomplete components
      const components: BaselineComponents = {
        energy: 1000
      };

      // When: Baseline is calculated
      const total = calculateBaseline(components);

      // Then: It returns only the non-null component
      expect(total).toBe(1000);
    });
  });

  describe("Rule: Proposals must disclose all-in monthly costs including Milet service and taxes", () => {
    it("Scenario: Proposal normalization computes net savings and percentage versus baseline", () => {
      // Given: A baseline total of 10920 and a supplier proposal with transparent breakdown
      const baselineTotal = 10920;
      const proposal: ProposalInput = {
        id: "PROP-ALVORADA-01",
        supplier: "Alvorada Energia",
        route: "Mercado livre",
        termMonths: 36,
        renewable: "Incentivada 50%",
        adjustment: "IPCA anual",
        risk: "Médio",
        missing: [],
        costs: {
          residualBill: 2940,
          supplier: 4900,
          miletService: 280,
          taxes: 1600,
          financing: 0
        },
        remuneration: "R$ 280/mês de serviço Milet, já incluídos no total."
      };

      // When: Proposal is normalized
      const normalized = normalizeProposal(proposal, baselineTotal);

      // Then: Total is 9720 and monthly saving is 1200 with ~10.98% reduction
      expect(normalized.total).toBe(9720);
      expect(normalized.monthlySaving).toBe(1200);
      expect(normalized.savingPercent).toBeCloseTo(10.989, 2);
    });

    it("Scenario: Proposal with zero baseline calculates zero saving percentage gracefully", () => {
      // Given: A proposal evaluated against a zero baseline
      const proposal: ProposalInput = {
        id: "PROP-ZERO",
        supplier: "Test",
        route: "Mercado livre",
        termMonths: 12,
        renewable: "Solar",
        adjustment: "IPCA",
        risk: "Baixo",
        missing: [],
        costs: { supplier: 1000 },
        remuneration: "Sem comissão"
      };

      // When: Normalized with zero baseline
      const normalized = normalizeProposal(proposal, 0);

      // Then: Saving percentage is safely 0
      expect(normalized.savingPercent).toBe(0);
      expect(normalized.monthlySaving).toBe(-1000);
    });
  });

  describe("Rule: Proposals are ranked by lowest all-in cost for the consumer", () => {
    it("Scenario: Multiple proposals are sorted from lowest to highest total cost", () => {
      // Given: Two proposals with different total costs
      const baselineTotal = 10920;
      const propA: ProposalInput = {
        id: "PROP-A",
        supplier: "Fornecedor A",
        route: "Mercado livre",
        termMonths: 24,
        renewable: "Padrão",
        adjustment: "IPCA",
        risk: "Médio",
        missing: [],
        costs: { supplier: 6000, residualBill: 3000 },
        remuneration: "Transparente"
      };
      const propB: ProposalInput = {
        id: "PROP-B",
        supplier: "Fornecedor B",
        route: "Mercado livre",
        termMonths: 24,
        renewable: "Solar",
        adjustment: "IPCA",
        risk: "Baixo",
        missing: [],
        costs: { supplier: 4000, residualBill: 3000 },
        remuneration: "Transparente"
      };

      // When: Proposals are ranked
      const ranked = rankProposals([propA, propB], baselineTotal);

      // Then: Prop B is Rank 1 and Prop A is Rank 2
      expect(ranked[0]?.id).toBe("PROP-B");
      expect(ranked[0]?.rank).toBe(1);
      expect(ranked[1]?.id).toBe("PROP-A");
      expect(ranked[1]?.rank).toBe(2);
    });
  });

  describe("Rule: Regulatory and technical eligibility routes are properly evaluated", () => {
    it("Scenario: A4 unit with contracted demand >= 30kW is eligible for Free Market Retail", () => {
      // Given: An A4 voltage group unit
      const invoice: InvoiceInput = {
        consumptionKwh: 15000,
        total: 12000,
        period: "2026-08",
        distributor: "Cemig",
        voltageGroup: "A4",
        contractedDemandKw: 75
      };

      // When: Eligibility is evaluated
      const routes = evaluateEligibility(invoice);

      // Then: Free market is eligible
      const freeMarket = routes.find((r) => r.route === "Mercado livre varejista");
      expect(freeMarket?.status).toBe("eligible");
    });

    it("Scenario: Low voltage B1 unit is routed to Distributed Generation (GD) instead of Free Market", () => {
      // Given: A low-voltage residential/small commercial unit (Group B)
      const invoice: InvoiceInput = {
        consumptionKwh: 1200,
        total: 1100,
        period: "2026-08",
        distributor: "Enel",
        voltageGroup: "B1"
      };

      // When: Eligibility is evaluated
      const routes = evaluateEligibility(invoice);

      // Then: Free market is ineligible and GD is eligible
      const freeMarket = routes.find((r) => r.route === "Mercado livre varejista");
      const gd = routes.find((r) => r.route === "Geração compartilhada (GD)");
      expect(freeMarket?.status).toBe("ineligible");
      expect(gd?.status).toBe("eligible");
    });

    it("Scenario: Invoice without specified voltageGroup but with demand >= 30kW qualifies for Free Market", () => {
      // Given: An invoice without voltageGroup but high contracted demand
      const invoice: InvoiceInput = {
        consumptionKwh: 14000,
        total: 11500,
        period: "2026-08",
        contractedDemandKw: 50
      };

      // When: Eligibility is evaluated
      const routes = evaluateEligibility(invoice);

      // Then: High demand qualifies for Free Market
      const freeMarket = routes.find((r) => r.route === "Mercado livre varejista");
      expect(freeMarket?.status).toBe("eligible");
    });

    it("Scenario: Invoice without voltageGroup and without demand routes to Group B", () => {
      // Given: An invoice with no voltageGroup or demand
      const invoice: InvoiceInput = {
        consumptionKwh: 800,
        total: 750,
        period: "2026-08"
      };

      // When: Eligibility is evaluated
      const routes = evaluateEligibility(invoice);

      // Then: Routes to GD
      const gd = routes.find((r) => r.route === "Geração compartilhada (GD)");
      expect(gd?.status).toBe("eligible");
    });
  });

  describe("Rule: Currency formatting follows Brazilian Real standards", () => {
    it("Scenario: Formats number into BRL currency string without decimal cents", () => {
      // Given: A monetary numeric value
      const value = 10920;

      // When: Formatted as BRL
      const formatted = formatCurrencyBRL(value);

      // Then: Contains R$ and the thousand separator
      expect(formatted).toMatch(/R\$\s?10\.920/);
    });
  });
});

