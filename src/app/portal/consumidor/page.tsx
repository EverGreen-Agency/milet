"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Buildings,
  CheckCircle,
  Eye,
  EyeSlash,
  Lightning,
  ShieldCheck
} from "@phosphor-icons/react";
import { formatCurrencyBRL } from "@/domain/energy-engine";
import {
  getFioBPercentage,
  maskLeadForSupplier,
  matchCaseToOffers,
  type GenerationAssetPool,
  type PortalCaseInput,
  type WholesaleOfferInput
} from "@/domain/matching-engine";

const BASE_CASE: PortalCaseInput = {
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

const OFFERS: readonly WholesaleOfferInput[] = [
  {
    id: "off-acl-alvorada",
    supplierTenantId: "t-com-1",
    supplierName: "Alvorada Energia Varejista (Demo)",
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
    supplierName: "Consórcio Solar Paulista (Demo)",
    submarket: "SE/CO",
    proposalType: "GD_ASSINATURA",
    energyCostBrl: 5280,
    residualDistributionBrl: 2980,
    taxesBrl: 1520,
    guaranteesBrl: 0,
    miletFeeMonthlyBrl: 120,
    contractTermMonths: 12
  }
];

const ASSETS: readonly GenerationAssetPool[] = [
  {
    id: "asset-ufv-cerrado",
    tenantId: "t-usina-1",
    name: "UFV Solar Cerrado I (Cota GD)",
    modality: "GD_COMPARTILHADA",
    submarket: "SE/CO",
    distributor: "Cemig",
    capacityKw: 250,
    availableKwhMonth: 50000,
    discountPercent: 18
  }
];

export default function ConsumerPortalPage() {
  const [consentShared, setConsentShared] = useState<boolean>(true);
  const [selectedOfferId, setSelectedOfferId] = useState<string>("off-acl-alvorada");

  const activeCase = useMemo(
    () => ({ ...BASE_CASE, consentShared }),
    [consentShared]
  );

  const matches = useMemo(
    () => matchCaseToOffers(activeCase, OFFERS, ASSETS, 2026),
    [activeCase]
  );

  const supplierPreview = useMemo(
    () => maskLeadForSupplier(activeCase, consentShared),
    [activeCase, consentShared]
  );

  const fioB2026 = Math.round(getFioBPercentage(2026) * 100);
  const bestMatch = matches[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
            <Buildings weight="duotone" className="w-4 h-4" />
            <span>Portal do Consumidor PME</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            {BASE_CASE.companyName}
          </h1>
          <p className="text-sm text-[var(--foreground)]/70">
            Unidade {BASE_CASE.distributor} · Grupo {BASE_CASE.voltageGroup} · {BASE_CASE.consumptionKwh.toLocaleString("pt-BR")} kWh/mês · Demanda {BASE_CASE.contractedDemandKw} kW
          </p>
        </div>

        <Link
          href="/diagnostico"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white milet-amber-gradient shadow-sm hover:brightness-105 transition-all"
        >
          <span>Nova Análise de Fatura</span>
          <ArrowRight weight="bold" className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
          <div className="text-xs text-[var(--foreground)]/65">Fatura Atual (Cativo)</div>
          <div className="text-2xl font-bold font-mono">
            {formatCurrencyBRL(BASE_CASE.baselineTotalBrl)}
          </div>
          <div className="text-xs text-[var(--foreground)]/60">Base regulada para equalização</div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
          <div className="text-xs text-[var(--foreground)]/65">Melhor Rota Calculada</div>
          <div className="text-2xl font-bold font-mono text-emerald-600">
            {bestMatch ? `${formatCurrencyBRL(bestMatch.monthlySavingBrl)}/mês` : "—"}
          </div>
          <div className="text-xs text-[var(--foreground)]/60">
            {bestMatch ? `${bestMatch.savingPercent}% de economia líquida All-In` : "Sem ofertas"}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
          <div className="text-xs text-[var(--foreground)]/65">Transição Lei 14.300 (2026)</div>
          <div className="text-2xl font-bold font-mono text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
            {fioB2026}% Fio B
          </div>
          <div className="text-xs text-[var(--foreground)]/60">Já descontado nas propostas GD</div>
        </div>
      </div>

      <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-bold">
              Equalização All-In (Taxa Milet Explícita)
            </h2>
            <p className="text-xs text-[var(--foreground)]/70">
              Custo integral mensal incluindo energia, fio residual da distribuidora, tributos e fee fixo da Milet.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <Lightning weight="fill" className="w-3.5 h-3.5" />
            <span>Motor determinístico ADR-008</span>
          </span>
        </div>

        <div className="space-y-3">
          {matches.map((item) => {
            const isChosen = selectedOfferId === item.offerId;
            return (
              <div
                key={item.offerId}
                className={`p-4 rounded-xl border transition-all flex flex-wrap items-center justify-between gap-4 ${
                  isChosen
                    ? "bg-[var(--background)] border-[var(--color-milet-amber)] ring-2 ring-[var(--color-milet-amber)]/30"
                    : "bg-[var(--background)] border-[var(--border)]"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--color-milet-amber)]/15 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
                      Rank #{item.rank}
                    </span>
                    <span className="font-bold text-sm">{item.providerName}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-[var(--border)]">
                      {item.route}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--foreground)]/70 flex flex-wrap gap-3">
                    <span>Taxa Milet explícita: {formatCurrencyBRL(item.miletFeeMonthlyBrl)}/mês</span>
                    <span>Fio B aplicado: {Math.round(item.fioBShareApplied * 100)}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold">
                      {formatCurrencyBRL(item.totalAllInBrl)}/mês
                    </div>
                    <div className="text-xs font-semibold text-emerald-600">
                      Economia {formatCurrencyBRL(item.monthlySavingBrl)} ({item.savingPercent}%)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedOfferId(item.offerId)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      isChosen
                        ? "bg-emerald-600 text-white"
                        : "bg-[var(--card)] border border-[var(--border-strong)] hover:border-[var(--color-milet-amber)]"
                    }`}
                  >
                    {isChosen ? (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle weight="fill" className="w-3.5 h-3.5" />
                        <span>Selecionada</span>
                      </span>
                    ) : (
                      <span>Priorizar Rota</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold">
              <ShieldCheck weight="fill" className="w-4 h-4 text-emerald-500" />
              <span>Privacidade e Consentimento LGPD na Mesa B2B</span>
            </div>
            <p className="text-xs text-[var(--foreground)]/70">
              Comercializadoras e usinas só visualizam sua razão social e CNPJ após autorização expressa.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConsentShared((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--background)] border border-[var(--border-strong)] hover:border-[var(--color-milet-amber)] cursor-pointer"
          >
            {consentShared ? (
              <>
                <Eye weight="bold" className="w-4 h-4 text-emerald-500" />
                <span>Identidade liberada para aceite formal</span>
              </>
            ) : (
              <>
                <EyeSlash weight="bold" className="w-4 h-4 text-amber-500" />
                <span>Manter unidade anonimizada</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[var(--foreground)]/60">Como aparece para fornecedores: </span>
            <strong className="font-mono">{supplierPreview.companyLabel}</strong>
          </div>
          <div className="font-mono text-[var(--foreground)]/75">
            CNPJ: {supplierPreview.maskedDocument}
          </div>
        </div>
      </section>
    </div>
  );
}
