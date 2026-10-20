"use client";

import { useState } from "react";
import { ArrowLeft, Lightning, CheckCircle, Warning, Sparkle, ShieldCheck, Printer, Check } from "@phosphor-icons/react";
import {
  rankProposals,
  formatCurrencyBRL,
  type ProposalInput,
  type NormalizedProposal
} from "@/domain/energy-engine";
import type { LeadData } from "./step-lead-triage";
import type { InvoiceExtractedData } from "./step-invoice-upload";

interface StepProposalsAllInProps {
  lead: LeadData;
  invoice: InvoiceExtractedData;
  proposals: ProposalInput[];
  onBack: () => void;
  onRestart: () => void;
}

export function StepProposalsAllIn({
  lead,
  invoice,
  proposals: initialProposals,
  onBack,
  onRestart
}: StepProposalsAllInProps) {
  const baselineTotal = invoice.total || 10920;
  const rankedProposals: NormalizedProposal[] = rankProposals(initialProposals, baselineTotal);

  const [selectedProposalId, setSelectedProposalId] = useState<string>(rankedProposals[0]?.id || "");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [protocolId, setProtocolId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedProposal = rankedProposals.find((p) => p.id === selectedProposalId) || rankedProposals[0];

  const handleConfirmMigration = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        companyName: lead.companyName,
        documentNumber: lead.documentNumber,
        city: lead.city,
        state: lead.state,
        profile: lead.profile,
        objective: lead.objective,
        consumptionKwh: invoice.consumptionKwh,
        total: invoice.total,
        period: invoice.period,
        distributor: invoice.distributor,
        contractedDemandKw: invoice.contractedDemandKw,
        voltageGroup: invoice.voltageGroup,
        tariffFlag: invoice.tariffFlag,
        selectedProposalId: selectedProposal?.id,
        consentGranted: lead.consentDataProcessing
      };

      const res = await fetch("/api/intakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Não foi possível registrar o diagnóstico no momento.");
      }

      const data = await res.json();
      setProtocolId(data.id || `INT-${Date.now()}`);
      setSubmissionSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro de conexão ao submeter o diagnóstico.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (submissionSuccess) {
    return (
      <div className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center space-y-6 max-w-2xl mx-auto shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
          <CheckCircle weight="fill" className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-emerald-600 font-bold">
            Diagnóstico Registrado com Sucesso
          </span>
          <h2 className="font-serif text-3xl font-bold text-[var(--foreground)]">
            Sua solicitação foi encaminhada!
          </h2>
          <p className="text-sm text-[var(--foreground)]/70 leading-relaxed">
            Um e-mail de confirmação foi enviado para <strong>{lead.email}</strong> com o resumo detalhado da sua auditoria tarifária e da proposta selecionada.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] font-mono text-xs text-[var(--foreground)]/80 inline-block">
          Protocolo Oficial: <strong className="text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">{protocolId}</strong>
        </div>

        <div className="text-xs text-[var(--foreground)]/60 max-w-md mx-auto leading-relaxed">
          Nossa equipe de consultoria técnica independente entrará em contato pelo WhatsApp <strong>{lead.phone}</strong> para conferência da minuta contratual e esclarecimento de dúvidas regulatórias.
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-[var(--foreground)] bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--card)] transition-all cursor-pointer"
          >
            <Printer weight="bold" className="w-4 h-4" />
            <span>Salvar / Imprimir Diagnóstico</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white milet-amber-gradient shadow-xs hover:brightness-105 transition-all cursor-pointer"
          >
            <span>Fazer Novo Diagnóstico</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header da seção */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold">
          Etapa 5 de 5
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Comparação Transparente de Propostas All-In
        </h2>
        <p className="text-sm text-[var(--foreground)]/70 max-w-2xl leading-relaxed">
          Abaixo estão as propostas de mercado livre e geração distribuída ranqueadas pelo menor custo global para a sua empresa. Sem taxas ocultas de fornecedores ou comissões embutidas por kWh.
        </p>
      </div>

      {/* Grid de Propostas Ranqueadas */}
      <div className="space-y-4">
        {rankedProposals.map((prop) => {
          const isSelected = prop.id === selectedProposalId;
          const annualSaving = prop.monthlySaving * 12;

          return (
            <div
              key={prop.id}
              onClick={() => setSelectedProposalId(prop.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer relative space-y-4 ${
                isSelected
                  ? "bg-[var(--card)] border-[var(--color-milet-amber)] shadow-sm ring-1 ring-[var(--color-milet-amber)]/30"
                  : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--color-milet-amber)]/40"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full milet-amber-gradient text-white font-bold">
                      Rank #{prop.rank}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[var(--foreground)]">
                      {prop.supplier}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] font-mono text-[var(--foreground)]/70">
                      {prop.route}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--foreground)]/60">
                    Prazo contratual: {prop.termMonths} meses • Fonte: {prop.renewable} • Reajuste: {prop.adjustment}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-xs text-[var(--foreground)]/60">Custo Mensal All-In Estimado</span>
                  <div className="font-serif font-bold text-2xl sm:text-3xl text-[var(--foreground)]">
                    {formatCurrencyBRL(prop.total)}
                    <span className="text-xs font-sans font-normal text-[var(--foreground)]/60">/mês</span>
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                    Economia: {formatCurrencyBRL(prop.monthlySaving)}/mês (-{prop.savingPercent.toFixed(1)}%)
                  </div>
                  <div className="text-[11px] text-[var(--foreground)]/50">
                    Projeção de {formatCurrencyBRL(annualSaving)}/ano
                  </div>
                </div>
              </div>

              {/* Tabela de Custos Decompostos */}
              <div className="pt-4 border-t border-[var(--border)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[var(--background)]">
                  <span className="text-[11px] text-[var(--foreground)]/60 block">Conta Distribuidora (Fio)</span>
                  <strong className="text-[var(--foreground)]">{formatCurrencyBRL(prop.costs.residualBill || 0)}</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--background)]">
                  <span className="text-[11px] text-[var(--foreground)]/60 block">Energia Fornecedor</span>
                  <strong className="text-[var(--foreground)]">{formatCurrencyBRL(prop.costs.supplier || 0)}</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--background)]">
                  <span className="text-[11px] text-[var(--foreground)]/60 block">Serviço Milet Transparente</span>
                  <strong className="text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
                    {formatCurrencyBRL(prop.costs.miletService || 0)}
                  </strong>
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--background)]">
                  <span className="text-[11px] text-[var(--foreground)]/60 block">Tributos / Garantias</span>
                  <strong className="text-[var(--foreground)]">
                    {formatCurrencyBRL((prop.costs.taxes || 0) + (prop.costs.financing || 0))}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--foreground)]/70 pt-1">
                <span className="italic">{prop.remuneration}</span>
                <span className={`inline-flex items-center gap-1 font-semibold ${isSelected ? "text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]" : "text-[var(--foreground)]/50"}`}>
                  {isSelected ? <Check weight="bold" className="w-4 h-4" /> : null}
                  {isSelected ? "Selecionada" : "Clique para selecionar"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {errorMessage ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-medium flex items-center gap-2">
          <Warning weight="fill" className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--foreground)]/80 bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background)] transition-all cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft weight="bold" className="w-4 h-4" />
          <span>Voltar para Diagnóstico</span>
        </button>

        <button
          type="button"
          onClick={handleConfirmMigration}
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white milet-amber-gradient shadow-md hover:brightness-105 transition-all duration-200 active:scale-98 cursor-pointer disabled:opacity-50"
        >
          <Lightning weight="fill" className="w-4 h-4 text-white" />
          <span>{isSubmitting ? "Registrando Diagnóstico..." : "Confirmar e Receber Relatório Completo"}</span>
        </button>
      </div>
    </div>
  );
}
