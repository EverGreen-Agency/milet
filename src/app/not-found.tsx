import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Compass, House, Sparkle, ArrowRight, MapTrifold, Article } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Badge & Icon */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-20 h-20 rounded-3xl bg-[var(--color-milet-amber)]/10 border border-[var(--color-milet-amber)]/25 flex items-center justify-center shadow-lg shadow-[var(--color-milet-amber)]/5 transition-transform hover:scale-105 duration-300">
              <Compass weight="duotone" className="w-10 h-10 text-[var(--color-milet-amber)] animate-pulse" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[var(--color-milet-amber)]/10 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] border border-[var(--color-milet-amber)]/20">
              Erro 404 • Circuito Não Localizado
            </span>
          </div>

          {/* Heading & Subheading */}
          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)]">
              Esta página saiu da rede.
            </h1>
            <p className="text-sm sm:text-base text-[var(--foreground)]/70 max-w-lg mx-auto leading-relaxed">
              O endereço solicitado foi remanejado, teve a chave seccionadora desligada ou nunca existiu em nosso catálogo de rotas.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/diagnostico"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white milet-amber-gradient shadow-md shadow-[var(--color-milet-amber)]/20 hover:opacity-95 transition-all duration-200 active:scale-95"
            >
              <Sparkle weight="fill" className="w-4 h-4" />
              <span>Simular Diagnóstico de Energia</span>
              <ArrowRight weight="bold" className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[var(--foreground)] border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] transition-all duration-200"
            >
              <House weight="duotone" className="w-4 h-4 text-[var(--color-milet-amber)]" />
              <span>Voltar ao Início</span>
            </Link>
          </div>

          {/* Useful Quick Links */}
          <div className="pt-8 border-t border-[var(--border)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/50 mb-4">
              Rotas frequentes em operação
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <Link
                href="/diagnostico"
                className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--color-milet-amber)]/40 hover:bg-[var(--card-hover)] transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--color-milet-amber)]">
                  <Sparkle weight="fill" className="w-3.5 h-3.5 text-[var(--color-milet-amber)]" />
                  <span>Diagnóstico</span>
                </div>
                <p className="text-[11px] text-[var(--foreground)]/60 mt-1">
                  Leitura de faturas e comparativo de mercado livre.
                </p>
              </Link>

              <Link
                href="/roadmap"
                className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--color-milet-amber)]/40 hover:bg-[var(--card-hover)] transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--color-milet-amber)]">
                  <MapTrifold weight="duotone" className="w-3.5 h-3.5 text-[var(--color-milet-amber)]" />
                  <span>Roadmap Aberto</span>
                </div>
                <p className="text-[11px] text-[var(--foreground)]/60 mt-1">
                  Evolução das entregas, sprints e horizontes da Milet.
                </p>
              </Link>

              <Link
                href="/build-in-public"
                className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--color-milet-amber)]/40 hover:bg-[var(--card-hover)] transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--color-milet-amber)]">
                  <Article weight="duotone" className="w-3.5 h-3.5 text-[var(--color-milet-amber)]" />
                  <span>Build in Public</span>
                </div>
                <p className="text-[11px] text-[var(--foreground)]/60 mt-1">
                  Decisões de engenharia, métricas e changelog público.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
