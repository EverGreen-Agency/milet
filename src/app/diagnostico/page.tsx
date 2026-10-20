"use client";

import { useState } from "react";
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
      supplier: 4900,
      miletService: 280,
      taxes: 1600,
      financing: 0
    },
    remuneration: "R$ 280/mês de taxa de serviço Milet all-in. Sem comissões ocultas de comercializadoras."
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

  const [lead, setLead] = useState<LeadData>({
    name: "",
    email: "",
    phone: "",
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

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
