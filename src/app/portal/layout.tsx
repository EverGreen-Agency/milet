"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignOut, ShieldCheck, ArrowUpRight } from "@phosphor-icons/react";
import type { PortalSession } from "@milet/contracts";

export default function PortalLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, setSession] = useState<PortalSession | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    fetch("/api/portal/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.session) {
          setSession(data.session as PortalSession);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/portal/session", { method: "DELETE" });
    window.location.assign("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-40 milet-glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-serif font-bold text-lg">
              <img
                src="/assets/logo/png/transparent/milet-symbol-amber.png"
                alt="Milet"
                className="w-6 h-6 object-contain"
              />
              <span>Milet</span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--color-milet-amber)]/10 border border-[var(--color-milet-amber)]/30 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-semibold">
              <ShieldCheck weight="fill" className="w-3.5 h-3.5" />
              <span>{session ? `${session.role} · ${session.tenantId}` : "Sessão Verificada"}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <span className="hidden md:inline text-xs text-[var(--foreground)]/70">
                {session.displayName}
              </span>
            ) : null}
            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--card)] border border-[var(--border)] hover:border-[var(--color-milet-amber)]/50 transition-colors"
            >
              <span>Diagnóstico</span>
              <ArrowUpRight weight="bold" className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--foreground)]/75 hover:text-[var(--foreground)] border border-transparent hover:border-[var(--border)] transition-colors"
            >
              Trocar perfil
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500/15 transition-colors cursor-pointer"
            >
              <SignOut weight="bold" className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
