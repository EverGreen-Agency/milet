"use client";

import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle, WarningCircle, Scales, Lightning } from "@phosphor-icons/react";
import { formatCurrencyBRL, evaluateEligibility, type EligibilityResult } from "@/domain/energy-engine";
import type { InvoiceExtractedData } from "./step-invoice-upload";

interface StepTechnicalBaselineProps {
  invoice: InvoiceExtractedData;
  onBack: () => void;
  onComplete: () => void;
}

export function StepTechnicalBaseline({ invoice, onBack, onComplete }: StepTechnicalBaselineProps) {
  const total = invoice.total || 10920;
  const eligibility: EligibilityResult[] = evaluateEligibility(invoice);

  // Decomposição calculada proporcional de custos regulatórios do setor elétrico brasileiro
  const energyCost = Math.round(total * 0.49);
  const distributionCost = Math.round(total * 0.28);
  const taxesCost = Math.round(total * 0.19);
  const flagsCost = total - (energyCost + distributionCost + taxesCost);

  const energyPercent = Math.round((energyCost / total) * 100);
  const distributionPercent = Math.round((distributionCost / total) * 100);
  const taxesPercent = Math.round((taxesCost / total) * 100);
  const flagsPercent = 100 - (energyPercent + distributionPercent + taxesPercent);

  return (
    <div className="space-y-8">
      {/* Header da seção */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold">
          Etapa 4 de 5
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Diagnóstico Técnico & Decomposição da Fatura
        </h2>
        <p className="text-sm text-[var(--foreground)]/70 max-w-2xl leading-relaxed">
          Entenda para onde vai cada real da sua conta de energia atual. No Mercado Livre, você negocia diretamente a parcela de Energia Líquida, mantendo o pagamento do Fio à concessionária.
        </p>
      </div>

      {/* Grid de Baseline e Gráfico Empilhado */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-[var(--foreground)]/60">
              Custo Baseline Mensal
            </span>
            <div className="font-serif font-bold text-3xl text-[var(--foreground)]">
              {formatCurrencyBRL(total)}
              <span className="text-xs font-sans font-normal text-[var(--foreground)]/60">/mês</span>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs text-[var(--foreground)]/70 font-mono">
            <span>Distribuidora: {invoice.distributor || "Cemig"}</span>
            <br />
            <span>Tensão: {invoice.voltageGroup || "A4"} {invoice.contractedDemandKw ? `(${invoice.contractedDemandKw} kW)` : ""}</span>
          </div>
        </div>

        {/* Barra Proporcional Empilhada */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-[var(--foreground)]/70">
            <span>Decomposição Setorial da Tarifa:</span>
            <span>100% dos componentes faturados</span>
          </div>

          <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-xs border border-[var(--border)]">
            <div
              style={{ width: `${energyPercent}%` }}
              className="milet-amber-gradient flex items-center justify-center text-[10px] font-bold text-white truncate px-1"
              title={`Energia Líquida: ${formatCurrencyBRL(energyCost)} (${energyPercent}%)`}
            >
              Energia ({energyPercent}%)
            </div>
            <div
              style={{ width: `${distributionPercent}%` }}
              className="bg-[#C55221] flex items-center justify-center text-[10px] font-bold text-white truncate px-1"
              title={`Distribuição/Fio TUSD: ${formatCurrencyBRL(distributionCost)} (${distributionPercent}%)`}
            >
              Fio ({distributionPercent}%)
            </div>
            <div
              style={{ width: `${taxesPercent}%` }}
              className="bg-[#1B1916] dark:bg-[#38332C] flex items-center justify-center text-[10px] font-bold text-white truncate px-1"
              title={`Tributos ICMS/PIS/COFINS: ${formatCurrencyBRL(taxesCost)} (${taxesPercent}%)`}
            >
              Tributos ({taxesPercent}%)
            </div>
            <div
              style={{ width: `${flagsPercent}%` }}
              className="bg-amber-600 flex items-center justify-center text-[10px] font-bold text-white truncate px-1"
              title={`Bandeiras e Encargos: ${formatCurrencyBRL(flagsCost)} (${flagsPercent}%)`}
            >
              Bandeiras ({flagsPercent}%)
            </div>
          </div>
        </div>

        {/* Cards dos Componentes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-milet-amber)]" />
              <span>Energia (TE)</span>
            </div>
            <div className="font-bold text-sm text-[var(--foreground)]">{formatCurrencyBRL(energyCost)}</div>
            <div className="text-[11px] text-[var(--foreground)]/60">Negociável no Mercado Livre</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-xs text-[#C55221] font-bold mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C55221]" />
              <span>Fio / Rede (TUSD)</span>
            </div>
            <div className="font-bold text-sm text-[var(--foreground)]">{formatCurrencyBRL(distributionCost)}</div>
            <div className="text-[11px] text-[var(--foreground)]/60">Regulado pela ANEEL</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--foreground)]/80 font-bold mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1B1916] dark:bg-[#38332C]" />
              <span>Impostos</span>
            </div>
            <div className="font-bold text-sm text-[var(--foreground)]">{formatCurrencyBRL(taxesCost)}</div>
            <div className="text-[11px] text-[var(--foreground)]/60">ICMS, PIS, COFINS</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <span>Bandeiras</span>
            </div>
            <div className="font-bold text-sm text-[var(--foreground)]">{formatCurrencyBRL(flagsCost)}</div>
            <div className="text-[11px] text-[var(--foreground)]/60">Adicional sazonal ANEEL</div>
          </div>
        </div>
      </div>

      {/* Enquadramento Regulatório */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h3 className="font-serif font-bold text-base text-[var(--foreground)] flex items-center gap-2">
            <ShieldCheck weight="fill" className="w-5 h-5 text-[var(--color-milet-amber)]" />
            <span>Enquadramento Normativo ANEEL</span>
          </h3>
          <span className="text-xs px-2.5 py-1 rounded bg-[var(--background)] border border-[var(--border)] font-mono text-[var(--foreground)]/70">
            Portaria MME 50/2022 &amp; Lei 14.300
          </span>
        </div>

        <div className="space-y-3">
          {eligibility.map((item, index) => {
            const isEligible = item.status === "eligible";
            const isReview = item.status === "review";

            return (
              <div
                key={index}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isEligible
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : isReview
                    ? "bg-amber-500/5 border-amber-500/20"
                    : "bg-[var(--background)] border-[var(--border)] opacity-60"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isEligible ? (
                      <CheckCircle weight="fill" className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : isReview ? (
                      <WarningCircle weight="fill" className="w-5 h-5 text-amber-600 shrink-0" />
                    ) : (
                      <Scales weight="bold" className="w-5 h-5 text-[var(--foreground)]/40 shrink-0" />
                    )}
                    <h4 className="font-bold text-sm text-[var(--foreground)]">{item.route}</h4>
                  </div>
                  <p className="text-xs text-[var(--foreground)]/70 leading-relaxed pl-7">
                    {item.reason}
                  </p>
                </div>

                <div className="shrink-0 pl-7 sm:pl-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isEligible
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : isReview
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        : "bg-[var(--foreground)]/10 text-[var(--foreground)]/60"
                    }`}
                  >
                    {isEligible ? "Elegível Agora" : isReview ? "Requer Vistoria" : "Inelegível"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--foreground)]/80 bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background)] transition-all cursor-pointer"
        >
          <ArrowLeft weight="bold" className="w-4 h-4" />
          <span>Voltar para Conferência</span>
        </button>

        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white milet-amber-gradient shadow-md hover:brightness-105 transition-all duration-200 active:scale-98 cursor-pointer"
        >
          <span>Ver Propostas Comparadas All-In</span>
          <ArrowRight weight="bold" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
