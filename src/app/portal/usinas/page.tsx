"use client";

import { useState } from "react";
import { CheckCircle, Plus, SunHorizon, Warning } from "@phosphor-icons/react";
import {
  allocateConsumerToAsset,
  type GenerationAssetPool
} from "@/domain/matching-engine";
import {
  PORTAL_SUBMARKETS,
  validateGenerationAssetInput,
  type Submarket
} from "@milet/contracts";

const INITIAL_ASSET: GenerationAssetPool = {
  id: "asset-ufv-cerrado",
  tenantId: "t-usina-1",
  name: "UFV Solar Cerrado I",
  modality: "GD_COMPARTILHADA",
  submarket: "SE/CO",
  distributor: "Cemig",
  capacityKw: 250,
  availableKwhMonth: 50000,
  discountPercent: 18
};

export default function GeneratorPortalPage() {
  const [asset, setAsset] = useState<GenerationAssetPool>(INITIAL_ASSET);
  const [allocationKwh, setAllocationKwh] = useState<number>(3200);
  const [allocationStatus, setAllocationStatus] = useState<string | null>(null);
  const [allocationError, setAllocationError] = useState<string | null>(null);

  const [newName, setNewName] = useState<string>("");
  const [newDistributor, setNewDistributor] = useState<string>("Cemig");
  const [newSubmarket, setNewSubmarket] = useState<Submarket>("SE/CO");
  const [newCapacityKw, setNewCapacityKw] = useState<number>(500);
  const [newAvailableKwh, setNewAvailableKwh] = useState<number>(62000);
  const [formErrors, setFormErrors] = useState<readonly string[]>([]);
  const [createdNotice, setCreatedNotice] = useState<string | null>(null);

  const runAllocation = (amount: number) => {
    setAllocationError(null);
    setAllocationStatus(null);
    try {
      const updated = allocateConsumerToAsset(asset, amount);
      setAsset(updated);
      setAllocationStatus(
        `Cota de ${amount.toLocaleString("pt-BR")} kWh/mês alocada. Saldo restante: ${updated.availableKwhMonth.toLocaleString("pt-BR")} kWh/mês.`
      );
    } catch (err: unknown) {
      setAllocationError(err instanceof Error ? err.message : "Erro ao alocar saldo.");
    }
  };

  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    setCreatedNotice(null);
    const errors = validateGenerationAssetInput({
      name: newName,
      distributor: newDistributor,
      submarket: newSubmarket,
      capacityKw: newCapacityKw,
      availableKwhMonth: newAvailableKwh
    });
    setFormErrors(errors);
    if (errors.length === 0) {
      setCreatedNotice(
        `Ativo ${newName.trim()} (${newDistributor.trim()} · ${newSubmarket}) validado contra o contrato @milet/contracts e pronto para oferta GD.`
      );
      setNewName("");
    }
  };

  const usedPercent = Math.round(((50000 - asset.availableKwhMonth) / 50000) * 100);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
          <SunHorizon weight="duotone" className="w-4 h-4" />
          <span>Portal de Usinas &amp; Consórcios GD</span>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Lastro de Energia e Alocação de Cotas
        </h1>
        <p className="text-sm text-[var(--foreground)]/70">
          Controle de capacidade ociosa sem sobre-alocação de créditos de compensação junto à distribuidora.
        </p>
      </div>

      <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-bold">{asset.name}</h2>
            <p className="text-xs text-[var(--foreground)]/65">
              {asset.distributor} · Submercado {asset.submarket} · Desconto bruto {asset.discountPercent}% · {asset.capacityKw} kWp
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-2xl font-bold text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
              {asset.availableKwhMonth.toLocaleString("pt-BR")} kWh
            </div>
            <div className="text-[11px] text-[var(--foreground)]/60">Saldo disponível / mês</div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="h-2.5 w-full rounded-full bg-[var(--background)] border border-[var(--border)] overflow-hidden">
            <div
              className="h-full milet-amber-gradient transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, 100 - usedPercent))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-[var(--foreground)]/60">
            <span>Capacidade alocada: {usedPercent}%</span>
            <span>Capacidade inicial: 50.000 kWh/mês</span>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 pt-2">
          <label className="space-y-1 text-xs">
            <span className="font-semibold">Alocar carga (kWh/mês)</span>
            <input
              type="number"
              value={allocationKwh}
              onChange={(e) => setAllocationKwh(Number(e.target.value))}
              className="block w-44 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)] font-mono"
            />
          </label>
          <button
            type="button"
            onClick={() => runAllocation(allocationKwh)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white milet-amber-gradient cursor-pointer"
          >
            Alocar Cota
          </button>
          <button
            type="button"
            onClick={() => runAllocation(3200)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--background)] border border-[var(--border)] hover:border-[var(--color-milet-amber)] cursor-pointer"
          >
            + 3.200 kWh (Clínica)
          </button>
          <button
            type="button"
            onClick={() => runAllocation(12480)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--background)] border border-[var(--border)] hover:border-[var(--color-milet-amber)] cursor-pointer"
          >
            + 12.480 kWh (Padaria)
          </button>
          <button
            type="button"
            onClick={() => {
              setAsset(INITIAL_ASSET);
              setAllocationError(null);
              setAllocationStatus("Saldo restaurado para 50.000 kWh/mês.");
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-[var(--foreground)]/70 hover:text-[var(--foreground)] cursor-pointer"
          >
            Restaurar Saldo
          </button>
        </div>

        {allocationStatus ? (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle weight="fill" className="w-4 h-4 shrink-0" />
            <span>{allocationStatus}</span>
          </div>
        ) : null}

        {allocationError ? (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-medium flex items-center gap-2">
            <Warning weight="fill" className="w-4 h-4 shrink-0" />
            <span>{allocationError}</span>
          </div>
        ) : null}
      </section>

      <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
        <h2 className="font-serif text-xl font-bold">Validar Cadastro de Novo Ativo GD</h2>
        <form onSubmit={handleRegisterAsset} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <label className="space-y-1 text-xs">
            <span className="font-semibold">Nome da Usina</span>
            <input
              type="text"
              value={newName}
              placeholder="UFV Sul Minas II"
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)]"
            />
          </label>
          <label className="space-y-1 text-xs">
            <span className="font-semibold">Distribuidora</span>
            <input
              type="text"
              value={newDistributor}
              onChange={(e) => setNewDistributor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)]"
            />
          </label>
          <label className="space-y-1 text-xs">
            <span className="font-semibold">Submercado</span>
            <select
              value={newSubmarket}
              onChange={(e) => setNewSubmarket(e.target.value as Submarket)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)] font-mono"
            >
              {PORTAL_SUBMARKETS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-xs">
            <span className="font-semibold">Potência (kWp) / Saldo (kWh)</span>
            <div className="flex gap-2">
              <input
                type="number"
                value={newCapacityKw}
                onChange={(e) => setNewCapacityKw(Number(e.target.value))}
                className="w-1/2 px-2.5 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)] font-mono"
              />
              <input
                type="number"
                value={newAvailableKwh}
                onChange={(e) => setNewAvailableKwh(Number(e.target.value))}
                className="w-1/2 px-2.5 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)] font-mono"
              />
            </div>
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white milet-amber-gradient cursor-pointer"
          >
            <Plus weight="bold" className="w-4 h-4" />
            <span>Validar Ativo</span>
          </button>
        </form>

        {formErrors.length > 0 ? (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs space-y-1">
            {formErrors.map((err) => (
              <div key={err}>• {err}</div>
            ))}
          </div>
        ) : null}

        {createdNotice ? (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle weight="fill" className="w-4 h-4 shrink-0" />
            <span>{createdNotice}</span>
          </div>
        ) : null}
      </section>
    </div>
  );
}
