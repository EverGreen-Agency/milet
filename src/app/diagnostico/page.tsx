"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DiagnosticStepper } from "@/components/diagnostic/diagnostic-stepper";
import { StepLeadTriage, type LeadData } from "@/components/diagnostic/step-lead-triage";
import { StepInvoiceUpload, type InvoiceExtractedData } from "@/components/diagnostic/step-invoice-upload";
import { StepInvoiceReview } from "@/components/diagnostic/step-invoice-review";
import { StepTechnicalBaseline } from "@/components/diagnostic/step-technical-baseline";
import { StepProposalsAllIn } from "@/components/diagnostic/step-proposals-allin";
import type { ProposalInput } from "@/domain/energy-engine";
import { VideoCamera, Eye, EyeSlash, Sparkle } from "@phosphor-icons/react";

const PITCH_CUES: readonly { shot: string; time: string; cue: string }[] = [
  { shot: "SETUP", time: "0:00–1:15", cue: "Identificação inicial da unidade e perfil" },
  { shot: "SCR-01", time: "1:15–1:21", cue: "Comece pela conta que você já recebe (Carregar fatura de demonstração)" },
  { shot: "SCR-02", time: "1:21–1:28", cue: "Conferir dados da unidade · Passaporte Energético (12.480 kWh • 75 kW • Cemig)" },
  { shot: "SCR-03", time: "1:28–1:34", cue: "Diagnóstico, cartões R$ 10.920 e Rotas de suprimento avaliadas" },
  { shot: "SCR-04", time: "1:34–1:50", cue: "Veja o custo inteiro · Todas as propostas na mesma régua · Marcar proposta" }
];

const INITIAL_PROPOSALS: ProposalInput[] = [
  {
    id: "PROP-ALVORADA-01",
    supplier: "Alvorada Energia Varejista",
    route: "Mercado livre",
    termMonths: 36,
    renewable: "Incentivada 50%",
    adjustment: "IPCA anual",
    risk: "Médio",
    missing: [],
    costs: {
      residualBill: 2940,
      supplier: 4990,
      miletService: 190,
      taxes: 1600,
      financing: 0
    },
    remuneration: "R$ 190/mês de taxa de serviço Milet all-in. Sem comissões ocultas de comercializadoras."
  },
  {
    id: "PROP-SERRA-02",
    supplier: "Serra Clara Energia",
    route: "Mercado livre",
    termMonths: 24,
    renewable: "Convencional",
    adjustment: "IPCA anual",
    risk: "Revisar",
    missing: ["Garantia Bancária"],
    costs: {
      residualBill: 2760,
      supplier: 5000,
      miletService: 190,
      taxes: 1570,
      financing: 420
    },
    remuneration: "R$ 190/mês de taxa de serviço Milet all-in + R$ 420 garantia bancária."
  },
  {
    id: "PROP-HORIZONTE-03",
    supplier: "Horizonte Solar Distribuída",
    route: "Geração compartilhada (GD)",
    termMonths: 12,
    renewable: "100% Solar Distribuída",
    adjustment: "Reajuste Concessionária",
    risk: "Baixo",
    missing: [],
    costs: {
      residualBill: 3100,
      supplier: 5200,
      miletService: 150,
      taxes: 1200,
      financing: 0
    },
    remuneration: "R$ 150/mês de serviço Milet all-in. Sem obras no telhado."
  }
];

export default function DiagnosticoPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showPitchBar, setShowPitchBar] = useState<boolean>(true);

  const [lead, setLead] = useState<LeadData>({
    name: "Eduardo Ferreira de Mattos",
    email: "contato@padariahorizonte.com.br",
    phone: "(31) 98765-4321",
    companyName: "Padaria Horizonte Ltda",
    documentNumber: "12.345.678/0001-90",
    distributor: "Cemig",
    city: "Belo Horizonte",
    state: "MG",
    profile: "company",
    objective: "Avaliar viabilidade de migração para o Mercado Livre de Energia e redução de custos.",
    consentDataProcessing: true,
    optInContact: true
  });

  const [invoice, setInvoice] = useState<InvoiceExtractedData>({
    distributor: "Cemig",
    period: "2026-08",
    consumptionKwh: 12480,
    total: 10920,
    contractedDemandKw: 75,
    voltageGroup: "A4",
    tariffFlag: "Verde",
    fileName: "fatura-sintetica-padaria-agosto-2026.pdf",
    confidenceScore: 0.98
  });

  const [proposals, setProposals] = useState<ProposalInput[]>(INITIAL_PROPOSALS);

  // Atalhos de teclado para ensaio e gravação (teclas 1-5, setas e H para ocultar barra de controle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
        return;
      }

      if (e.key === "1") setCurrentStep(0);
      else if (e.key === "2") setCurrentStep(1);
      else if (e.key === "3") setCurrentStep(2);
      else if (e.key === "4") setCurrentStep(3);
      else if (e.key === "5") setCurrentStep(4);
      else if (e.key === "h" || e.key === "H") setShowPitchBar((prev) => !prev);
      else if (e.key === "ArrowRight") setCurrentStep((prev) => Math.min(4, prev + 1));
      else if (e.key === "ArrowLeft") setCurrentStep((prev) => Math.max(0, prev - 1));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLeadComplete = (validatedLead: LeadData) => {
    setLead(validatedLead);
    if (validatedLead.distributor) {
      setInvoice((prev) => ({ ...prev, distributor: validatedLead.distributor }));
    }
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInvoiceUploadComplete = (extractedInvoice: InvoiceExtractedData) => {
    setInvoice(extractedInvoice);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInvoiceReviewComplete = (reviewedInvoice: InvoiceExtractedData) => {
    setInvoice(reviewedInvoice);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTechnicalBaselineComplete = () => {
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRestart = () => {
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Barra Auxiliar do Modo de Gravação e Pitch Deck (Pressione 'H' para ocultar na gravação) */}
        {showPitchBar ? (
          <div className="mb-6 p-3 rounded-2xl bg-[var(--card)] border border-[var(--color-milet-amber)]/30 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-milet-amber)] animate-pulse" />
              <span className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <VideoCamera weight="fill" className="w-4 h-4 text-[var(--color-milet-amber)]" />
                <span>Pitch Supernova 2026:</span>
              </span>
              <span className="font-mono px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold">
                {PITCH_CUES[currentStep]?.shot} ({PITCH_CUES[currentStep]?.time})
              </span>
              <span className="text-[var(--foreground)]/70 hidden sm:inline truncate max-w-md">
                {PITCH_CUES[currentStep]?.cue}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[var(--foreground)]/50 hidden md:inline">
                Atalhos: Teclas 1-5 | Setas | [H] Ocultar
              </span>
              <button
                type="button"
                onClick={() => setShowPitchBar(false)}
                title="Ocultar barra de auxílio para gravar tela limpa (ou pressione tecla H)"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors cursor-pointer text-[11px]"
              >
                <EyeSlash weight="bold" className="w-3.5 h-3.5" />
                <span>Ocultar Barra</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setShowPitchBar(true)}
              className="text-[11px] font-mono text-[var(--foreground)]/40 hover:text-[var(--color-milet-amber)] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Eye weight="bold" className="w-3 h-3" />
              <span>Exibir Guia do Pitch [H]</span>
            </button>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[var(--foreground)]/60 mb-6">
          <Link href="/" className="hover:text-[var(--color-milet-amber)]">Início</Link>
          <span>/</span>
          <span className="font-semibold text-[var(--foreground)]">Diagnóstico de Energia</span>
        </div>

        {/* Stepper Progressivo */}
        <DiagnosticStepper
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* Telas Dinâmicas do Stepper */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {currentStep === 0 && (
              <StepLeadTriage
                initialLead={lead}
                onComplete={handleLeadComplete}
              />
            )}

            {currentStep === 1 && (
              <StepInvoiceUpload
                initialInvoice={invoice}
                onBack={() => setCurrentStep(0)}
                onComplete={handleInvoiceUploadComplete}
              />
            )}

            {currentStep === 2 && (
              <StepInvoiceReview
                invoice={invoice}
                onBack={() => setCurrentStep(1)}
                onComplete={handleInvoiceReviewComplete}
              />
            )}

            {currentStep === 3 && (
              <StepTechnicalBaseline
                invoice={invoice}
                onBack={() => setCurrentStep(2)}
                onComplete={handleTechnicalBaselineComplete}
              />
            )}

            {currentStep === 4 && (
              <StepProposalsAllIn
                lead={lead}
                invoice={invoice}
                proposals={proposals}
                onBack={() => setCurrentStep(3)}
                onRestart={handleRestart}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
