"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  WarningCircle,
  Code,
  LockKey,
  Database,
  DeviceMobile,
  Globe,
  Sparkle,
} from "@phosphor-icons/react";

interface ChangelogEntry {
  id: string;
  tag: string;
  category: string;
  date: string;
  dateShort: string;
  status: string;
  statusType: "infra" | "code" | "public";
  title: string;
  problem: string;
  deliveries: string[];
  evidence: string;
  limit: string;
  ctaText?: string;
  ctaHref?: string;
}

const ENTRIES: ChangelogEntry[] = [
  {
    id: "entry-005",
    tag: "#005",
    category: "Storage & S3",
    date: "19 de outubro de 2026",
    dateShort: "19 OUT",
    status: "Implementado na infra",
    statusType: "infra",
    title: "Bucket S3 privado na Railway e segredos de produção ativos para intake consentido.",
    problem:
      "Para viabilizar upload seguro de faturas reais sem expor documentos publicamente, é necessária infraestrutura de quarentena com chaves de acesso criptografadas no servidor.",
    deliveries: [
      "Provisionamento de bucket privado S3-compatível milet-invoices na infraestrutura Railway (região iad).",
      "Cadastro de segredos de ambiente criptografados na Vercel (Produção e Preview) para integração com Gemini, Resend e S3.",
      "Isolamento rigoroso entre artefatos acadêmicos de especificação e o código de produto voltado ao usuário final.",
      "Fluxo de intake PME do Grupo A ativo com validação, consentimento explícito e triagem por IA com limites claros.",
    ],
    evidence:
      "Credenciais S3 validadas na Vercel; endpoint POST /v1/intakes operacional com fallback seguro em caso de indisponibilidade.",
    limit:
      "O upload de documentos reais com OCR direto permanecerá em fase de testes assistidos com revisão humana antes da abertura irrestrita ao público.",
    ctaText: "Acessar diagnóstico de energia",
    ctaHref: "/diagnostico",
  },
  {
    id: "entry-004",
    tag: "#004",
    category: "Mobile Web PWA",
    date: "04 de outubro de 2026",
    dateShort: "04 OUT",
    status: "Implementado no código",
    statusType: "code",
    title: "A jornada passou a ser instalável e resiliente à perda de rede.",
    problem:
      "O layout já era responsivo, mas ainda não existiam manifest, instalação ou um app shell offline verificável.",
    deliveries: [
      "PWA com nome, ícones oficiais, modo standalone e botão de instalação quando o navegador oferece o evento.",
      "Service worker armazena somente o shell e as fixtures sintéticas necessárias para abrir a jornada sem rede.",
      "Rotas de /api são excluídas explicitamente do cache; indisponibilidade aciona fallback local imediato na interface.",
    ],
    evidence:
      "Manifest, ícones e política do service worker são testados; a instalação pública é comprovada via artefatos em produção.",
    limit:
      "PWA não significa aplicativo nativo, distribuição em loja, push ou sincronização de dados reais sem autenticação.",
    ctaText: "Testar no app",
    ctaHref: "/diagnostico",
  },
  {
    id: "entry-003",
    tag: "#003",
    category: "API Sintética",
    date: "04 de outubro de 2026",
    dateShort: "04 OUT",
    status: "Publicado no ar",
    statusType: "public",
    title: "O app ganhou um endpoint público mínimo sem fingir persistência.",
    problem:
      "Para que o produto aberto não dependesse de mocks estáticos no navegador, era necessário um endpoint público capaz de responder o caso sintético.",
    deliveries: [
      "Função serverless na Vercel atendendo /v1/cases/case-synthetic-sp-001 sob contrato versionado.",
      "Documento OpenAPI publicado e validado por script contra os esquemas da v1.",
      "Headers de resposta incluem rastreamento de requisição e política de cache pública.",
    ],
    evidence:
      "Testes automatizados cobrem o payload servido pela função; o endpoint responde em produção sob a rota documentada.",
    limit:
      "Esta rota pública atende apenas o caso sintético publicado. Ela não recebe faturas reais nem persiste dados de usuários.",
    ctaText: "Ver contrato da API",
    ctaHref: "/openapi/v1/openapi.json",
  },
  {
    id: "entry-002",
    tag: "#002",
    category: "Runtime & ORM",
    date: "04 de outubro de 2026",
    dateShort: "04 OUT",
    status: "Código + CI",
    statusType: "code",
    title: "A fundação de runtime passou a usar containers, migrações e outbox transacional.",
    problem:
      "A prova pública de conceito precisava de um backend que pudesse ser operado sem comprometer os requisitos de isolamento multi-tenant.",
    deliveries: [
      "Modelagem relacional em PostgreSQL com tabelas para casos, propostas, auditoria append-only e eventos de outbox.",
      "Row-Level Security (RLS) configurado para isolar dados de cada organização via papel de aplicação sem privilégios de migração.",
      "Processo de worker com lease temporal e fila de mensagens mortas (DLQ) para entrega confiável de eventos.",
    ],
    evidence:
      "Compose local reproduz o ambiente; suíte de integração no CI valida migrações, isolamento de tenant e garantia de entrega do worker.",
    limit:
      "A infraestrutura de banco de dados e worker roda apenas localmente e em ambiente de integração contínua; não há banco de produção aberto.",
    ctaText: "Acompanhar roadmap",
    ctaHref: "/roadmap.html",
  },
  {
    id: "entry-001",
    tag: "#001",
    category: "Superfície Pública",
    date: "03 de outubro de 2026",
    dateShort: "03 OUT",
    status: "Publicado no ar",
    statusType: "public",
    title: "A superfície pública passou a refletir o estado real do projeto.",
    problem:
      "A comunicação de produto aberta precisava distinguir com precisão o que está funcionando do que é hipótese em validação.",
    deliveries: [
      "Páginas de apresentação institucional, roadmap e changelog público organizadas em torno de evidências verificáveis.",
      "Declaração explícita dos limites operacionais de cada versão publicada.",
      "Eliminação de dados de preenchimento ou métricas de tração fictícias em toda a superfície do produto.",
    ],
    evidence:
      "Todas as páginas públicas são validadas por verificador sintático e de integridade de links antes de cada publicação.",
    limit:
      "As páginas públicas documentam decisões e limites técnicos; não constituem proposta comercial nem oferta regulada de energia.",
  },
  {
    id: "entry-000",
    tag: "#000",
    category: "Fatia de Produto",
    date: "03 de outubro de 2026",
    dateShort: "03 OUT",
    status: "Publicado no ar",
    statusType: "public",
    title: "Primeira fatia de produto: dados sintéticos verificáveis.",
    problem:
      "Antes de processar faturas reais de empresas, o modelo precisava demonstrar sua lógica de cálculo com dados abertos e auditáveis.",
    deliveries: [
      "Caso sintético completo com perfil de consumo típico do Grupo A e histórico tarifário auditável.",
      "Regras de negócio de ponta, fora de ponta e demanda contratada codificadas em contratos de dados formais.",
      "Visualização comparativa entre mercado cativo e opções de migração sem arredondamentos ocultos.",
    ],
    evidence:
      "Esquemas JSON formais publicados e versionados; cálculos validados por testes automatizados no repositório público.",
    limit:
      "O caso sintético serve como prova de conceito técnica; não reflete a tarifa de nenhuma concessionária específica nem garante economia.",
  },
];

export default function BuildInPublicPage() {
  const [activeId, setActiveId] = useState<string>("entry-005");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      const allTargets = [
        ...ENTRIES.map((e) => e.id),
        "trabalho-verificado",
        "limites-versao",
      ];

      for (let i = allTargets.length - 1; i >= 0; i--) {
        const id = allTargets[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveId(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--color-milet-amber)]/20 selection:text-[var(--color-milet-amber-dark)]">
      <Navbar />

      {/* Rail Minimalista Lateral (Retrátil - Estilo ChatGPT / Editorial) */}
      <aside
        className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3 p-3 rounded-2xl transition-all duration-300 group hover:bg-[var(--card)]/90 hover:backdrop-blur-xl hover:border hover:border-[var(--border)] hover:shadow-2xl hover:px-5 hover:py-5"
        aria-label="Linha do tempo das entregas"
      >
        <div className="hidden group-hover:block font-mono text-[0.65rem] font-bold tracking-widest uppercase text-[var(--color-milet-amber)] border-b border-[var(--border)] pb-2 mb-1">
          Timeline
        </div>

        {ENTRIES.map((entry) => {
          const isActive = activeId === entry.id;
          return (
            <button
              key={entry.id}
              onClick={() => scrollTo(entry.id)}
              className="flex items-center gap-3 text-left transition-colors duration-150 py-1"
              title={`${entry.dateShort} · ${entry.category}`}
            >
              <span
                className={`h-0.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-7 h-[3px] bg-[var(--color-milet-amber)] shadow-[0_0_12px_rgba(204,136,0,0.6)]"
                    : "w-3.5 bg-[var(--border-strong)] group-hover:w-5 group-hover:bg-[var(--foreground)]/40"
                }`}
              />
              <span
                className={`hidden group-hover:flex items-center gap-2 text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold"
                    : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                }`}
              >
                <span>{entry.category}</span>
                <span className="font-mono text-[0.65rem] text-[var(--foreground)]/40">
                  {entry.dateShort}
                </span>
              </span>
            </button>
          );
        })}

        <div className="hidden group-hover:block border-t border-[var(--border)] my-1" />

        <button
          onClick={() => scrollTo("trabalho-verificado")}
          className="flex items-center gap-3 text-left transition-colors duration-150 py-1"
          title="Artefatos e Evidências"
        >
          <span
            className={`h-0.5 rounded-full transition-all duration-300 ${
              activeId === "trabalho-verificado"
                ? "w-7 h-[3px] bg-[var(--color-milet-amber)] shadow-[0_0_12px_rgba(204,136,0,0.6)]"
                : "w-3.5 bg-[var(--border-strong)] group-hover:w-5 group-hover:bg-[var(--foreground)]/40"
            }`}
          />
          <span className="hidden group-hover:inline-block text-xs font-medium text-[var(--foreground)]/70 hover:text-[var(--foreground)] whitespace-nowrap">
            Artefatos Verificados
          </span>
        </button>

        <button
          onClick={() => scrollTo("limites-versao")}
          className="flex items-center gap-3 text-left transition-colors duration-150 py-1"
          title="Limites da Versão"
        >
          <span
            className={`h-0.5 rounded-full transition-all duration-300 ${
              activeId === "limites-versao"
                ? "w-7 h-[3px] bg-[var(--color-milet-amber)] shadow-[0_0_12px_rgba(204,136,0,0.6)]"
                : "w-3.5 bg-[var(--border-strong)] group-hover:w-5 group-hover:bg-[var(--foreground)]/40"
            }`}
          />
          <span className="hidden group-hover:inline-block text-xs font-medium text-[var(--foreground)]/70 hover:text-[var(--foreground)] whitespace-nowrap">
            Limites da Versão
          </span>
        </button>
      </aside>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Section */}
        <header className="mb-14 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--color-milet-amber)]/10 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] border border-[var(--color-milet-amber)]/20 mb-4">
            <Sparkle weight="fill" className="w-3.5 h-3.5 text-[var(--color-milet-amber)]" />
            <span>Changelog Verificável</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[var(--foreground)] mb-4 leading-tight">
            Entradas públicas com o estado real.
          </h1>

          <p className="text-base sm:text-lg text-[var(--foreground)]/70 max-w-2xl leading-relaxed mb-6">
            Registro baseado em código, testes e deploys observáveis. Cada entrada separa a presença pública da operação de backend em validação.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white milet-amber-gradient shadow-sm hover:opacity-95 transition-all duration-200 active:scale-95"
            >
              <span>Entrar no diagnóstico de energia</span>
              <ArrowRight weight="bold" className="w-4 h-4" />
            </Link>

            <a
              href="/roadmap.html"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] hover:border-[var(--color-milet-amber)]/40 transition-colors"
            >
              Ver prioridades públicas
            </a>
          </div>
        </header>

        {/* Timeline dos Cards */}
        <section aria-labelledby="changelog-entries" className="relative pl-6 sm:pl-10 space-y-10 sm:space-y-12">
          {/* Linha guia vertical da timeline */}
          <div className="absolute left-2.5 sm:left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[var(--color-milet-amber)] via-[var(--border)] to-transparent rounded-full" />

          {ENTRIES.map((entry) => (
            <article
              key={entry.id}
              id={entry.id}
              className="group relative bg-[var(--card)] border border-[var(--border)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-[var(--color-milet-amber)]/40 transition-all duration-300 scroll-mt-24"
            >
              {/* Nó luminoso da timeline */}
              <div className="absolute -left-[27px] sm:-left-[35px] top-8 w-3.5 h-3.5 rounded-full bg-[var(--background)] border-2 border-[var(--color-milet-amber)] group-hover:scale-125 group-hover:shadow-[0_0_10px_rgba(204,136,0,0.8)] transition-all duration-200" />

              {/* Cabeçalho do Card */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4 mb-5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      entry.statusType === "infra"
                        ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20"
                        : entry.statusType === "code"
                        ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span>{entry.status}</span>
                  </span>

                  <span className="font-mono text-xs font-medium px-2 py-0.5 rounded bg-[var(--background)] text-[var(--foreground)]/60 border border-[var(--border)]">
                    {entry.category} · {entry.tag}
                  </span>
                </div>

                <time className="font-mono text-xs text-[var(--foreground)]/60">
                  {entry.date}
                </time>
              </div>

              {/* Título Serifado de Autoridade */}
              <h2 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-[var(--foreground)] mb-4 leading-snug">
                {entry.title}
              </h2>

              {/* Bloco Problema Tratado */}
              <div className="p-4 rounded-xl bg-[var(--color-milet-amber)]/5 border-l-2 border-[var(--color-milet-amber)] text-sm leading-relaxed mb-5">
                <strong className="text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-semibold">
                  Problema tratado:{" "}
                </strong>
                <span className="text-[var(--foreground)]/85">{entry.problem}</span>
              </div>

              {/* Lista de Mudanças */}
              <ul className="space-y-2 mb-5">
                {entry.deliveries.map((delivery, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]/75 leading-relaxed">
                    <span className="text-[var(--color-milet-amber)] font-bold select-none mt-0.5">→</span>
                    <span>{delivery}</span>
                  </li>
                ))}
              </ul>

              {/* Box de Evidência Verificável */}
              <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)]/80 mb-3 flex items-start gap-2.5">
                <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--foreground)] font-semibold">Evidência verificável: </strong>
                  <span>{entry.evidence}</span>
                </div>
              </div>

              {/* Box de Transparência e Limites */}
              <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)]/80 mb-5 flex items-start gap-2.5">
                <WarningCircle weight="fill" className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--foreground)] font-semibold">Transparência & Limites: </strong>
                  <span>{entry.limit}</span>
                </div>
              </div>

              {/* Botão de Ação */}
              {entry.ctaText && entry.ctaHref && (
                <div className="pt-2">
                  <Link
                    href={entry.ctaHref}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[var(--foreground)] bg-[var(--background)] border border-[var(--border)] hover:border-[var(--color-milet-amber)] hover:text-[var(--color-milet-amber)] transition-colors group/btn"
                  >
                    <span>{entry.ctaText}</span>
                    <ArrowRight weight="bold" className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              )}
            </article>
          ))}
        </section>

        {/* Seção Artefatos Verificados */}
        <section id="trabalho-verificado" className="mt-16 sm:mt-20 scroll-mt-24">
          <div className="border-b border-[var(--border)] pb-4 mb-6">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-milet-amber)] font-bold">
              Evidências
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight mt-1">
              Artefatos e verificações de referência
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="flex items-center gap-2 font-semibold text-sm mb-2 text-[var(--foreground)]">
                <Code className="w-4 h-4 text-[var(--color-milet-amber)]" />
                <span>Contratos e Schemas Formais</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--foreground)]/70 mb-3">
                Especificação OpenAPI v1 e schemas JSON com validação estrita via Ajv para propostas de energia.
              </p>
              <Link href="/openapi/v1/openapi.json" className="text-xs font-semibold text-[var(--color-milet-amber)] hover:underline inline-flex items-center gap-1">
                Ver especificação OpenAPI →
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="flex items-center gap-2 font-semibold text-sm mb-2 text-[var(--foreground)]">
                <Database className="w-4 h-4 text-[var(--color-milet-amber)]" />
                <span>PostgreSQL com RLS</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--foreground)]/70 mb-3">
                Isolamento estrito multi-tenant com Row-Level Security e auditoria append-only validada por testes.
              </p>
              <span className="text-xs font-mono text-[var(--foreground)]/50">
                infra/migrations · 28 testes de integração
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="flex items-center gap-2 font-semibold text-sm mb-2 text-[var(--foreground)]">
                <LockKey className="w-4 h-4 text-[var(--color-milet-amber)]" />
                <span>Bucket S3 e Segredos no Servidor</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--foreground)]/70 mb-3">
                Quarentena criptografada para PDFs de faturas na Railway com credenciais protegidas em runtime Vercel.
              </p>
              <span className="text-xs font-mono text-[var(--foreground)]/50">
                milet-invoices (iad) · Stage 6
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="flex items-center gap-2 font-semibold text-sm mb-2 text-[var(--foreground)]">
                <Globe className="w-4 h-4 text-[var(--color-milet-amber)]" />
                <span>Diagnóstico PME em Tempo Real</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--foreground)]/70 mb-3">
                Motor de cálculo de migração livre para Grupo A sem simulação fictícia ou taxas ocultas.
              </p>
              <Link href="/diagnostico" className="text-xs font-semibold text-[var(--color-milet-amber)] hover:underline inline-flex items-center gap-1">
                Iniciar diagnóstico →
              </Link>
            </div>
          </div>
        </section>

        {/* Seção Limites da Versão */}
        <section id="limites-versao" className="mt-16 sm:mt-20 scroll-mt-24">
          <div className="border-b border-[var(--border)] pb-4 mb-6">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-milet-amber)] font-bold">
              Transparência Radical
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight mt-1">
              O que esta versão NÃO faz
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h3 className="font-serif text-base font-semibold mb-2 text-[var(--foreground)]">
                Mercado e Operação
              </h3>
              <ul className="text-xs sm:text-sm text-[var(--foreground)]/70 space-y-1.5 list-disc pl-4">
                <li>Não há clientes ou tração comercial declarados.</li>
                <li>Não há contratos ou pagamentos transacionados.</li>
                <li>Migração física exige processo formal na CCEE e concessionária.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h3 className="font-serif text-base font-semibold mb-2 text-[var(--foreground)]">
                Autenticação e Nuvem
              </h3>
              <ul className="text-xs sm:text-sm text-[var(--foreground)]/70 space-y-1.5 list-disc pl-4">
                <li>Headers de tenant não substituem OIDC real em produção.</li>
                <li>RLS foi testado localmente e em esteira de CI.</li>
                <li>Dados sintéticos são explicitamente identificados.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h3 className="font-serif text-base font-semibold mb-2 text-[var(--foreground)]">
                Modelo Econômico
              </h3>
              <ul className="text-xs sm:text-sm text-[var(--foreground)]/70 space-y-1.5 list-disc pl-4">
                <li>Zero spread oculto nas estimativas tarifárias.</li>
                <li>Taxas e premissas são hipóteses para validação assistida.</li>
                <li>Posição em ranking de geradoras jamais será vendida.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
