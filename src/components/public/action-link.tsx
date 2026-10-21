"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";

export function ActionLink({
  href,
  label,
  external,
  variant = "chip",
}: {
  href: string;
  label: string;
  external?: boolean;
  variant?: "chip" | "primary" | "secondary";
}) {
  const base =
    "group/action inline-flex items-center gap-1.5 rounded-xl font-semibold outline-none transition-[color,border-color,background-color,transform] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-[var(--color-milet-amber)] active:scale-[0.97]";
  const variants = {
    chip: "border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-xs sm:text-sm hover:border-[var(--color-milet-amber)] hover:text-[var(--color-milet-amber-dark)] dark:hover:text-[var(--color-milet-amber-light)]",
    primary: "milet-amber-gradient px-5 py-2.5 text-sm text-white shadow-sm hover:opacity-95",
    secondary:
      "border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm hover:border-[var(--color-milet-amber)]/50",
  };
  const className = `${base} ${variants[variant]}`;
  const icon = external ? (
    <ArrowUpRight weight="bold" aria-hidden="true" className="h-3.5 w-3.5" />
  ) : (
    <ArrowRight
      weight="bold"
      aria-hidden="true"
      className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover/action:translate-x-0.5"
    />
  );

  // Arquivos estáticos e domínios externos não passam pelo roteador do Next.
  if (external) {
    const isOtherOrigin = href.startsWith("http");
    return (
      <a
        href={href}
        className={className}
        {...(isOtherOrigin ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {label}
        {icon}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
      {icon}
    </Link>
  );
}
