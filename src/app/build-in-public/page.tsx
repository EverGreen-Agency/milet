import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  CHANGELOG,
  VERIFIED_ARTIFACTS,
  VERSION_LIMITS,
  VALIDATION_QUESTION,
} from "@/content/changelog";
import { StatusChip, RichText, SectionHeading } from "@/components/public/primitives";
import { SectionRail, type RailItem } from "@/components/public/section-rail";
import { ActionLink } from "@/components/public/action-link";

export const metadata: Metadata = {
  title: "Build in Public · Milet | Changelog Verificável e Evidências",
  description:
    "Registro público do desenvolvimento da Milet: entregas reais, problemas tratados, evidências observáveis e limites explícitos de cada versão.",
};

const RAIL_ITEMS: RailItem[] = [
  { id: "hero", label: "Início" },
  ...CHANGELOG.map((e) => ({
    id: e.id,
    label: e.railLabel,
    meta: e.dateShort,
  })),
  { id: "artefatos", label: "Artefatos" },
  { id: "limites", label: "Limites" },
  { id: "pergunta-pme", label: "Validação PME" },
];

export default function BuildInPublicPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <SectionRail title="Timeline" items={RAIL_ITEMS} />

      <main id="conteudo" className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Section */}
        <header id="hero" className="mb-14 scroll-mt-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--color-milet-amber)]/10 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] border border-[var(--color-milet-amber)]/20 mb-4">
            <span>Build in public · fatos, limites e perguntas</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[var(--foreground)] mb-4 leading-tight">
            Construir à vista, sem pular a <em>prova.</em>
          </h1>

          <p className="text-base sm:text-lg text-[var(--foreground)]/70 max-w-2xl leading-relaxed mb-6">
            Aqui registramos o que mudou, o que funciona e onde a experiência ainda é somente plano ou protótipo. A transparência inclui dizer “ainda não”.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <ActionLink href="/diagnostico" label="Entrar no diagnóstico de energia" variant="primary" />
            <ActionLink href="/roadmap" label="Ver prioridades no roadmap" variant="secondary" />
          </div>
        </header>

        {/* Linha do tempo dos registros */}
        <section aria-labelledby="changelog-entries" className="relative pl-6 sm:pl-10 space-y-10 sm:space-y-12 mb-20">
          {/* Linha guia vertical contínua da timeline */}
          <div className="absolute left-2.5 sm:left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[var(--color-milet-amber)] via-[var(--border)] to-transparent rounded-full" />

          {CHANGELOG.map((entry) => (
            <article
              key={entry.id}
              id={entry.id}
              className="group relative bg-[var(--card)] border border-[var(--border)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-[var(--color-milet-amber)]/40 transition-all duration-300 scroll-mt-24"
            >
              {/* Nó luminoso na timeline */}
              <div className="absolute -left-[27px] sm:-left-[35px] top-8 w-3.5 h-3.5 rounded-full bg-[var(--background)] border-2 border-[var(--color-milet-amber)] group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(204,136,0,0.8)] transition-all duration-200" />

              {/* Cabeçalho do Card */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4 mb-5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <StatusChip label={entry.status.label} tone={entry.status.tone} />
                  <span className="font-mono text-xs font-medium px-2 py-0.5 rounded bg-[var(--background)] text-[var(--foreground)]/60 border border-[var(--border)]">
                    {entry.area} · #{entry.number}
                  </span>
                </div>

                <time dateTime={entry.date} className="font-mono text-xs text-[var(--foreground)]/60">
                  {entry.dateLabel}
                </time>
              </div>

              {/* Título Serifado */}
              <h2 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-[var(--foreground)] mb-4 leading-snug">
                {entry.title}
              </h2>

              {/* Problema Tratado */}
              <div className="p-4 rounded-xl bg-[var(--color-milet-amber)]/5 border-l-2 border-[var(--color-milet-amber)] text-sm leading-relaxed mb-5">
                <strong className="text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-semibold">
                  Problema tratado:{" "}
                </strong>
                <span className="text-[var(--foreground)]/85">
                  <RichText text={entry.problem} />
                </span>
              </div>

              {/* O que mudou */}
              <ul className="space-y-2 mb-5">
                {entry.deliveries.map((delivery, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]/75 leading-relaxed">
                    <span className="text-[var(--color-milet-amber)] font-bold select-none mt-0.5">→</span>
                    <span>
                      <RichText text={delivery} />
                    </span>
                  </li>
                ))}
              </ul>

              {/* Evidência observável */}
              <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)]/80 mb-3">
                <strong className="text-[var(--foreground)] font-semibold">Evidência verificável: </strong>
                <span>
                  <RichText text={entry.evidence} />
                </span>
              </div>

              {/* Limite explícito */}
              <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)]/80 mb-5">
                <strong className="text-[var(--foreground)] font-semibold">Transparência & Limites: </strong>
                <span>
                  <RichText text={entry.limit} />
                </span>
              </div>

              {/* Ações */}
              {entry.links && entry.links.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {entry.links.map((link, lIdx) => (
                    <ActionLink
                      key={lIdx}
                      href={link.href}
                      label={link.label}
                      external={link.external}
                      variant="chip"
                    />
                  ))}
                </div>
              )}
            </article>
          ))}
        </section>

        {/* Artefatos Existentes */}
        <section id="artefatos" className="mb-20 scroll-mt-24">
          <SectionHeading
            id="heading-artefatos"
            kicker="Antes desta atualização"
            title="Artefatos existentes que podemos demonstrar."
            description="Documentação, especificações acadêmicas e protótipos que serviram de fundação para o projeto."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VERIFIED_ARTIFACTS.map((artifact, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex flex-col justify-between"
              >
                <div>
                  <div className="mb-2">
                    <StatusChip label={artifact.status.label} tone={artifact.status.tone} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">{artifact.title}</h3>
                  <p className="text-xs sm:text-sm text-[var(--foreground)]/70 mb-4 leading-relaxed">
                    <RichText text={artifact.description} />
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]">
                  {artifact.links.map((link, lIdx) => (
                    <ActionLink
                      key={lIdx}
                      href={link.href}
                      label={link.label}
                      external={link.external}
                      variant="chip"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Limites da Versão */}
        <section id="limites" className="mb-20 scroll-mt-24">
          <SectionHeading
            id="heading-limites"
            kicker="Limites da Versão"
            title="O que esta entrega não comprova."
            description="Transparência radical: separar claramente o que funciona do que ainda é hipótese ou teste assistido."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VERSION_LIMITS.map((limitGroup, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                <h3 className="font-serif text-base font-semibold mb-3">{limitGroup.title}</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[var(--foreground)]/70">
                  {limitGroup.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2">
                      <span className="text-[var(--color-milet-amber)] font-bold">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Pergunta de Validação PME */}
        <section id="pergunta-pme" className="mb-14 scroll-mt-24">
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border-2 border-[var(--color-milet-amber)]/30 shadow-md">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] block mb-2">
              {VALIDATION_QUESTION.kicker}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold mb-3 leading-snug">
              {VALIDATION_QUESTION.question}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--foreground)]/70 leading-relaxed mb-6">
              {VALIDATION_QUESTION.context}
            </p>

            <div className="flex flex-wrap gap-3">
              <ActionLink href="/diagnostico" label="Testar diagnóstico de energia" variant="primary" />
              <ActionLink href="/roadmap" label="Acompanhar roadmap" variant="secondary" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
