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

export function StepLeadTriage({ initialLead, onComplete }: StepLeadTriageProps) {
  const [lead, setLead] = useState<LeadData>(initialLead);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadData, string>> = {};

    if (!lead.name.trim()) newErrors.name = "Informe o seu nome completo.";
    if (!lead.email.trim() || !lead.email.includes("@")) newErrors.email = "Informe um e-mail válido.";
    if (!lead.phone.trim()) newErrors.phone = "Informe o WhatsApp ou telefone de contato.";
    if (lead.profile === "company" && !lead.companyName.trim()) {
      newErrors.companyName = "Informe a razão social ou nome da empresa.";
    }
    if (!lead.distributor.trim()) newErrors.distributor = "Informe a distribuidora de energia local.";
    if (!lead.city.trim()) newErrors.city = "Informe a cidade.";
    if (!lead.state) newErrors.state = "Selecione o estado.";
    if (!lead.consentDataProcessing) {
      newErrors.consentDataProcessing = "O consentimento LGPD é necessário para processar o diagnóstico.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onComplete(lead);
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
          Para que o diagnóstico calcule tarifas exatas e rotas regulatórias viáveis, informe os dados da empresa e a concessionária local.
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
        </div>
      </div>

      {/* Formulário de Identificação */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-6">
        <h3 className="font-serif font-bold text-base text-[var(--foreground)] border-b border-[var(--border)] pb-3">
          Dados do Solicitante e Unidade
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
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
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

          <div>
            <label htmlFor="lead-distributor" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
              Distribuidora de Energia *
            </label>
            <input
              id="lead-distributor"
              type="text"
              value={lead.distributor}
              onChange={(e) => setLead({ ...lead, distributor: e.target.value })}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[var(--background)] focus:outline-none ${
                errors.distributor ? "border-rose-500" : "border-[var(--border)] focus:border-[var(--color-milet-amber)]"
              }`}
              placeholder="Ex: Cemig, CPFL Paulista, Enel SP, Light"
            />
            {errors.distributor ? <span className="text-[11px] text-rose-500 mt-1 block">{errors.distributor}</span> : null}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="lead-city" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
                Cidade *
              </label>
              <input
                id="lead-city"
                type="text"
                value={lead.city}
                onChange={(e) => setLead({ ...lead, city: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[var(--background)] focus:outline-none ${
                  errors.city ? "border-rose-500" : "border-[var(--border)] focus:border-[var(--color-milet-amber)]"
                }`}
                placeholder="Ex: Belo Horizonte"
              />
              {errors.city ? <span className="text-[11px] text-rose-500 mt-1 block">{errors.city}</span> : null}
            </div>

            <div>
              <label htmlFor="lead-state" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
                UF *
              </label>
              <select
                id="lead-state"
                value={lead.state}
                onChange={(e) => setLead({ ...lead, state: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[var(--background)] focus:outline-none ${
                  errors.state ? "border-rose-500" : "border-[var(--border)] focus:border-[var(--color-milet-amber)]"
                }`}
              >
                <option value="">UF</option>
                {BRAZILIAN_STATES.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              {errors.state ? <span className="text-[11px] text-rose-500 mt-1 block">{errors.state}</span> : null}
            </div>
          </div>
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

        {/* Consentimento LGPD */}
        <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={lead.consentDataProcessing}
              onChange={(e) => setLead({ ...lead, consentDataProcessing: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-[var(--border-strong)] text-[var(--color-milet-amber)] focus:ring-0"
            />
            <span className="text-xs text-[var(--foreground)]/70 leading-relaxed">
              <strong>Consentimento de Tratamento de Dados (LGPD):</strong> Autorizo o Milet a processar as informações técnicas desta unidade, guardadas em armazenamento privado e criptografado, para fins exclusivos de diagnóstico energético e comparação neutra.
            </span>
          </label>
          {errors.consentDataProcessing ? (
            <span className="text-[11px] text-rose-500 block pl-7">{errors.consentDataProcessing}</span>
          ) : null}

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={lead.optInContact}
              onChange={(e) => setLead({ ...lead, optInContact: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-[var(--border-strong)] text-[var(--color-milet-amber)] focus:ring-0"
            />
            <span className="text-xs text-[var(--foreground)]/70 leading-relaxed">
              Aceito receber o relatório formal por e-mail e ser contatado por um consultor técnico independente do Milet.
            </span>
          </label>
        </div>
      </div>

      {/* Botão de Ação */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white milet-amber-gradient shadow-md hover:brightness-105 transition-all duration-200 active:scale-98 cursor-pointer"
        >
          <span>Continuar para envio da fatura</span>
          <ArrowRight weight="bold" className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
