"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  ClipboardText,
  Clock,
  Factory,
  Gear,
  Lightning,
  Lock,
  LockOpen,
  ShieldCheck,
  SunHorizon,
  UserCheck,
  UserPlus,
  UsersThree,
  Warning
} from "@phosphor-icons/react";
import { PORTAL_ROLES, type UserRole } from "@milet/contracts";
import { formatCurrencyBRL } from "@/domain/energy-engine";
import { computeAuditHash } from "@/lib/portal-auth";

type AdminTab = "concierge" | "usuarios" | "viabilidade" | "seguranca";

type CaseStage =
  | "Triagem"
  | "OCR Validado"
  | "Em Cotação (RFQ)"
  | "Carta de Denúncia"
  | "Ativo / Autopilot";

const CASE_STAGES: readonly CaseStage[] = [
  "Triagem",
  "OCR Validado",
  "Em Cotação (RFQ)",
  "Carta de Denúncia",
  "Ativo / Autopilot"
];

interface ConciergeCase {
  id: string;
  tenantId: string;
  companyName: string;
  distributor: string;
  voltageGroup: string;
  consumptionKwh: number;
  stage: CaseStage;
  miletFeeBrl: number;
  owner: string;
  slaLabel: string;
  consentShared: boolean;
  pendingAction: string;
  hasBlocker: boolean;
}

type UserStatus = "Ativo" | "Pendente KYC" | "Suspenso";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  status: UserStatus;
  lastAccess: string;
}

interface PartnerSupplyRow {
  id: string;
  partnerName: string;
  distributor: string;
  submarket: string;
  modality: "1:1 Autoconsumo Remoto" | "1:N Geração Compartilhada" | "ACL Varejista";
  availableKwhMonth: number;
  pipelineDemandKwh: number;
  homologated: boolean;
}

interface AuditRecord {
  id: string;
  tenantId: string;
  action: string;
  resource: string;
  payload: string;
  recordedAt: string;
}

const INITIAL_CASES: readonly ConciergeCase[] = [
  {
    id: "case-padaria-0001",
    tenantId: "t-consumidor-1",
    companyName: "Padaria Horizonte Ltda",
    distributor: "Cemig",
    voltageGroup: "A4",
    consumptionKwh: 12480,
    stage: "Em Cotação (RFQ)",
    miletFeeBrl: 190,
    owner: "Eduardo M.",
    slaLabel: "Hoje 18:00",
    consentShared: true,
    pendingAction: "Consolidar aceite entre Alvorada ACL e Consórcio Cerrado",
    hasBlocker: false
  },
  {
    id: "case-metal-0042",
    tenantId: "t-consumidor-2",
    companyName: "Metalúrgica Modelo S.A.",
    distributor: "CPFL Paulista",
    voltageGroup: "A4",
    consumptionKwh: 42500,
    stage: "OCR Validado",
    miletFeeBrl: 430,
    owner: "Backoffice SP",
    slaLabel: "Vence em 24h",
    consentShared: false,
    pendingAction: "Coletar procuração CCEE e aceite LGPD para abrir RFQ",
    hasBlocker: true
  },
  {
    id: "case-clinica-0019",
    tenantId: "t-consumidor-3",
    companyName: "Clínica Vida Plena",
    distributor: "Enel SP",
    voltageGroup: "B3",
    consumptionKwh: 2850,
    stage: "Carta de Denúncia",
    miletFeeBrl: 120,
    owner: "Eduardo M.",
    slaLabel: "Em análise",
    consentShared: true,
    pendingAction: "Acompanhar protocolo de adesão GD junto à distribuidora",
    hasBlocker: false
  }
];

const INITIAL_USERS: readonly ManagedUser[] = [
  {
    id: "usr-01",
    name: "Paula Mendes",
    email: "consumidor@padariahorizonte.com.br",
    organization: "Padaria Horizonte Ltda (t-consumidor-1)",
    role: "CONSUMIDOR",
    status: "Ativo",
    lastAccess: "Hoje, 10:14"
  },
  {
    id: "usr-02",
    name: "Marcos Teixeira",
    email: "mesa@alvoradaenergia.com.br",
    organization: "Alvorada Energia Varejista (t-comercializadora-1)",
    role: "COMERCIALIZADORA",
    status: "Ativo",
    lastAccess: "Hoje, 10:21"
  },
  {
    id: "usr-03",
    name: "Carlos Nogueira",
    email: "gestao@solarcerrado.com.br",
    organization: "Consórcio Solar Cerrado (t-usina-1)",
    role: "USINA",
    status: "Pendente KYC",
    lastAccess: "Aguardando 1º acesso"
  },
  {
    id: "usr-04",
    name: "Guilherme Costa",
    email: "contato@dacolialimentos.com.br",
    organization: "Dacoli Alimentos (t-consumidor-4)",
    role: "CONSUMIDOR",
    status: "Ativo",
    lastAccess: "Ontem, 17:40"
  },
  {
    id: "usr-05",
    name: "Eduardo Mattos",
    email: "admin@milet.com.br",
    organization: "Milet Governança (t-admin-milet)",
    role: "ADMIN",
    status: "Ativo",
    lastAccess: "Online agora"
  }
];

const INITIAL_SUPPLY: readonly PartnerSupplyRow[] = [
  {
    id: "sup-1",
    partnerName: "Alvorada Energia Varejista",
    distributor: "Cemig / CPFL",
    submarket: "SE/CO",
    modality: "ACL Varejista",
    availableKwhMonth: 180000,
    pipelineDemandKwh: 54980,
    homologated: true
  },
  {
    id: "sup-2",
    partnerName: "Consórcio Solar Cerrado I",
    distributor: "Cemig",
    submarket: "SE/CO",
    modality: "1:N Geração Compartilhada",
    availableKwhMonth: 50000,
    pipelineDemandKwh: 12480,
    homologated: true
  },
  {
    id: "sup-3",
    partnerName: "UFV Bandeirantes II (Arrendamento)",
    distributor: "CPFL Paulista",
    submarket: "SE/CO",
    modality: "1:1 Autoconsumo Remoto",
    availableKwhMonth: 62000,
    pipelineDemandKwh: 42500,
    homologated: false
  },
  {
    id: "sup-4",
    partnerName: "CGC Energia Solar Compartilhada",
    distributor: "Enel SP / CPFL",
    submarket: "SE/CO",
    modality: "1:N Geração Compartilhada",
    availableKwhMonth: 95000,
    pipelineDemandKwh: 2850,
    homologated: true
  }
];

const INITIAL_AUDIT_EVENTS: readonly AuditRecord[] = [
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

function getStatusBadgeClass(status: UserStatus): string {
  if (status === "Ativo") {
    return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25";
  }
  if (status === "Pendente KYC") {
    return "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30";
  }
  return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25";
}

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("concierge");
  const [cases, setCases] = useState<ConciergeCase[]>([...INITIAL_CASES]);
  const [stageFilter, setStageFilter] = useState<CaseStage | "Todos">("Todos");
  const [users, setUsers] = useState<ManagedUser[]>([...INITIAL_USERS]);
  const [roleFilter, setRoleFilter] = useState<UserRole | "Todos">("Todos");
  const [supplyRows, setSupplyRows] = useState<PartnerSupplyRow[]>([...INITIAL_SUPPLY]);
  const [auditEvents, setAuditEvents] = useState<AuditRecord[]>([...INITIAL_AUDIT_EVENTS]);
  const [verifiedHashes, setVerifiedHashes] = useState<Record<string, string>>({});
  const [opFeedback, setOpFeedback] = useState<string | null>(null);

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteOrg, setInviteOrg] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("CONSUMIDOR");
  const [inviteNotice, setInviteNotice] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const metrics = useMemo(() => {
    const totalKwh = cases.reduce((acc, item) => acc + item.consumptionKwh, 0);
    const totalFee = cases.reduce((acc, item) => acc + item.miletFeeBrl, 0);
    const blockers = cases.filter((item) => item.hasBlocker).length;
    const activeUsers = users.filter((u) => u.status === "Ativo").length;
    const pendingUsers = users.filter((u) => u.status === "Pendente KYC").length;
    return { totalKwh, totalFee, blockers, activeUsers, pendingUsers };
  }, [cases, users]);

  const filteredCases = useMemo(
    () => (stageFilter === "Todos" ? cases : cases.filter((c) => c.stage === stageFilter)),
    [cases, stageFilter]
  );

  const filteredUsers = useMemo(
    () => (roleFilter === "Todos" ? users : users.filter((u) => u.role === roleFilter)),
    [users, roleFilter]
  );

  const appendAudit = (tenantId: string, action: string, resource: string, payload: string) => {
    const nextNum = 104 + auditEvents.length;
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    setAuditEvents((prev) => [
      { id: `AUD-${nextNum}`, tenantId, action, resource, payload, recordedAt: now },
      ...prev
    ]);
  };

  const advanceCaseStage = (caseId: string) => {
    setCases((prev) =>
      prev.map((item) => {
        if (item.id !== caseId) return item;
        const idx = CASE_STAGES.indexOf(item.stage);
        const nextStage = CASE_STAGES[Math.min(CASE_STAGES.length - 1, idx + 1)]!;
        appendAudit(
          item.tenantId,
          "CASE_STAGE_ADVANCED",
          `energy_cases/${item.id}`,
          `${item.stage}->${nextStage}`
        );
        setOpFeedback(`Caso ${item.companyName} avançou para "${nextStage}".`);
        return {
          ...item,
          stage: nextStage,
          hasBlocker: nextStage === "OCR Validado" ? item.hasBlocker : false,
          slaLabel: nextStage === "Ativo / Autopilot" ? "Monitorado" : "Atualizado",
          pendingAction:
            nextStage === "Ativo / Autopilot"
              ? "Auditoria mensal de economia prevista vs. realizada"
              : "Acompanhar próxima etapa da comercializadora/distribuidora"
        };
      })
    );
  };

  const handleRoleChange = (userId: string, nextRole: UserRole) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;
        appendAudit("t-admin-milet", "RBAC_ROLE_UPDATED", `users/${user.id}`, `${user.role}->${nextRole}`);
        setInviteNotice(`Papel RBAC de ${user.name} alterado para ${nextRole}.`);
        return { ...user, role: nextRole };
      })
    );
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;
        const nextStatus: UserStatus =
          user.status === "Pendente KYC"
            ? "Ativo"
            : user.status === "Ativo"
              ? "Suspenso"
              : "Ativo";
        appendAudit("t-admin-milet", "USER_STATUS_CHANGED", `users/${user.id}`, `${user.status}->${nextStatus}`);
        setInviteNotice(`Status de acesso de ${user.name} atualizado para ${nextStatus}.`);
        return { ...user, status: nextStatus };
      })
    );
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteNotice(null);
    if (inviteName.trim().length < 2 || !inviteEmail.includes("@") || inviteOrg.trim().length < 2) {
      setInviteError("Preencha nome, e-mail corporativo válido e organização/tenant.");
      return;
    }
    const created: ManagedUser = {
      id: `usr-0${users.length + 1}`,
      name: inviteName.trim(),
      email: inviteEmail.trim().toLowerCase(),
      organization: inviteOrg.trim(),
      role: inviteRole,
      status: "Pendente KYC",
      lastAccess: "Convite enviado"
    };
    setUsers((prev) => [created, ...prev]);
    appendAudit("t-admin-milet", "USER_INVITED", `users/${created.id}`, `${created.email}|role=${created.role}`);
    setInviteNotice(`Convite emitido para ${created.name} (${created.role}) com KYC pendente.`);
    setInviteName("");
    setInviteEmail("");
    setInviteOrg("");
  };

  const handleHomologatePartner = (partnerId: string) => {
    setSupplyRows((prev) =>
      prev.map((row) => {
        if (row.id !== partnerId) return row;
        appendAudit("t-admin-milet", "PARTNER_HOMOLOGATED", `supply/${row.id}`, `${row.partnerName}|${row.modality}`);
        return { ...row, homologated: true };
      })
    );
  };

  const verifyEvent = async (event: AuditRecord) => {
    const hash = await computeAuditHash(
      `${event.id}|${event.tenantId}|${event.action}|${event.resource}|${event.payload}`
    );
    setVerifiedHashes((prev) => ({ ...prev, [event.id]: hash }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
            <Gear weight="duotone" className="w-4 h-4" />
            <span>Central de Operações · Backoffice Milet</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Operação Assistida, Usuários e Concierge
          </h1>
          <p className="text-sm text-[var(--foreground)]/70">
            Acompanhamento diário de migrações na distribuidora, controle de acesso RBAC, viabilidade 1:1 / 1:N e trilha auditável.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("usuarios")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white milet-amber-gradient shadow-sm hover:brightness-105 cursor-pointer transition-all"
        >
          <UserPlus weight="bold" className="w-4 h-4" />
          <span>Gerenciar Usuários &amp; Acessos</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
          <div className="text-xs text-[var(--foreground)]/60">Energia em Negociação</div>
          <div className="text-2xl font-bold font-mono">{metrics.totalKwh.toLocaleString("pt-BR")} kWh</div>
          <div className="text-[11px] text-[var(--foreground)]/60">Carga mensal sob análise no funil</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
          <div className="text-xs text-[var(--foreground)]/60">Casos no Funil Concierge</div>
          <div className="text-2xl font-bold font-mono">
            {cases.length} <span className="text-sm font-sans font-semibold text-amber-600">({metrics.blockers} pendência)</span>
          </div>
          <div className="text-[11px] text-[var(--foreground)]/60">Acompanhamento com SLA ativo</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
          <div className="text-xs text-[var(--foreground)]/60">Receita Transparente Milet</div>
          <div className="text-2xl font-bold font-mono text-emerald-600">{formatCurrencyBRL(metrics.totalFee)}/mês</div>
          <div className="text-[11px] text-[var(--foreground)]/60">Fee fixo explícito na régua All-In</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
          <div className="text-xs text-[var(--foreground)]/60">Usuários &amp; Acesso RBAC</div>
          <div className="text-2xl font-bold font-mono">
            {metrics.activeUsers} ativos{" "}
            <span className="text-sm font-sans font-semibold text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
              · {metrics.pendingUsers} KYC
            </span>
          </div>
          <div className="text-[11px] text-[var(--foreground)]/60">4 perfis isolados por cookie HttpOnly</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-3">
        {(
          [
            { id: "concierge", label: "Fila Concierge & Casos", icon: ClipboardText },
            { id: "usuarios", label: "Controle de Acesso & Usuários", icon: UsersThree },
            { id: "viabilidade", label: "Oferta & Viabilidade GD (1:1 / 1:N)", icon: SunHorizon },
            { id: "seguranca", label: "Segurança, RLS & Auditoria", icon: ShieldCheck }
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                isCurrent
                  ? "bg-[var(--foreground)] text-[var(--background)] shadow-sm"
                  : "bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]/75 hover:border-[var(--color-milet-amber)]/60"
              }`}
            >
              <Icon weight={isCurrent ? "fill" : "duotone"} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "concierge" ? (
        <div className="space-y-6">
          <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-bold">Fila de Operação Assistida (Concierge)</h2>
                <p className="text-xs text-[var(--foreground)]/70">
                  Fluxo assistido para protocolos em distribuidoras, procuração CCEE e liberação de RFQs.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(["Todos", ...CASE_STAGES] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStageFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
                      stageFilter === st
                        ? "bg-[var(--color-milet-amber)]/15 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] border border-[var(--color-milet-amber)]/40"
                        : "bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]/70"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {opFeedback ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                <CheckCircle weight="fill" className="w-4 h-4 shrink-0" />
                <span>{opFeedback}</span>
              </div>
            ) : null}

            <div className="space-y-3">
              {filteredCases.map((item) => {
                const isFinal = item.stage === "Ativo / Autopilot";
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm">{item.companyName}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--border)]">
                          {item.distributor} · {item.voltageGroup}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-milet-amber)]/15 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-semibold">
                          {item.stage}
                        </span>
                        {item.consentShared ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                            <LockOpen weight="fill" className="w-3 h-3" />
                            <span>LGPD OK</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                            <Lock weight="fill" className="w-3 h-3" />
                            <span>Mascarado</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--foreground)]/75 flex items-center gap-1.5">
                        {item.hasBlocker ? (
                          <Warning weight="fill" className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <Clock weight="duotone" className="w-3.5 h-3.5 text-[var(--foreground)]/60 shrink-0" />
                        )}
                        <span>{item.pendingAction}</span>
                      </div>
                      <div className="font-mono text-[11px] text-[var(--foreground)]/60">
                        {item.consumptionKwh.toLocaleString("pt-BR")} kWh/mês · Fee {formatCurrencyBRL(item.miletFeeBrl)}/mês · Resp.: {item.owner} · SLA: {item.slaLabel}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isFinal}
                      onClick={() => advanceCaseStage(item.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--card)] border border-[var(--border-strong)] hover:border-[var(--color-milet-amber)] disabled:opacity-50 cursor-pointer"
                    >
                      <span>{isFinal ? "Concluído" : "Avançar Etapa"}</span>
                      {!isFinal ? <ArrowRight weight="bold" className="w-3.5 h-3.5" /> : null}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold">Resumo de Acessos &amp; KYC</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("usuarios")}
                  className="text-xs font-semibold text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] hover:underline cursor-pointer"
                >
                  Abrir controle completo
                </button>
              </div>
              <div className="space-y-2 text-xs">
                {users.slice(0, 4).map((u) => (
                  <div
                    key={u.id}
                    className="p-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold">{u.name}</div>
                      <div className="font-mono text-[11px] text-[var(--foreground)]/60">{u.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">
                        {u.role}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(u.status)}`}>
                        {u.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold">Radar Oferta vs. Demanda (SE/CO)</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("viabilidade")}
                  className="text-xs font-semibold text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] hover:underline cursor-pointer"
                >
                  Ver lastro 1:1 / 1:N
                </button>
              </div>
              <div className="space-y-2 text-xs">
                {supplyRows.slice(0, 4).map((sup) => (
                  <div
                    key={sup.id}
                    className="p-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold">{sup.partnerName}</div>
                      <div className="text-[11px] text-[var(--foreground)]/60">
                        {sup.distributor} · {sup.modality}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-emerald-600">{sup.availableKwhMonth.toLocaleString("pt-BR")} kWh</div>
                      <div className="text-[10px] text-[var(--foreground)]/60">
                        {sup.homologated ? "Homologado" : "Pendente KYC"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "usuarios" ? (
        <div className="space-y-6">
          <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-bold">Controle de Acesso, Papéis RBAC e KYC</h2>
                <p className="text-xs text-[var(--foreground)]/70">
                  Altere papéis de acesso, aprove cadastros de usinas/comercializadoras e suspenda credenciais suspeitas.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(["Todos", ...PORTAL_ROLES] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoleFilter(r)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold cursor-pointer ${
                      roleFilter === r
                        ? "bg-[var(--color-milet-amber)]/15 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] border border-[var(--color-milet-amber)]/40"
                        : "bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]/70"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {inviteNotice ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                <CheckCircle weight="fill" className="w-4 h-4 shrink-0" />
                <span>{inviteNotice}</span>
              </div>
            ) : null}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--foreground)]/60">
                    <th className="py-2 pr-4">Usuário</th>
                    <th className="py-2 pr-4">Organização / Tenant</th>
                    <th className="py-2 pr-4">Papel RBAC</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Último Acesso</th>
                    <th className="py-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[var(--border)]/60">
                      <td className="py-3 pr-4">
                        <div className="font-semibold">{user.name}</div>
                        <div className="font-mono text-[11px] text-[var(--foreground)]/60">{user.email}</div>
                      </td>
                      <td className="py-3 pr-4 text-[var(--foreground)]/80">{user.organization}</td>
                      <td className="py-3 pr-4">
                        <select
                          aria-label={`Papel RBAC de ${user.name}`}
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          className="px-2.5 py-1 rounded-lg bg-[var(--background)] border border-[var(--border-strong)] font-mono text-[11px] cursor-pointer"
                        >
                          {PORTAL_ROLES.map((roleOpt) => (
                            <option key={roleOpt} value={roleOpt}>
                              {roleOpt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadgeClass(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-mono text-[11px] text-[var(--foreground)]/65">{user.lastAccess}</td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(user.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-semibold bg-[var(--background)] border border-[var(--border-strong)] hover:border-[var(--color-milet-amber)] cursor-pointer"
                        >
                          <UserCheck weight="bold" className="w-3.5 h-3.5" />
                          <span>
                            {user.status === "Pendente KYC"
                              ? "Aprovar KYC"
                              : user.status === "Ativo"
                                ? "Suspender"
                                : "Reativar"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <h2 className="font-serif text-xl font-bold">Convidar / Cadastrar Novo Usuário</h2>
            <form onSubmit={handleInviteUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <label className="space-y-1 text-xs">
                <span className="font-semibold">Nome Completo</span>
                <input
                  type="text"
                  value={inviteName}
                  placeholder="Ana Beatriz Souza"
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)]"
                />
              </label>
              <label className="space-y-1 text-xs">
                <span className="font-semibold">E-mail Corporativo</span>
                <input
                  type="email"
                  value={inviteEmail}
                  placeholder="ana@empresa.com.br"
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)] font-mono"
                />
              </label>
              <label className="space-y-1 text-xs">
                <span className="font-semibold">Organização / Tenant</span>
                <input
                  type="text"
                  value={inviteOrg}
                  placeholder="Rede Mercado Sul"
                  onChange={(e) => setInviteOrg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)]"
                />
              </label>
              <label className="space-y-1 text-xs">
                <span className="font-semibold">Papel RBAC</span>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)] font-mono"
                >
                  {PORTAL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white milet-amber-gradient cursor-pointer"
              >
                <UserPlus weight="bold" className="w-4 h-4" />
                <span>Emitir Convite</span>
              </button>
            </form>

            {inviteError ? (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
                <Warning weight="fill" className="w-4 h-4 shrink-0" />
                <span>{inviteError}</span>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}

      {activeTab === "viabilidade" ? (
        <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold">Mapa de Oferta, Lastro GD e Contratos 1:1 / 1:N</h2>
              <p className="text-xs text-[var(--foreground)]/70">
                Cruzamento de demanda qualificada por distribuidora para estudo prévio de viabilidade e alocação de usinas.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <Lightning weight="fill" className="w-3.5 h-3.5" />
              <span>Submercado SE/CO ativo</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supplyRows.map((row) => {
              const occupancy = Math.min(100, Math.round((row.pipelineDemandKwh / row.availableKwhMonth) * 100));
              return (
                <div
                  key={row.id}
                  className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        <Factory weight="duotone" className="w-4 h-4 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]" />
                        <span>{row.partnerName}</span>
                      </div>
                      <div className="text-xs text-[var(--foreground)]/65">
                        {row.distributor} · {row.submarket} · {row.modality}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        row.homologated
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/25"
                          : "bg-amber-500/10 text-amber-800 border-amber-500/30"
                      }`}
                    >
                      {row.homologated ? "Homologado" : "Em Homologação"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="h-2 rounded-full bg-[var(--card)] border border-[var(--border)] overflow-hidden">
                      <div className="h-full milet-amber-gradient" style={{ width: `${occupancy}%` }} />
                    </div>
                    <div className="flex justify-between font-mono text-[11px] text-[var(--foreground)]/65">
                      <span>Demanda mapeada: {row.pipelineDemandKwh.toLocaleString("pt-BR")} kWh</span>
                      <span>Saldo: {row.availableKwhMonth.toLocaleString("pt-BR")} kWh ({occupancy}%)</span>
                    </div>
                  </div>

                  {!row.homologated ? (
                    <button
                      type="button"
                      onClick={() => handleHomologatePartner(row.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white milet-amber-gradient cursor-pointer"
                    >
                      Homologar Ativo para Match
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {activeTab === "seguranca" ? (
        <div className="space-y-6">
          <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <h2 className="font-serif text-xl font-bold">Diretório Multi-Tenant e Políticas PostgreSQL RLS</h2>
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
              {auditEvents.map((event) => {
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
      ) : null}
    </div>
  );
}
