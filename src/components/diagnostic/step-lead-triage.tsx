"use client";

import { useState } from "react";
import { Buildings, ArrowRight, ShieldCheck } from "@phosphor-icons/react";

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  documentNumber: string;
  distributor: string;
  city: string;
  state: string;
  profile: "company" | "supplier" | "home";
  objective: string;
  consentDataProcessing: boolean;
  optInContact: boolean;
}

interface StepLeadTriageProps {
  initialLead: LeadData;
  onComplete: (lead: LeadData) => void;
}

const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
] as const;

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function StepLeadTriage({ initialLead, onComplete }: StepLeadTriageProps) {
  const [lead, setLead] = useState<LeadData>({
    ...initialLead,
    consentDataProcessing: true,
    optInContact: true
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadData, string>> = {};

    if (!lead.name.trim()) newErrors.name = "Informe o seu nome completo.";
    if (!lead.email.trim() || !lead.email.includes("@")) newErrors.email = "Informe um e-mail válido.";
    
    // Validação estrita de Telefone / WhatsApp com DDD brasileiro
    const phoneDigits = lead.phone.replace(/\D/g, "");
    if (!phoneDigits) {
      newErrors.phone = "Informe o WhatsApp ou telefone de contato.";
    } else if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      newErrors.phone = "Informe um telefone válido com DDD (10 ou 11 dígitos).";
    } else if (/^(\d)\1+$/.test(phoneDigits)) {
      newErrors.phone = "Número de telefone inválido (dígitos repetidos).";
    } else {
      const ddd = parseInt(phoneDigits.slice(0, 2), 10);
      if (ddd < 11 || ddd > 99) {
        newErrors.phone = "DDD informado é inválido.";
      } else if (phoneDigits.length === 11 && phoneDigits[2] !== "9") {
        newErrors.phone = "Celulares de 11 dígitos devem iniciar com o dígito 9 após o DDD.";
      }
    }

    if (lead.profile === "company" && !lead.companyName.trim()) {
      newErrors.companyName = "Informe a razão social ou nome da empresa.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onComplete({
        ...lead,
        consentDataProcessing: true,
        optInContact: true
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Header da seção */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold">
          Etapa 1 de 5
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Seu contexto e identificação
        </h2>
        <p className="text-sm text-[var(--foreground)]/70 max-w-2xl leading-relaxed">
          Informe os dados da sua empresa para receber o diagnóstico tarifário. Concessionária, cidade e histórico de consumo serão lidos automaticamente da sua fatura no próximo passo.
        </p>
      </div>

      {/* Perfil atendido nesta fase: só PMEs do Grupo A (média tensão). */}
      <div className="p-4 rounded-xl border border-[var(--color-milet-amber)] bg-[var(--card)] shadow-xs flex items-start gap-3">
        <div className="w-8 h-8 shrink-0 rounded-lg bg-[var(--color-milet-amber)]/10 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] flex items-center justify-center">
          <Buildings weight="fill" className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-sm text-[var(--foreground)]">Empresas do Grupo A (média tensão)</div>
          <div className="text-xs text-[var(--foreground)]/60 mt-0.5 leading-relaxed">
            Comércios, serviços e indústrias com demanda contratada, que já podem escolher de quem compram energia.
          </div>
          <ul className="mt-3 space-y-1.5 text-xs text-[var(--foreground)]/75 leading-relaxed list-disc pl-4 marker:text-[var(--color-milet-amber)]">
            <li>Na sua conta aparece <strong>demanda contratada</strong> e o subgrupo <strong>A4</strong> ou <strong>A3a</strong> (tensão a partir de 2,3 kV).</li>
            <li>Em geral, compensa para contas a partir de cerca de <strong>R$ 10 mil por mês</strong>.</li>
            <li>Não sabe? Siga em frente: a leitura da fatura confere isso para você.</li>
          </ul>
        </div>
      </div>

      {/* Formulário de Identificação */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-6">
        <h3 className="font-serif font-bold text-base text-[var(--foreground)] border-b border-[var(--border)] pb-3">
          Dados do Solicitante
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lead-name" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
              Seu Nome Completo *
            </label>
            <input
              id="lead-name"
              type="text"
              value={lead.name}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[var(--background)] focus:outline-none ${
                errors.name ? "border-rose-500" : "border-[var(--border)] focus:border-[var(--color-milet-amber)]"
              }`}
              placeholder="Ex: Carlos Mendonça"
            />
            {errors.name ? <span className="text-[11px] text-rose-500 mt-1 block">{errors.name}</span> : null}
          </div>

          <div>
            <label htmlFor="lead-email" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
              E-mail para Envio do Diagnóstico *
            </label>
            <input
              id="lead-email"
              type="email"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[var(--background)] focus:outline-none ${
                errors.email ? "border-rose-500" : "border-[var(--border)] focus:border-[var(--color-milet-amber)]"
              }`}
              placeholder="Ex: carlos@empresa.com.br"
            />
            {errors.email ? <span className="text-[11px] text-rose-500 mt-1 block">{errors.email}</span> : null}
          </div>

          <div>
            <label htmlFor="lead-phone" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
              WhatsApp / Telefone de Contato *
            </label>
            <input
              id="lead-phone"
              type="tel"
              value={lead.phone}
              onChange={(e) => setLead({ ...lead, phone: formatPhoneNumber(e.target.value) })}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[var(--background)] focus:outline-none ${
                errors.phone ? "border-rose-500" : "border-[var(--border)] focus:border-[var(--color-milet-amber)]"
              }`}
              placeholder="Ex: (31) 98765-4321"
            />
            {errors.phone ? <span className="text-[11px] text-rose-500 mt-1 block">{errors.phone}</span> : null}
          </div>

          {lead.profile === "company" ? (
            <div>
              <label htmlFor="lead-company" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
                Nome da Empresa / Razão Social *
              </label>
              <input
                id="lead-company"
                type="text"
                value={lead.companyName}
                onChange={(e) => setLead({ ...lead, companyName: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[var(--background)] focus:outline-none ${
                  errors.companyName ? "border-rose-500" : "border-[var(--border)] focus:border-[var(--color-milet-amber)]"
                }`}
                placeholder="Ex: Padaria Horizonte Ltda"
              />
              {errors.companyName ? <span className="text-[11px] text-rose-500 mt-1 block">{errors.companyName}</span> : null}
            </div>
          ) : (
            <div>
              <label htmlFor="lead-document" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
                CPF ou CNPJ (Opcional)
              </label>
              <input
                id="lead-document"
                type="text"
                value={lead.documentNumber}
                onChange={(e) => setLead({ ...lead, documentNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:border-[var(--color-milet-amber)]"
                placeholder="Ex: 12.345.678/0001-90"
              />
            </div>
          )}
        </div>

        {/* Objetivo Livre */}
        <div>
          <label htmlFor="lead-objective" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
            Qual é a sua principal dúvida ou objetivo hoje? (Opcional)
          </label>
          <textarea
            id="lead-objective"
            rows={2}
            value={lead.objective}
            onChange={(e) => setLead({ ...lead, objective: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:border-[var(--color-milet-amber)] leading-relaxed"
            placeholder="Ex: Quero entender se minha conta atual comporta migração para o Mercado Livre e qual a economia líquida."
          />
        </div>
      </div>

      {/* Ação e Conformidade LGPD Sem Fricção */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-[var(--foreground)]/65 max-w-md">
          <ShieldCheck weight="fill" className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>
            Seus dados são criptografados e utilizados exclusivamente para emissão do seu diagnóstico e conferência regulatória (LGPD Art. 7º, V).
          </span>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white milet-amber-gradient shadow-md hover:brightness-105 transition-all duration-200 active:scale-98 cursor-pointer"
        >
          <span>Continuar para envio da fatura</span>
          <ArrowRight weight="bold" className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
