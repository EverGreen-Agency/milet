export type PortalUserRole = "CONSUMIDOR" | "COMERCIALIZADORA" | "USINA" | "ADMIN";
export type PortalSubmarket = "SE/CO" | "S" | "NE" | "N";
export type PortalProposalType = "ACL_VAREJISTA" | "GD_ASSINATURA" | "AUTOPRODUCAO";

export interface PortalCaseInput {
  id: string;
  tenantId: string;
  companyName: string;
  documentNumber: string;
  distributor: string;
  submarket: PortalSubmarket;
  voltageGroup: string;
  consumptionKwh: number;
  contractedDemandKw: number;
  baselineTotalBrl: number;
  consentShared: boolean;
}

export interface MaskedPortalLead {
  id: string;
  distributor: string;
  submarket: PortalSubmarket;
  voltageGroup: string;
  consumptionKwh: number;
  contractedDemandKw: number;
  companyLabel: string;
  maskedDocument: string;
  identityRevealed: boolean;
}

export interface GenerationAssetPool {
  id: string;
  tenantId: string;
  name: string;
  modality: "GD_COMPARTILHADA" | "AUTOPRODUCAO_ACL";
  submarket: PortalSubmarket;
  distributor: string;
  capacityKw: number;
  availableKwhMonth: number;
  discountPercent: number;
}

export interface WholesaleOfferInput {
  id: string;
  supplierTenantId: string;
  supplierName: string;
  submarket: PortalSubmarket;
  proposalType: PortalProposalType;
  energyCostBrl: number;
  residualDistributionBrl: number;
  taxesBrl: number;
  guaranteesBrl: number;
  miletFeeMonthlyBrl: number;
  contractTermMonths: number;
}

export interface PortalMatchItem {
  offerId: string;
  providerTenantId: string;
  providerName: string;
  route: PortalProposalType;
  totalAllInBrl: number;
  monthlySavingBrl: number;
  savingPercent: number;
  miletFeeMonthlyBrl: number;
  fioBShareApplied: number;
  rank: number;
}

const FIO_B_SCHEDULE: Record<number, number> = {
  2023: 0.15,
  2024: 0.3,
  2025: 0.45,
  2026: 0.6,
  2027: 0.75,
};

/**
 * Escalonamento progressivo de cobrança do Fio B conforme Lei 14.300/2022 (MMGD).
 */
export function getFioBPercentage(year: number): number {
  if (year < 2023) return 0;
  if (year >= 2028) return 0.9;
  return FIO_B_SCHEDULE[year]!;
}

/**
 * Mascara razão social e CNPJ do consumidor PME na mesa de comercializadoras antes de aceite formal.
 */
export function maskLeadForSupplier(
  energyCase: PortalCaseInput,
  revealIdentity: boolean
): MaskedPortalLead {
  const canReveal = revealIdentity && energyCase.consentShared;
  return {
    id: energyCase.id,
    distributor: energyCase.distributor,
    submarket: energyCase.submarket,
    voltageGroup: energyCase.voltageGroup,
    consumptionKwh: energyCase.consumptionKwh,
    contractedDemandKw: energyCase.contractedDemandKw,
    companyLabel: canReveal
      ? energyCase.companyName
      : `Unidade Anonimizada ${energyCase.id.slice(-4)} (${energyCase.submarket})`,
    maskedDocument: canReveal ? energyCase.documentNumber : "**.***.***/****-**",
    identityRevealed: canReveal,
  };
}

/**
 * Aloca consumo mensal de um consumidor contra o saldo disponível de uma usina de GD de forma pura.
 */
export function allocateConsumerToAsset(
  asset: GenerationAssetPool,
  consumptionKwhMonth: number
): GenerationAssetPool {
  if (consumptionKwhMonth <= 0) {
    throw new Error("Consumo para alocação deve ser positivo.");
  }
  if (consumptionKwhMonth > asset.availableKwhMonth) {
    throw new Error("Saldo de geração disponível insuficiente na usina.");
  }
  return {
    ...asset,
    availableKwhMonth: Number((asset.availableKwhMonth - consumptionKwhMonth).toFixed(2)),
  };
}

/**
 * Faz o matching entre unidade consumidora, ofertas de comercializadoras e cotas de usinas GD,
 * preservando a taxa da Milet em linha explícita (ADR-008) e ordenando pelo menor custo total All-In.
 */
export function matchCaseToOffers(
  energyCase: PortalCaseInput,
  offers: readonly WholesaleOfferInput[],
  assets: readonly GenerationAssetPool[] = [],
  referenceYear = 2026
): PortalMatchItem[] {
  const isGroupA = energyCase.voltageGroup.toUpperCase().startsWith("A") || energyCase.contractedDemandKw >= 30;
  const fioBShare = getFioBPercentage(referenceYear);
  const candidates: Omit<PortalMatchItem, "rank">[] = [];

  for (const offer of offers) {
    if (offer.submarket !== energyCase.submarket) continue;
    if (offer.proposalType !== "GD_ASSINATURA" && !isGroupA) continue;

    const totalAllIn =
      offer.energyCostBrl +
      offer.residualDistributionBrl +
      offer.taxesBrl +
      offer.guaranteesBrl +
      offer.miletFeeMonthlyBrl;
    const monthlySaving = Number((energyCase.baselineTotalBrl - totalAllIn).toFixed(2));
    const savingPercent =
      energyCase.baselineTotalBrl > 0
        ? Number(((monthlySaving / energyCase.baselineTotalBrl) * 100).toFixed(2))
        : 0;

    candidates.push({
      offerId: offer.id,
      providerTenantId: offer.supplierTenantId,
      providerName: offer.supplierName,
      route: offer.proposalType,
      totalAllInBrl: Number(totalAllIn.toFixed(2)),
      monthlySavingBrl: monthlySaving,
      savingPercent,
      miletFeeMonthlyBrl: offer.miletFeeMonthlyBrl,
      fioBShareApplied: offer.proposalType === "GD_ASSINATURA" ? fioBShare : 0,
    });
  }

  for (const asset of assets) {
    if (asset.submarket !== energyCase.submarket) continue;
    if (asset.distributor.toLowerCase() !== energyCase.distributor.toLowerCase()) continue;
    if (asset.availableKwhMonth < energyCase.consumptionKwh) continue;

    const grossDiscount = (asset.discountPercent / 100) * (1 - fioBShare * 0.28);
    const miletFee = 120;
    const totalAllIn = Number(
      (energyCase.baselineTotalBrl * (1 - grossDiscount) + miletFee).toFixed(2)
    );
    const monthlySaving = Number((energyCase.baselineTotalBrl - totalAllIn).toFixed(2));
    const savingPercent =
      energyCase.baselineTotalBrl > 0
        ? Number(((monthlySaving / energyCase.baselineTotalBrl) * 100).toFixed(2))
        : 0;

    candidates.push({
      offerId: asset.id,
      providerTenantId: asset.tenantId,
      providerName: asset.name,
      route: "GD_ASSINATURA",
      totalAllInBrl: totalAllIn,
      monthlySavingBrl: monthlySaving,
      savingPercent,
      miletFeeMonthlyBrl: miletFee,
      fioBShareApplied: fioBShare,
    });
  }

  return candidates
    .sort((a, b) => a.totalAllInBrl - b.totalAllInBrl)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
}
