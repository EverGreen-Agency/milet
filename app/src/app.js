import { JOURNEY_STEPS, calculateBaseline, money, rankProposals, validateInvoice } from "./domain.js";
import { DemoEnergyAdapter } from "./demo-adapter.js";

const adapter = new DemoEnergyAdapter();
const state = { step: 0, data: null, invoice: null, loading: true, error: "", corrected: false, selected: "" };
const screen = document.querySelector("#screen");
const stepper = document.querySelector("#stepper");
const live = document.querySelector("#live-region");

function announce(message) { live.textContent = message; }
function setStep(index) {
  state.step = Math.max(0, Math.min(index, JOURNEY_STEPS.length - 1));
  location.hash = JOURNEY_STEPS[state.step].id;
  state.error = "";
  render();
  document.querySelector("#main").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

function renderStepper() {
  stepper.innerHTML = JOURNEY_STEPS.map((step, index) => `
    <li class="${index === state.step ? "active" : ""} ${index < state.step ? "done" : ""}">
      <button type="button" data-step="${index}" ${index > state.step ? "disabled" : ""} aria-current="${index === state.step ? "step" : "false"}">
        <span>${index < state.step ? "✓" : index + 1}</span>${step.label}
      </button>
    </li>`).join("");
}

const actions = (primary, back = true) => `<div class="screen-actions">
  ${back ? '<button class="btn secondary" type="button" data-action="back">Voltar</button>' : ""}
  ${primary}
</div>`;

function triage() {
  return `<section class="screen-grid"><div class="screen-copy">
    <p class="eyebrow">Descoberta · 2 minutos</p>
    <h1>Há mais de um caminho para a energia da sua empresa.</h1>
    <p class="lead">Responda três pontos para uma triagem inicial. Você não precisa conhecer as siglas do setor.</p>
    <form id="triage-form" class="question-card">
      <fieldset><legend>Qual é o valor médio da sua conta?</legend>
        <label><input type="radio" name="bill" value="low"> Até R$ 5 mil</label>
        <label><input type="radio" name="bill" value="mid" checked> Entre R$ 5 mil e R$ 20 mil</label>
        <label><input type="radio" name="bill" value="high"> Acima de R$ 20 mil</label>
      </fieldset>
      <label class="field">Estado da unidade <select name="state"><option>Minas Gerais</option><option>São Paulo</option><option>Outro estado</option></select></label>
      <label class="field">Você tem uma fatura recente? <select name="hasInvoice"><option value="yes">Sim</option><option value="no">Ainda não</option></select></label>
      ${actions('<button class="btn primary" type="submit">Ver possibilidades <span>→</span></button>', false)}
    </form>
  </div><aside class="insight-panel"><span class="pulse"></span><p>Triagem preliminar</p><strong>Seu perfil pode ter alternativas</strong><p>Uma fatura permite comparar custo, prazo, esforço e riscos na mesma base.</p><small>Não é oferta, recomendação financeira ou garantia de economia.</small></aside></section>`;
}

function invoice() {
  return `<section><div class="section-heading"><div><p class="eyebrow">Fatura</p><h1>Comece pela conta que você já recebe.</h1><p class="lead">Nesta versão, a leitura é simulada com dados sintéticos. Nenhum arquivo é enviado.</p></div><span class="story-tag">US-002 · demo</span></div>
    ${state.error ? `<div class="alert error" role="alert"><strong>Leitura interrompida</strong><span>${state.error}</span><button type="button" data-action="clear-error">Tentar novamente</button></div>` : ""}
    <div class="upload-card ${state.loading ? "loading" : ""}">
      <div class="upload-icon" aria-hidden="true">↥</div><h2>Adicionar fatura</h2><p>PDF, PNG ou JPG · até 10 MB na experiência futura</p>
      <label class="btn secondary file-button">Escolher arquivo<input id="invoice-file" type="file" accept=".pdf,.png,.jpg,.jpeg"></label>
      <span class="or">ou</span><button class="btn primary" type="button" data-action="demo-upload">Usar fatura sintética <span>→</span></button>
      <button class="text-button" type="button" data-action="fail-upload">Ver estado de falha</button>
    </div>${actions('', true)}</section>`;
}

function review() {
  const i = state.invoice;
  return `<section><div class="section-heading"><div><p class="eyebrow">Conferência</p><h1>A leitura ajuda. A decisão continua sendo sua.</h1><p class="lead">Confira os campos antes de gerar o diagnóstico. A origem e a confiança ficam visíveis.</p></div><span class="story-tag">US-003 · demo</span></div>
    <form id="review-form" class="review-layout"><div class="invoice-preview" aria-label="Prévia estilizada da fatura sintética"><div><span>Fatura sintética</span><strong>${i.fileName}</strong></div><p>Documento de demonstração<br>sem valor fiscal.</p><div class="scan-line"></div></div>
    <div class="review-fields">
      <label class="field"><span>Período <small class="confidence high">98% de confiança</small></span><input name="period" type="month" value="${i.period}" required></label>
      <label class="field"><span>Consumo <small class="confidence high">96% de confiança</small></span><div class="input-unit"><input name="consumptionKwh" type="number" value="${i.consumptionKwh}" required><span>kWh</span></div></label>
      <label class="field"><span>Total da fatura <small class="confidence high">97% de confiança</small></span><div class="input-unit"><span>R$</span><input name="total" type="number" value="${i.total}" required></div></label>
      <label class="field uncertain"><span>Demanda contratada <small class="confidence low">Conferir · 63%</small></span><div class="input-unit"><input name="contractedDemandKw" type="number" value="${i.contractedDemandKw}"><span>kW</span></div><small>O número estava pouco legível no arquivo.</small></label>
      <label class="field missing"><span>Bandeira tarifária <small class="confidence low">Dado ausente</small></span><select name="tariffFlag"><option value="">Selecione para completar</option><option>Verde</option><option>Amarela</option><option>Vermelha</option></select></label>
      <div id="form-errors" class="form-errors" role="alert"></div>
      ${actions('<button class="btn primary" type="submit">Aprovar e diagnosticar <span>→</span></button>')}
    </div></form></section>`;
}

function diagnosis() {
  const baseline = calculateBaseline(state.data.baseline.components);
  return `<section><div class="section-heading"><div><p class="eyebrow">Diagnóstico explicável</p><h1>Uma referência comum antes de comparar.</h1><p class="lead">Estimativa construída a partir da fatura sintética e das premissas visíveis abaixo.</p></div><span class="story-tag">US-006—009 · demo</span></div>
    ${state.corrected ? '<div class="alert success"><strong>Dados revisados</strong><span>O diagnóstico usa a versão que você aprovou.</span></div>' : ""}
    <div class="metrics"><article><span>Custo mensal de referência</span><strong>${money(baseline)}</strong><small>${state.data.baseline.period}</small></article><article><span>Consumo mensal</span><strong>${state.invoice.consumptionKwh.toLocaleString("pt-BR")} kWh</strong><small>Fatura aprovada</small></article><article><span>Custo médio</span><strong>${money(baseline / state.invoice.consumptionKwh)}/kWh</strong><small>Todos os componentes</small></article></div>
    <div class="diagnosis-grid"><div class="card"><div class="card-title"><h2>Rotas avaliadas</h2><span>Regra demo v0.1</span></div>${state.data.eligibility.map((item) => `<article class="route"><span class="status ${item.status}"></span><div><strong>${item.route}</strong><p>${item.reason}</p></div><span class="status-label">${item.status === "eligible" ? "Elegível" : item.status === "review" ? "Faltam dados" : "Não priorizada"}</span></article>`).join("")}</div>
    <div class="card recommendation"><p class="eyebrow">Recomendação preliminar</p><h2>Compare propostas de mercado livre primeiro.</h2><p>É a rota com dados suficientes neste caso. Solar local permanece em revisão até informar área e estrutura do telhado.</p><details><summary>Ver critérios e limites</summary><ul><li>Mesma baseline e horizonte de 12 meses.</li><li>Ranking por custo mensal total, sem pagamento por posição.</li><li>Regras regulatórias e preços são sintéticos e precisam de validação real.</li></ul></details></div></div>
    <div class="assumptions"><strong>O que entra na conta</strong>${state.data.baseline.assumptions.map((a) => `<span>${a}</span>`).join("")}</div>
    ${actions('<button class="btn primary" type="button" data-action="next">Comparar cenários <span>→</span></button>')}</section>`;
}

function proposalBody(p) {
  return `<div class="proposal-head"><div><span class="rank">${p.rank === 1 ? "Menor custo total" : "Alternativa"}</span><h3>${p.supplier}</h3><small>${p.id}</small></div><label class="compare-check"><input type="checkbox" checked> Comparar</label></div>
    <dl><div><dt>Custo total/mês</dt><dd>${money(p.total)}</dd></div><div><dt>Economia estimada</dt><dd>${money(p.monthlySaving)} · ${p.savingPercent.toFixed(1)}%</dd></div><div><dt>Prazo</dt><dd>${p.termMonths} meses</dd></div><div><dt>Risco</dt><dd>${p.risk}</dd></div></dl>
    ${p.missing.length ? `<div class="missing-note">Falta confirmar: ${p.missing.join(", ")}</div>` : ""}<p class="remuneration">${p.remuneration}</p>
    <button class="btn ${state.selected === p.id ? "selected" : "secondary"}" type="button" data-select="${p.id}">${state.selected === p.id ? "Oferta marcada" : "Marcar para conversar"}</button>`;
}

function compare() {
  const baseline = calculateBaseline(state.data.baseline.components);
  const proposals = rankProposals(state.data.proposals, baseline);
  return `<section><div class="section-heading"><div><p class="eyebrow">Comparação normalizada</p><h1>Veja o custo inteiro, não só o preço da energia.</h1><p class="lead">Conta residual, fornecedor, serviço Milet, tributos e financiamento usam a mesma base.</p></div><span class="story-tag">US-013 · demo</span></div>
    <div class="comparison-summary"><div><span>Referência atual</span><strong>${money(baseline)}/mês</strong></div><p>Ordenação por custo mensal total. Nenhuma oferta compra posição. Valores e empresas são sintéticos.</p></div>
    <div class="desktop-comparison"><table><caption class="sr-only">Comparação das propostas sintéticas</caption><thead><tr><th>Critério</th>${proposals.map((p) => `<th>${p.supplier}<small>${p.id}</small></th>`).join("")}</tr></thead><tbody>
      <tr><th>Custo total mensal</th>${proposals.map((p) => `<td class="big-number">${money(p.total)}</td>`).join("")}</tr>
      <tr><th>Economia estimada</th>${proposals.map((p) => `<td>${money(p.monthlySaving)} · ${p.savingPercent.toFixed(1)}%</td>`).join("")}</tr>
      <tr><th>Conta residual</th>${proposals.map((p) => `<td>${money(p.costs.residualBill)}</td>`).join("")}</tr>
      <tr><th>Fornecedor</th>${proposals.map((p) => `<td>${money(p.costs.supplier)}</td>`).join("")}</tr>
      <tr><th>Serviço Milet</th>${proposals.map((p) => `<td>${money(p.costs.miletService)}</td>`).join("")}</tr>
      <tr><th>Tributos</th>${proposals.map((p) => `<td>${money(p.costs.taxes)}</td>`).join("")}</tr>
      <tr><th>Financiamento</th>${proposals.map((p) => `<td>${money(p.costs.financing)}</td>`).join("")}</tr>
      <tr><th>Prazo e risco</th>${proposals.map((p) => `<td>${p.termMonths} meses · ${p.risk}</td>`).join("")}</tr>
      <tr><th>Dados ausentes</th>${proposals.map((p) => `<td>${p.missing.length ? p.missing.join(", ") : "Nenhum"}</td>`).join("")}</tr>
      <tr><th>Próximo passo</th>${proposals.map((p) => `<td><button class="btn ${state.selected === p.id ? "selected" : "secondary"}" type="button" data-select="${p.id}">${state.selected === p.id ? "Marcada" : "Marcar oferta"}</button></td>`).join("")}</tr>
    </tbody></table></div>
    <div class="mobile-comparison">${proposals.map((p) => `<article class="proposal-card">${proposalBody(p)}</article>`).join("")}</div>
    ${state.selected ? '<div class="alert success" role="status"><strong>Preferência registrada apenas nesta sessão</strong><span>Isso não contrata, assina ou envia dados ao fornecedor.</span></div>' : ""}
    <div class="boundary"><strong>O que esta versão prova</strong><p>Navegação, revisão humana, cálculos consistentes e comparação responsiva. Não prova OCR, elegibilidade regulatória, preço real, autenticação, auditoria imutável ou contratação.</p></div>
    ${actions('<a class="btn primary" href="../backlog.html">Ver próximos incrementos <span>↗</span></a>')}</section>`;
}

function render() {
  renderStepper();
  if (state.loading && !state.data) { screen.innerHTML = '<div class="page-loading" role="status"><span></span>Preparando caso sintético…</div>'; return; }
  screen.innerHTML = [triage, invoice, review, diagnosis, compare][state.step]();
  announce(`Etapa ${state.step + 1} de ${JOURNEY_STEPS.length}: ${JOURNEY_STEPS[state.step].label}`);
}

document.addEventListener("click", async (event) => {
  const stepButton = event.target.closest("[data-step]"); if (stepButton) return setStep(Number(stepButton.dataset.step));
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "back") return setStep(state.step - 1);
  if (action === "next") return setStep(state.step + 1);
  if (action === "clear-error") { state.error = ""; return render(); }
  if (action === "demo-upload" || action === "fail-upload") {
    state.loading = true; state.error = ""; render();
    try { state.invoice = await adapter.extractInvoice(null, { fail: action === "fail-upload" }); state.loading = false; setStep(2); }
    catch (error) { state.loading = false; state.error = error.message; render(); announce(state.error); }
  }
  const select = event.target.closest("[data-select]"); if (select) { state.selected = select.dataset.select; render(); announce("Preferência registrada apenas nesta demonstração."); }
});

document.addEventListener("change", async (event) => {
  if (event.target.id !== "invoice-file") return;
  state.loading = true; render();
  try { state.invoice = await adapter.extractInvoice(event.target.files[0]); state.loading = false; setStep(2); }
  catch (error) { state.loading = false; state.error = error.message; render(); }
});

document.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (event.target.id === "triage-form") return setStep(1);
  if (event.target.id === "review-form") {
    const values = Object.fromEntries(new FormData(event.target));
    values.consumptionKwh = Number(values.consumptionKwh); values.total = Number(values.total); values.contractedDemandKw = Number(values.contractedDemandKw);
    const errors = validateInvoice(values);
    if (Object.keys(errors).length) { document.querySelector("#form-errors").textContent = Object.values(errors).join(" "); return; }
    state.invoice = await adapter.saveReviewedInvoice({ ...state.invoice, ...values }); state.corrected = true; setStep(3);
  }
});

document.querySelector("#theme-toggle").addEventListener("click", (event) => {
  const dark = document.documentElement.toggleAttribute("data-theme");
  if (dark) document.documentElement.dataset.theme = "dark"; else delete document.documentElement.dataset.theme;
  event.currentTarget.setAttribute("aria-pressed", String(dark));
});

const hashIndex = JOURNEY_STEPS.findIndex((step) => `#${step.id}` === location.hash);
state.data = await adapter.getCase(); state.invoice = structuredClone(state.data.invoice); state.loading = false; state.step = hashIndex >= 0 ? hashIndex : 0; render();
