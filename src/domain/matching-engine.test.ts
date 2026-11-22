import { describe, expect, it } from "vitest";
import {
  allocateConsumerToAsset,
  getFioBPercentage,
  maskLeadForSupplier,
  matchCaseToOffers,
  type GenerationAssetPool,
  type PortalCaseInput,
  type WholesaleOfferInput
} from "./matching-engine";

const PADARIA_CASE: PortalCaseInput = {
  id: "case-padaria-0001",
  tenantId: "t-consumidor-1",
  companyName: "Padaria Horizonte Ltda",
  documentNumber: "12.345.678/0001-90",
  distributor: "Cemig",
  submarket: "SE/CO",
  voltageGroup: "A4",
  consumptionKwh: 12480,
  contractedDemandKw: 75,
  baselineTotalBrl: 10920,
  consentShared: true
};

const SOLAR_ASSET: GenerationAssetPool = {
  id: "asset-ufv-norte",
  tenantId: "t-usina-1",
  name: "UFV Solar Cerrado I",
  modality: "GD_COMPARTILHADA",
  submarket: "SE/CO",
  distributor: "cemig",
  capacityKw: 250,
  availableKwhMonth: 50000,
  discountPercent: 18
};

describe("matching-engine", () => {
  it("calculates progressive Lei 14.300 Fio B percentages across transition years", () => {
    expect(getFioBPercentage(2022)).toBe(0);
    expect(getFioBPercentage(2023)).toBe(0.15);
    expect(getFioBPercentage(2024)).toBe(0.3);
    expect(getFioBPercentage(2025)).toBe(0.45);
    expect(getFioBPercentage(2026)).toBe(0.6);
    expect(getFioBPercentage(2027)).toBe(0.75);
    expect(getFioBPercentage(2028)).toBe(0.9);
    expect(getFioBPercentage(2031)).toBe(0.9);
  });

  it("masks consumer PII before consent and formal reveal", () => {
    const maskedDefault = maskLeadForSupplier(PADARIA_CASE, false);
    expect(maskedDefault.identityRevealed).toBe(false);
    expect(maskedDefault.companyLabel).toBe("Unidade Anonimizada 0001 (SE/CO)");
    expect(maskedDefault.maskedDocument).toBe("**.***.***/****-**");

    const blockedWithoutConsent = maskLeadForSupplier({ ...PADARIA_CASE, consentShared: false }, true);
    expect(blockedWithoutConsent.identityRevealed).toBe(false);
    expect(blockedWithoutConsent.maskedDocument).toBe("**.***.***/****-**");

    const revealed = maskLeadForSupplier(PADARIA_CASE, true);
    expect(revealed.identityRevealed).toBe(true);
    expect(revealed.companyLabel).toBe("Padaria Horizonte Ltda");
    expect(revealed.maskedDocument).toBe("12.345.678/0001-90");
  });

  it("allocates generation pool balances without mutating source asset and rejects invalid amounts", () => {
    expect(() => allocateConsumerToAsset(SOLAR_ASSET, 0)).toThrow("Consumo para alocação deve ser positivo.");
    expect(() => allocateConsumerToAsset(SOLAR_ASSET, -50)).toThrow("Consumo para alocação deve ser positivo.");
    expect(() => allocateConsumerToAsset(SOLAR_ASSET, 55000)).toThrow(
      "Saldo de geração disponível insuficiente na usina."
    );

    const updated = allocateConsumerToAsset(SOLAR_ASSET, 3200);
    expect(updated.availableKwhMonth).toBe(46800);
    expect(SOLAR_ASSET.availableKwhMonth).toBe(50000);
  });

  it("ranks compatible Group A ACL, GD offers and generation assets by lowest All-In cost", () => {
    const offers: WholesaleOfferInput[] = [
      {
        id: "off-acl-alvorada",
        supplierTenantId: "t-com-1",
        supplierName: "Alvorada Energia Varejista",
        submarket: "SE/CO",
        proposalType: "ACL_VAREJISTA",
        energyCostBrl: 4990,
        residualDistributionBrl: 2940,
        taxesBrl: 1600,
        guaranteesBrl: 0,
        miletFeeMonthlyBrl: 190,
        contractTermMonths: 24
      },
      {
        id: "off-gd-verde",
        supplierTenantId: "t-com-2",
        supplierName: "Consórcio GD Paulista",
        submarket: "SE/CO",
        proposalType: "GD_ASSINATURA",
        energyCostBrl: 5200,
        residualDistributionBrl: 3100,
        taxesBrl: 1480,
        guaranteesBrl: 0,
        miletFeeMonthlyBrl: 120,
        contractTermMonths: 12
      },
      {
        id: "off-other-submarket",
        supplierTenantId: "t-com-3",
        supplierName: "Nordeste Livre",
        submarket: "NE",
        proposalType: "ACL_VAREJISTA",
        energyCostBrl: 4100,
        residualDistributionBrl: 2800,
        taxesBrl: 1200,
        guaranteesBrl: 0,
        miletFeeMonthlyBrl: 190,
        contractTermMonths: 36
      }
    ];

    const incompatibleAssets: GenerationAssetPool[] = [
      SOLAR_ASSET,
      { ...SOLAR_ASSET, id: "asset-wrong-sub", submarket: "S" },
      { ...SOLAR_ASSET, id: "asset-wrong-dist", distributor: "CPFL Paulista" },
      { ...SOLAR_ASSET, id: "asset-low-cap", availableKwhMonth: 5000 }
    ];

    const ranked = matchCaseToOffers(PADARIA_CASE, offers, incompatibleAssets, 2026);
    expect(ranked.map((item) => item.offerId)).toEqual([
      "asset-ufv-norte",
      "off-acl-alvorada",
      "off-gd-verde"
    ]);
    expect(ranked[0]?.rank).toBe(1);
    expect(ranked[0]?.fioBShareApplied).toBe(0.6);
    expect(ranked[1]?.fioBShareApplied).toBe(0);
    expect(ranked[1]?.totalAllInBrl).toBe(9720);
    expect(ranked[1]?.monthlySavingBrl).toBe(1200);
    expect(ranked[1]?.miletFeeMonthlyBrl).toBe(190);
    expect(ranked[2]?.fioBShareApplied).toBe(0.6);
  });

  it("blocks ACL offers for pure Group B low-voltage consumers while honoring demand >= 30kW upgrade and zero-baseline safety", () => {
    const groupBCase: PortalCaseInput = {
      ...PADARIA_CASE,
      voltageGroup: "B3",
      consumptionKwh: 2850,
      contractedDemandKw: 0,
      baselineTotalBrl: 2740
    };
    const highDemandGroupBCase: PortalCaseInput = {
      ...groupBCase,
      contractedDemandKw: 35,
      baselineTotalBrl: 0
    };
    const offers: WholesaleOfferInput[] = [
      {
        id: "off-acl-only",
        supplierTenantId: "t-com-1",
        supplierName: "Alvorada Energia Varejista",
        submarket: "SE/CO",
        proposalType: "ACL_VAREJISTA",
        energyCostBrl: 1200,
        residualDistributionBrl: 700,
        taxesBrl: 300,
        guaranteesBrl: 0,
        miletFeeMonthlyBrl: 190,
        contractTermMonths: 24
      },
      {
        id: "off-gd-b3",
        supplierTenantId: "t-com-2",
        supplierName: "Gera Fácil B3",
        submarket: "SE/CO",
        proposalType: "GD_ASSINATURA",
        energyCostBrl: 1500,
        residualDistributionBrl: 650,
        taxesBrl: 240,
        guaranteesBrl: 0,
        miletFeeMonthlyBrl: 90,
        contractTermMonths: 12
      }
    ];

    const pureBMatches = matchCaseToOffers(groupBCase, offers);
    expect(pureBMatches).toHaveLength(1);
    expect(pureBMatches[0]?.offerId).toBe("off-gd-b3");

    const zeroBaselineMatches = matchCaseToOffers(highDemandGroupBCase, offers, [SOLAR_ASSET]);
    expect(zeroBaselineMatches).toHaveLength(3);
    expect(zeroBaselineMatches.every((item) => item.savingPercent === 0)).toBe(true);
  });
});
