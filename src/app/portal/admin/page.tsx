"use client";

import { useState } from "react";
import { CheckCircle, Gear, ShieldCheck } from "@phosphor-icons/react";
import { computeAuditHash } from "@/lib/portal-auth";

interface AuditRecord {
  id: string;
  tenantId: string;
  action: string;
  resource: string;
  payload: string;
  recordedAt: string;
}

const AUDIT_EVENTS: readonly AuditRecord[] = [
  {
    id: "AUD-104",
    tenantId: "t-consumidor-1",
    action: "CASE_ANALYZED",
    resource: "energy_cases/case-padaria-0001",
    payload: "Cemig|A4|12480kWh|baseline=10920",
    recordedAt: "2026-11-22 10:14:00"
  },
  {
    id: "AUD-105",
    tenantId: "t-comercializadora-1",
    action: "PROPOSAL_SUBMITTED",
    resource: "energy_proposals/off-acl-alvorada",
    payload: "ACL_VAREJISTA|allIn=9720|miletFee=190",
    recordedAt: "2026-11-22 10:21:12"
  },
  {
    id: "AUD-106",
    tenantId: "t-usina-1",
    action: "ASSET_QUOTA_RESERVED",
    resource: "generation_assets/asset-ufv-cerrado",
    payload: "SE/CO|Cemig|availableKwh=50000",
    recordedAt: "2026-11-22 10:36:40"
  }
];

const TENANT_DIRECTORY = [
  { tenantId: "t-consumidor-1", name: "Padaria Horizonte Ltda", role: "CONSUMIDOR", submarket: "SE/CO", rls: "portal_cases_isolation" },
  { tenantId: "t-comercializadora-1", name: "Alvorada Energia Varejista", role: "COMERCIALIZADORA", submarket: "SE/CO", rls: "portal_proposals_isolation" },
  { tenantId: "t-usina-1", name: "Consórcio Solar Cerrado", role: "USINA", submarket: "SE/CO", rls: "portal_assets_isolation" },
  { tenantId: "t-admin-milet", name: "Milet Governança", role: "ADMIN", submarket: "BR", rls: "portal_audit_trail_isolation" }
];

export default function AdminPortalPage() {
  const [verifiedHashes, setVerifiedHashes] = useState<Record<string, string>>({});

  const verifyEvent = async (event: AuditRecord) => {
    const hash = await computeAuditHash(
      `${event.id}|${event.tenantId}|${event.action}|${event.resource}|${event.payload}`
    );
    setVerifiedHashes((prev) => ({ ...prev, [event.id]: hash }));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
          <Gear weight="duotone" className="w-4 h-4" />
          <span>Console Administrativo · Milet Engine</span>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Governança Multi-Tenant e Auditoria Criptográfica
        </h1>
        <p className="text-sm text-[var(--foreground)]/70">
          Visão consolidada de isolamento PostgreSQL Row-Level Security (`007_portals_schema.sql`) e trilha append-only imutável.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <div className="text-xs text-[var(--foreground)]/60">Tenants Ativos</div>
          <div className="text-2xl font-bold font-mono">4</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <div className="text-xs text-[var(--foreground)]/60">Políticas RLS Ativas</div>
          <div className="text-2xl font-bold font-mono text-emerald-600">5 tabelas</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <div className="text-xs text-[var(--foreground)]/60">Receita Transparente Milet</div>
          <div className="text-2xl font-bold font-mono">R$ 190/mês</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <div className="text-xs text-[var(--foreground)]/60">Audit Trail Trigger</div>
          <div className="text-sm font-bold font-mono pt-1 text-emerald-600">Append-Only</div>
        </div>
      </div>

      <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
        <h2 className="font-serif text-xl font-bold">Diretório Multi-Tenant e Políticas RLS</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--foreground)]/60">
                <th className="py-2 pr-4">Tenant ID</th>
                <th className="py-2 pr-4">Organização</th>
                <th className="py-2 pr-4">Papel RBAC</th>
                <th className="py-2 pr-4">Submercado</th>
                <th className="py-2">Política PostgreSQL</th>
              </tr>
            </thead>
            <tbody>
              {TENANT_DIRECTORY.map((tenant) => (
                <tr key={tenant.tenantId} className="border-b border-[var(--border)]/60">
                  <td className="py-2.5 pr-4 font-mono">{tenant.tenantId}</td>
                  <td className="py-2.5 pr-4 font-medium">{tenant.name}</td>
                  <td className="py-2.5 pr-4 font-mono">{tenant.role}</td>
                  <td className="py-2.5 pr-4 font-mono">{tenant.submarket}</td>
                  <td className="py-2.5 font-mono text-emerald-600">{tenant.rls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck weight="fill" className="w-5 h-5 text-emerald-500" />
          <h2 className="font-serif text-xl font-bold">Trilha de Auditoria Imutável (SHA-256)</h2>
        </div>

        <div className="space-y-3">
          {AUDIT_EVENTS.map((event) => {
            const hash = verifiedHashes[event.id];
            return (
              <div
                key={event.id}
                className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">{event.id}</span>
                    <span className="font-mono px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">
                      {event.action}
                    </span>
                    <span className="text-[var(--foreground)]/65">{event.resource}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void verifyEvent(event)}
                    className="px-3 py-1 rounded-lg font-semibold bg-[var(--card)] border border-[var(--border-strong)] hover:border-[var(--color-milet-amber)] cursor-pointer"
                  >
                    Calcular Hash SHA-256
                  </button>
                </div>
                <div className="font-mono text-[11px] text-[var(--foreground)]/65">
                  Tenant: {event.tenantId} · Payload: {event.payload} · {event.recordedAt}
                </div>
                {hash ? (
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-600">
                    <CheckCircle weight="fill" className="w-3.5 h-3.5 shrink-0" />
                    <span className="break-all">SHA-256: {hash}</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
