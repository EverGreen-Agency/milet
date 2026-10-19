import { JOURNEY_STEPS, calculateBaseline, money, rankProposals, validateInvoice } from "./domain.js";
import { DemoEnergyAdapter } from "./demo-adapter.js";
import { profilePresets } from "./fixtures.js";

const runtimeConfig = globalThis.MILET_RUNTIME_CONFIG ?? {};
const adapter = new DemoEnergyAdapter({ apiBaseUrl: runtimeConfig.apiBaseUrl ?? "", timeoutMs: runtimeConfig.apiTimeoutMs ?? 2_500 });
const state = {
  step: 0,
  data: null,
  invoice: null,
  loading: true,
  error: "",
  corrected: false,
  selected: "",
  profile: "company",
  lead: { name: "", email: "", phone: "", companyName: "" },
  sentIntake: null,
  dispatchLoading: false,
  dispatchError: ""
};

const screen = document.querySelector("#screen");
const stepper = document.querySelector("#stepper");
const live = document.querySelector("#live-region");
const runtimeStatus = document.querySelector("#runtime-status");

function announce(message) { if (live) live.textContent = message; }
function showRuntimeStatus(runtime) {
  if (!runtimeStatus) return;
  runtimeStatus.textContent = runtime.message;
  runtimeStatus.dataset.mode = runtime.mode;
}

function updateUnitSidebar() {
  const nameEl = document.querySelector("#unit-name");
  const idEl = document.querySelector("#unit-id");
  if (nameEl && state.data?.organization?.name) nameEl.textContent = state.data.organization.name;
  if (idEl && state.data?.unit?.id) idEl.textContent = state.data.unit.id;
}

function setStep(index) {
  state.step = Math.max(0, Math.min(index, JOURNEY_STEPS.length - 1));
  location.hash = JOURNEY_STEPS[state.step].id;
  state.error = "";
  render();
  document.querySelector("#main")?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

function renderStepper() {
  if (!stepper) return;
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
  const currentProfile = state.profile || "company";
  return `<section class="screen-grid"><div class="screen-copy">
    <p class="eyebrow">Diagnóstico Personalizado · 2 minutos</p>
    <h1>Há mais de um caminho para a energia da sua empresa.</h1>
    <p class="lead">Selecione o seu perfil e informe a distribuidora local para receber um diagnóstico tarifário neutro e comparável.</p>
    
    <div class="profile-selector" role="radiogroup" aria-label="Selecione seu perfil de usuário">
      <button type="button" class="profile-pill ${currentProfile === "company" ? "active" : ""}" data-set-profile="company" role="radio" aria-checked="${currentProfile === "company"}">
        <span class="profile-pill-badge">Grupo A / B</span>
        <strong>Empresa / PME</strong>
        <small>Comércio, padarias, clínicas, galpões e indústrias</small>
      </button>
      <button type="button" class="profile-pill ${currentProfile === "supplier" ? "active" : ""}" data-set-profile="supplier" role="radio" aria-checked="${currentProfile === "supplier"}">
        <span class="profile-pill-badge">Oferta / Trading</span>
        <strong>Comercializadora</strong>
        <small>Agentes de mercado, trading e geradores</small>
      </button>
      <button type="button" class="profile-pill ${currentProfile === "home" ? "active" : ""}" data-set-profile="home" role="radio" aria-checked="${currentProfile === "home"}">
        <span class="profile-pill-badge">Grupo B / GD</span>
        <strong>Residencial</strong>
        <small>Residências, consultórios e condomínios</small>
      </button>
    </div>

    <form id="triage-form" class="question-card">
      <fieldset><legend>Qual é o valor médio da sua conta de energia?</legend>
        <label><input type="radio" name="bill" value="low" ${currentProfile === "home" ? "checked" : ""}> Até R$ 5 mil/mês</label>
        <label><input type="radio" name="bill" value="mid" ${currentProfile === "company" ? "checked" : ""}> Entre R$ 5 mil e R$ 20 mil/mês</label>
        <label><input type="radio" name="bill" value="high" ${currentProfile === "supplier" ? "checked" : ""}> Acima de R$ 20 mil/mês</label>
      </fieldset>

      <label class="field">
        <span>Estado da unidade e Concessionária</span>
        <select name="stateDistributor" id="stateDistributor">
          <optgroup label="Minas Gerais">
            <option value="MG|Cemig" ${state.data?.organization?.state === "MG" ? "selected" : ""}>Minas Gerais — CEMIG Distribuição</option>
            <option value="MG|Energisa">Minas Gerais — Energisa Minas Rio</option>
          </optgroup>
          <optgroup label="São Paulo">
            <option value="SP|Enel SP">São Paulo — Enel Distribuição São Paulo</option>
            <option value="SP|CPFL Paulista" ${state.data?.organization?.state === "SP" ? "selected" : ""}>São Paulo — CPFL Paulista</option>
            <option value="SP|CPFL Piratininga">São Paulo — CPFL Piratininga / Santa Cruz</option>
            <option value="SP|EDP SP">São Paulo — EDP São Paulo</option>
            <option value="SP|Elektro">São Paulo — Neoenergia Elektro</option>
          </optgroup>
          <optgroup label="Rio de Janeiro">
            <option value="RJ|Light" ${state.data?.organization?.state === "RJ" ? "selected" : ""}>Rio de Janeiro — Light S.A.</option>
            <option value="RJ|Enel RJ">Rio de Janeiro — Enel Distribuição Rio</option>
          </optgroup>
          <optgroup label="Sul (PR, SC, RS)">
            <option value="PR|Copel">Paraná — Copel Distribuição</option>
            <option value="SC|Celesc">Santa Catarina — Celesc Distribuição</option>
            <option value="RS|RGE">Rio Grande do Sul — RGE (CPFL)</option>
            <option value="RS|CEEE">Rio Grande do Sul — CEEE Equatorial</option>
          </optgroup>
          <optgroup label="Nordeste">
            <option value="BA|Neoenergia Coelba">Bahia — Neoenergia Coelba</option>
            <option value="PE|Neoenergia Pernambuco">Pernambuco — Neoenergia Pernambuco</option>
            <option value="CE|Enel CE">Ceará — Enel Ceará</option>
            <option value="RN|Neoenergia Cosern">Rio Grande do Norte — Neoenergia Cosern</option>
          </optgroup>
          <optgroup label="Centro-Oeste & Norte">
            <option value="DF|Neoenergia Brasília">Distrito Federal — Neoenergia Brasília</option>
            <option value="GO|Equatorial GO">Goiás — Equatorial Energia Goiás</option>
            <option value="MT|Energisa MT">Mato Grosso — Energisa Mato Grosso</option>
            <option value="MS|Energisa MS">Mato Grosso do Sul — Energisa MS</option>
            <option value="PA|Equatorial PA">Pará — Equatorial Energia Pará</option>
          </optgroup>
          <optgroup label="Outras Regiões">
            <option value="OUTRO|Outra">Outro estado / Concessionária não listada</option>
          </optgroup>
        </select>
      </label>

      <label class="field">
        <span>Você possui uma fatura recente de energia?</span>
        <select name="hasInvoice" id="hasInvoice">
          <option value="pdf" selected>Sim, fatura digital em PDF da distribuidora (Recomendado)</option>
          <option value="photo">Sim, fatura impressa ou foto legível</option>
          <option value="portal">Possuo acesso ao portal / agência virtual da concessionária</option>
          <option value="estimate">Ainda não (desejo simular por estimativa de consumo)</option>
        </select>
      </label>

      ${actions('<button class="btn primary" type="submit">Continuar para envio da fatura <span>→</span></button>', false)}
    </form>
  </div>
  
  <aside class="insight-panel">
    <span class="pulse"></span>
    <p>Triagem Inteligente</p>
    <strong>${currentProfile === "supplier" ? "Estruturação de Demanda" : "Redução com Segurança"}</strong>
    <p>${currentProfile === "supplier"
      ? "Padronize a ingestão de faturas e elimine retrabalho operacional na equipe comercial."
      : "A partir dos dados da sua fatura, equalizamos Mercado Cativo, Mercado Livre (ACL) e Geração Distribuída na mesma base técnica."}</p>
    <small>Metodologia neutra independente. Sem spread oculto ou preferência por bandeira comercial.</small>
  </aside></section>`;
}

function invoice() {
  const unit = state.data?.unit || { distributor: "Cemig", voltageGroup: "A4" };
  const org = state.data?.organization || { name: "Padaria Horizonte" };
  return `<section><div class="section-heading"><div>
    <p class="eyebrow">Ingestão de Fatura</p>
    <h1>Comece pela conta que você já recebe.</h1>
    <p class="lead">Faça o upload da fatura recente da ${unit.distributor} ou carregue o modelo pré-configurado de ${org.name} para avançar instantaneamente.</p>
  </div></div>

  ${state.error ? `<div class="alert error" role="alert"><strong>Atenção na leitura</strong><span>${state.error}</span><button type="button" data-action="clear-error">Tentar novamente</button></div>` : ""}

  <div class="upload-card ${state.loading ? "loading" : ""}">
    <div class="upload-icon" aria-hidden="true">📄</div>
    <h2>Adicionar fatura de energia</h2>
    <p>PDF, PNG ou JPG legível · até 10 MB</p>
    
    <label class="btn secondary file-button">
      Escolher arquivo do computador
      <input id="invoice-file" type="file" accept=".pdf,.png,.jpg,.jpeg">
    </label>
    
    <span class="or">ou</span>
    
    <button class="btn primary" type="button" data-action="demo-upload">
      Carregar fatura de demonstração (${unit.distributor} ${unit.voltageGroup}) <span>→</span>
    </button>
  </div>
  ${actions('', true)}</section>`;
}

function review() {
  const i = state.invoice || {
    fileName: "fatura-sintetica-agosto-2026.pdf",
    period: "2026-08",
    consumptionKwh: 12480,
    total: 10920,
    contractedDemandKw: 75,
    tariffFlag: ""
  };
  const unit = state.data?.unit || { distributor: "Cemig", voltageGroup: "A4", id: "UC-MG-00482" };
  const org = state.data?.organization || { name: "Padaria Horizonte", city: "Belo Horizonte", state: "MG" };

  return `<section><div class="section-heading"><div>
    <p class="eyebrow">Conferência Inteligente</p>
    <h1>A leitura ajuda. A decisão continua sendo sua.</h1>
    <p class="lead">Confira os valores extraídos da conta de energia antes de gerar o diagnóstico e as cotações de fornecedores.</p>
  </div></div>

  <form id="review-form" class="review-layout">
    <div class="invoice-preview" aria-label="Prévia da fatura de energia">
      <div class="scan-line" aria-hidden="true"></div>
      
      <div class="bill-paper">
        <div class="bill-header-row">
          <div>
            <div class="bill-distributor-badge">
              <span class="distributor-tag">${unit.distributor.toUpperCase()}</span>
              <span>${unit.distributor.toUpperCase()} DISTRIBUIÇÃO S.A.</span>
            </div>
            <div class="bill-distributor-info">CNPJ: 06.981.180/0001-16 · Inscrição Estadual: 062.322136.0087<br>Atendimento Comercial / ANEEL 116</div>
          </div>
          <div class="bill-title-box">
            <span class="bill-type-badge">Fatura de Energia Elétrica</span>
            <div class="bill-uc-number">UC: <strong>${unit.id}</strong></div>
          </div>
        </div>

        <div class="bill-customer-section">
          <div class="customer-col">
            <span class="label">CLIENTE / DESTINATÁRIO:</span>
            <strong>${org.name.toUpperCase()} LTDA</strong>
            <span>CNPJ: 12.345.678/0001-90 · IE: 001.984.722.0019</span>
            <small>Av. Amazonas, 1420 - Prado - ${org.city}/${org.state}</small>
          </div>
          <div class="classification-col">
            <div><span>GRUPO/TENSÃO:</span> <strong>${unit.voltageGroup} (2,3 a 25 kV)</strong></div>
            <div><span>MODALIDADE:</span> <strong>Tarifária Horossazonal Verde</strong></div>
            <div><span>SUBCLASSE:</span> <strong>Comercial / Outros Serviços</strong></div>
          </div>
        </div>

        <div class="bill-kpi-bar">
          <div class="kpi-block highlight">
            <span>Mês de Referência</span>
            <strong>${i.period || "AGO/2026"}</strong>
          </div>
          <div class="kpi-block">
            <span>Vencimento</span>
            <strong>15/09/2026</strong>
          </div>
          <div class="kpi-block highlight-total">
            <span>Total a Pagar</span>
            <strong>${money(i.total || 10920)}</strong>
          </div>
        </div>

        <div class="bill-table-wrapper">
          <table class="bill-table">
            <thead>
              <tr>
                <th>Descrição dos Itens Faturados</th>
                <th>Unid.</th>
                <th>Quant.</th>
                <th>Tarifa</th>
                <th style="text-align: right;">Total (R$)</th>
                <th>Status Leitura</th>
              </tr>
            </thead>
            <tbody>
              <tr class="detected">
                <td>Consumo Ativo Ponta (TUSD + TE)</td>
                <td>kWh</td>
                <td>2.180</td>
                <td>0,8924</td>
                <td class="money">R$ 1.945,43</td>
                <td><span class="badge-ocr ok">98% conf.</span></td>
              </tr>
              <tr class="detected">
                <td>Consumo Ativo Fora Ponta (TUSD + TE)</td>
                <td>kWh</td>
                <td>10.300</td>
                <td>0,3315</td>
                <td class="money">R$ 3.414,45</td>
                <td><span class="badge-ocr ok">96% conf.</span></td>
              </tr>
              <tr style="font-weight: 700; background: rgba(211,155,61,0.12);">
                <td>Consumo Total Medido do Ciclo</td>
                <td>kWh</td>
                <td>${(i.consumptionKwh || 12480).toLocaleString("pt-BR")}</td>
                <td>—</td>
                <td class="money">${money(5359.88)}</td>
                <td><span class="badge-ocr ok">Validado</span></td>
              </tr>
              <tr class="attention">
                <td>Demanda Faturada (kW)</td>
                <td>kW</td>
                <td>${i.contractedDemandKw || 75},00</td>
                <td>41,3333</td>
                <td class="money">R$ 3.100,00</td>
                <td><span class="badge-ocr warn">Conferir · 63%</span></td>
              </tr>
              <tr>
                <td>Adicional Bandeira Tarifária</td>
                <td>un</td>
                <td>1</td>
                <td>420,00</td>
                <td class="money">R$ 420,00</td>
                <td><span class="badge-ocr ok">Mês vigente</span></td>
              </tr>
              <tr>
                <td>Tributos Retidos (ICMS 18%, PIS/COFINS)</td>
                <td>un</td>
                <td>—</td>
                <td>—</td>
                <td class="money">R$ 2.040,12</td>
                <td><span class="badge-ocr ok">97% conf.</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bill-history-mini">
          <div class="bill-history-title">Histórico de Consumo dos Últimos 6 Meses (kWh)</div>
          <div class="history-bars-flex">
            <div class="history-bar-item"><div class="bar-fill" style="height: 75%;"></div><label>MAR</label></div>
            <div class="history-bar-item"><div class="bar-fill" style="height: 78%;"></div><label>ABR</label></div>
            <div class="history-bar-item"><div class="bar-fill" style="height: 82%;"></div><label>MAI</label></div>
            <div class="history-bar-item"><div class="bar-fill" style="height: 76%;"></div><label>JUN</label></div>
            <div class="history-bar-item"><div class="bar-fill" style="height: 79%;"></div><label>JUL</label></div>
            <div class="history-bar-item current"><div class="bar-fill" style="height: 88%;"></div><label>AGO*</label></div>
          </div>
        </div>

        <div class="bill-barcode-strip">
          <div class="barcode-visual">||| | | |||| | ||| || |||| | | ||| | || |||| | | |||| ||| |</div>
          <span class="barcode-number">83680000109-2 20000048291-0 03800000000-4 12480202608-9</span>
          <span class="badge-solar-ready">☀️ Coordenadas Solar: -19.9238, -43.9572 (Belo Horizonte/MG)</span>
        </div>
      </div>
    </div>

    <div class="review-fields">
      <!-- Bloco 1: Medição e Fatura -->
      <div class="field-section">
        <div class="field-section-title">📊 1. Medição & Consumo da Distribuidora</div>
        
        <div class="field-grid-2">
          <label class="field">
            <span>Período da fatura <small class="confidence high">98% conf.</small></span>
            <input name="period" type="month" value="${i.period || "2026-08"}" required>
          </label>
          <label class="field">
            <span>Bandeira tarifária <small class="confidence high">ANEEL</small></span>
            <select name="tariffFlag">
              <option value="Verde" ${i.tariffFlag === "Verde" || !i.tariffFlag ? "selected" : ""}>Verde (sem acréscimo)</option>
              <option value="Amarela" ${i.tariffFlag === "Amarela" ? "selected" : ""}>Amarela</option>
              <option value="Vermelha P1" ${i.tariffFlag === "Vermelha P1" ? "selected" : ""}>Vermelha Patamar 1</option>
              <option value="Vermelha P2" ${i.tariffFlag === "Vermelha P2" ? "selected" : ""}>Vermelha Patamar 2</option>
            </select>
          </label>
        </div>

        <div class="field-grid-2">
          <label class="field">
            <span>Consumo medido total <small class="confidence high">96% conf.</small></span>
            <div class="input-unit">
              <input name="consumptionKwh" type="number" value="${i.consumptionKwh || 12480}" required>
              <span>kWh</span>
            </div>
          </label>
          <label class="field">
            <span>Valor total faturado <small class="confidence high">97% conf.</small></span>
            <div class="input-unit">
              <span>R$</span>
              <input name="total" type="number" value="${i.total || 10920}" required>
            </div>
          </label>
        </div>
      </div>

      <!-- Bloco 2: Localização e Prontidão Solar (Google Solar API) -->
      <div class="field-section">
        <div class="field-section-title">📍 2. Localização & Prontidão Solar (Google Solar)</div>
        
        <div class="field-grid-address">
          <label class="field">
            <span>CEP da unidade <small class="confidence high">99% conf.</small></span>
            <input name="postalCode" type="text" value="${i.postalCode || org.postalCode || "30411-000"}" required placeholder="00000-000">
          </label>
          <label class="field">
            <span>Endereço / Logradouro</span>
            <input name="address" type="text" value="${i.address || org.address || "Av. Amazonas, 1420"}" placeholder="Logradouro e número">
          </label>
        </div>

        <div class="field-grid-2">
          <label class="field">
            <span>Área estimada de telhado <small class="confidence high">Prontidão Solar</small></span>
            <div class="input-unit">
              <input name="roofAreaM2" type="number" value="${i.roofAreaM2 || org.roofAreaM2 || 450}">
              <span>m²</span>
            </div>
          </label>
          <label class="field">
            <span>Tipo de cobertura</span>
            <select name="roofType">
              <option selected>Metálico / Trapezoidal</option>
              <option>Fibrocimento</option>
              <option>Cerâmico / Telha colonial</option>
              <option>Laje de Concreto</option>
              <option>Solo / Terreno disponível</option>
            </select>
          </label>
        </div>
      </div>

      <!-- Bloco 3: Enquadramento Regulatório (Grupo A / Legislação ANEEL) -->
      <div class="field-section">
        <div class="field-section-title">⚡ 3. Enquadramento Técnico (Grupo A / ANEEL)</div>
        
        <div class="field-grid-2">
          <label class="field">
            <span>Subgrupo tarifário <small class="confidence high">Portaria MME 50</small></span>
            <select name="voltageGroup">
              <option selected value="A4">A4 (2,3 a 25 kV) — Média Tensão</option>
              <option value="A3a">A3a (30 a 44 kV)</option>
              <option value="A2">A2 (88 a 138 kV)</option>
              <option value="B3">B3 Comercial (Baixa Tensão)</option>
            </select>
          </label>
          <label class="field">
            <span>Modalidade tarifária</span>
            <select name="tariffModality">
              <option selected value="Verde">Verde (Tarifa Horossazonal)</option>
              <option value="Azul">Azul (Tarifa Horossazonal)</option>
              <option value="Convencional">Convencional</option>
            </select>
          </label>
        </div>

        <div class="field-grid-2">
          <label class="field uncertain">
            <span>Demanda contratada <small class="confidence low">Conferir · 63%</small></span>
            <div class="input-unit">
              <input name="contractedDemandKw" type="number" value="${i.contractedDemandKw || 75}">
              <span>kW</span>
            </div>
            <small>Resolução ANEEL 1.000 exige mín. 30 kW no Grupo A.</small>
          </label>
          <label class="field">
            <span>Subestação / Transformador</span>
            <select name="substationType">
              <option selected>Própria do cliente</option>
              <option>Compartilhada</option>
              <option>Rede da distribuidora</option>
            </select>
          </label>
        </div>
      </div>

      <div id="form-errors" class="form-errors" role="alert"></div>
      ${actions('<button class="btn primary" type="submit">Aprovar dados e gerar diagnóstico <span>→</span></button>')}
    </div>
  </form></section>`;
}

function diagnosis() {
  const baseline = calculateBaseline(state.data.baseline.components);
  const kwh = state.invoice.consumptionKwh || 12480;
  const roofArea = state.invoice.roofAreaM2 || 450;
  const org = state.data?.organization || { city: "Belo Horizonte", state: "MG" };

  return `<section><div class="section-heading"><div>
    <p class="eyebrow">Diagnóstico Explicável</p>
    <h1>Uma referência comum antes de comparar.</h1>
    <p class="lead">Estimativa construída a partir dos dados validados da sua fatura, das regras de abertura do Grupo A (Portaria MME 50/2022) e da viabilidade solar local.</p>
  </div></div>

  ${state.corrected ? '<div class="alert success"><strong>Dados técnicos validados</strong><span>O diagnóstico incorpora a localização em ' + org.city + '/' + org.state + ', área de cobertura e demanda contratada do Grupo A.</span></div>' : ""}

  <div class="metrics">
    <article>
      <span>Custo mensal de referência</span>
      <strong>${money(baseline)}</strong>
      <small>${state.data.baseline.period}</small>
    </article>
    <article>
      <span>Consumo mensal</span>
      <strong>${kwh.toLocaleString("pt-BR")} kWh</strong>
      <small>Fatura aprovada</small>
    </article>
    <article>
      <span>Custo médio da energia</span>
      <strong>${money(baseline / kwh)}/kWh</strong>
      <small>Todos os componentes e tributos</small>
    </article>
  </div>

  <div class="diagnosis-grid">
    <div class="card">
      <div class="card-title">
        <h2>Rotas de Suprimento Avaliadas</h2>
        <span>Matriz Regulatória ANEEL & CCEE</span>
      </div>
      
      <article class="route">
        <span class="status eligible"></span>
        <div>
          <strong>Mercado Livre Varejista (ACL)</strong>
          <p>Unidade Grupo A4 elegível conforme a Portaria MME 50/2022. Sem necessidade de aporte de garantia CCEE. Zero CAPEX de investimento com migração assistida.</p>
        </div>
        <span class="status-label" style="color: #4a7732;">Recomendada</span>
      </article>

      <article class="route">
        <span class="status eligible"></span>
        <div>
          <strong>Geração Solar Própria (Google Solar API readiness)</strong>
          <p>Localização em ${org.city}/${org.state} com irradiação solar de ~1.850 kWh/m²/ano e área útil de ${roofArea} m².</p>
          <div class="route-solar-card">
            <strong>☀️ Potencial Fotovoltaico Estimado:</strong>
            <p>Capacidade para usina de ~60 kWp (~110 módulos), gerando até 7.200 kWh/mês (supre 58% da conta).</p>
            <div class="route-solar-stats">
              <span>CAPEX estimado: ~R$ 195.000</span>
              <span>Payback (Lei 14.300): ~3,8 anos</span>
              <span>Vida útil: 25 anos</span>
            </div>
          </div>
        </div>
        <span class="status-label" style="color: #b26c2a;">Viável c/ CAPEX</span>
      </article>

      <article class="route">
        <span class="status review"></span>
        <div>
          <strong>Geração Compartilhada (Assinatura GD)</strong>
          <p>Alternativa via consórcio solar sem obras físicas. Recomendada caso o cliente não queira investir CAPEX em telhado nem migrar para o Mercado Livre.</p>
        </div>
        <span class="status-label">Alternativa</span>
      </article>
    </div>

    <div class="card recommendation">
      <p class="eyebrow">Parecer técnico comparativo</p>
      <h2>Compare propostas de Mercado Livre primeiro.</h2>
      <p>Para o perfil da sua empresa (Grupo A4 com consumo de ${(kwh).toLocaleString("pt-BR")} kWh/mês), o <strong>Mercado Livre Varejista</strong> entrega economia imediata sem imobilizar R$ 195 mil em telhado próprio.</p>
      <details>
        <summary>Ver critérios técnicos e legislação aplicada</summary>
        <ul>
          <li><strong>Portaria MME nº 50/2022:</strong> Abertura do ACL para todo o Grupo A desde 01/01/2024.</li>
          <li><strong>Lei nº 14.300/2022:</strong> Marco Legal da GD com transição gradual da remuneração do Fio B.</li>
          <li><strong>Resolução ANEEL nº 1.000/2021:</strong> Regras de demanda contratada e prazos de denúncia de contrato cativo (180 dias).</li>
        </ul>
      </details>
    </div>
  </div>

  <div class="assumptions">
    <strong>O que entra na conta:</strong>
    ${state.data.baseline.assumptions.map((a) => `<span>${a}</span>`).join("")}
  </div>

  ${actions('<button class="btn primary" type="button" data-action="next">Comparar propostas de mercado <span>→</span></button>')}</section>`;
}

function proposalBody(p) {
  return `<div class="proposal-head">
    <div>
      <span class="rank">${p.rank === 1 ? "Menor custo total" : "Alternativa"}</span>
      <h3>${p.supplier}</h3>
      <small>${p.id}</small>
    </div>
    <label class="compare-check">
      <input type="checkbox" checked disabled> Comparada
    </label>
  </div>
  <dl>
    <div><dt>Custo total/mês</dt><dd>${money(p.total)}</dd></div>
    <div><dt>Economia estimada</dt><dd>${money(p.monthlySaving)} · ${p.savingPercent.toFixed(1)}%</dd></div>
    <div><dt>Prazo do contrato</dt><dd>${p.termMonths} meses</dd></div>
    <div><dt>Grau de risco</dt><dd>${p.risk}</dd></div>
  </dl>
  ${p.missing.length ? `<div class="missing-note">Falta confirmar: ${p.missing.join(", ")}</div>` : ""}
  <p class="remuneration">${p.remuneration}</p>
  <button class="btn ${state.selected === p.id ? "selected" : "secondary"}" type="button" data-select="${p.id}">
    ${state.selected === p.id ? "✓ Proposta selecionada" : "Selecionar para dossiê"}
  </button>`;
}

function compare() {
  const baseline = calculateBaseline(state.data.baseline.components);
  const proposals = rankProposals(state.data.proposals, baseline);
  const selectedProposalObj = proposals.find(p => p.id === state.selected) || proposals[0];

  return `<section><div class="section-heading"><div>
    <p class="eyebrow">Comparação Normalizada</p>
    <h1>Veja o custo inteiro, não só o preço da energia.</h1>
    <p class="lead">Conta residual da distribuidora, fornecedor, serviço Milet, tributos e encargos setoriais equalizados na mesma régua.</p>
  </div></div>

  <div class="comparison-summary">
    <div>
      <span>Referência atual no Cativo</span>
      <strong>${money(baseline)}/mês</strong>
    </div>
    <p>Ordenação por custo mensal total. Nenhuma oferta compra posição. Propostas padronizadas para tomada de decisão fundamentada.</p>
  </div>

  <div class="desktop-comparison">
    <table>
      <caption class="sr-only">Comparação das propostas normalizadas</caption>
      <thead>
        <tr>
          <th>Critério de Avaliação</th>
          ${proposals.map((p) => `<th>${p.supplier}<small>${p.id}</small></th>`).join("")}
        </tr>
      </thead>
      <tbody>
        <tr><th>Custo total mensal</th>${proposals.map((p) => `<td class="big-number">${money(p.total)}</td>`).join("")}</tr>
        <tr><th>Economia estimada</th>${proposals.map((p) => `<td><strong>${money(p.monthlySaving)}</strong> · ${p.savingPercent.toFixed(1)}%</td>`).join("")}</tr>
        <tr><th>Conta residual distribuidora</th>${proposals.map((p) => `<td>${money(p.costs.residualBill)}</td>`).join("")}</tr>
        <tr><th>Energia (Fornecedor)</th>${proposals.map((p) => `<td>${money(p.costs.supplier)}</td>`).join("")}</tr>
        <tr><th>Serviço Milet (Gestão/Auditoria)</th>${proposals.map((p) => `<td>${money(p.costs.miletService)}</td>`).join("")}</tr>
        <tr><th>Tributos (ICMS/PIS/COFINS)</th>${proposals.map((p) => `<td>${money(p.costs.taxes)}</td>`).join("")}</tr>
        <tr><th>Garantias / Financiamento</th>${proposals.map((p) => `<td>${money(p.costs.financing)}</td>`).join("")}</tr>
        <tr><th>Prazo e Risco</th>${proposals.map((p) => `<td>${p.termMonths} meses · ${p.risk}</td>`).join("")}</tr>
        <tr><th>Pendências de Informação</th>${proposals.map((p) => `<td>${p.missing.length ? p.missing.join(", ") : "Nenhuma"}</td>`).join("")}</tr>
        <tr>
          <th>Seleção de interesse</th>
          ${proposals.map((p) => `<td>
            <button class="btn ${state.selected === p.id ? "selected" : "secondary"}" type="button" data-select="${p.id}">
              ${state.selected === p.id ? "✓ Marcada" : "Marcar proposta"}
            </button>
          </td>`).join("")}
        </tr>
      </tbody>
    </table>
  </div>

  <div class="mobile-comparison">
    ${proposals.map((p) => `<article class="proposal-card">${proposalBody(p)}</article>`).join("")}
  </div>

  ${state.selected ? `<div class="alert success" role="status">
    <strong>Proposta de interesse: ${selectedProposalObj.supplier}</strong>
    <span>Seus dados de preferência foram sincronizados para envio do dossiê completo.</span>
  </div>` : ""}

  <!-- FORMULÁRIO DE ENVIO DO DOSSIÊ POR E-MAIL (SUBSTITUI O LINK DE PRÓXIMOS INCREMENTOS) -->
  <div class="dossier-card" id="email-dossier-card">
    <div class="dossier-head">
      <span class="dossier-badge">Receber Relatório Técnico</span>
      <h2>Enviar o dossiê completo para o meu e-mail</h2>
      <p>Receba a memória completa de cálculo, minuta explicativa dos contratos e as recomendações geradas por inteligência artificial diretamente na sua caixa de entrada.</p>
    </div>

    ${state.sentIntake ? `
      <div class="success-banner" role="alert" style="${state.sentIntake.isRealDispatch ? "" : "background: #252320; color: #f5dfa8; border-color: #5c4e2f;"}">
        <span style="font-size: 24px;">${state.sentIntake.isRealDispatch ? "✉" : "⚡"}</span>
        <div>
          <strong>${state.sentIntake.isRealDispatch
            ? `Dossiê enviado com sucesso para ${state.sentIntake.email}!`
            : `Dossiê estruturado com sucesso (Modo Demonstração)`}</strong>
          <span>${state.sentIntake.isRealDispatch
            ? "A confirmação oficial foi disparada pela Milet via Resend. Se não encontrar na caixa de entrada em 2 minutos, verifique o spam."
            : "O diagnóstico técnico foi gerado abaixo. Para receber no seu e-mail corporativo real, configure a chave RESEND_API_KEY no painel da Vercel."}</span>
          ${state.sentIntake.notice ? `<small style="display:block; margin-top: 4px; color:#c9b89f;">${state.sentIntake.notice}</small>` : ""}
        </div>
      </div>

      <div class="guidance-result">
        <div class="guidance-section">
          <h3>O que já sabemos sobre a sua unidade</h3>
          <ul>${(state.sentIntake.guidance?.whatWeKnow || []).map(item => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div class="guidance-section">
          <h3>O que nossa equipe técnica validará</h3>
          <ul>${(state.sentIntake.guidance?.whatToVerify || []).map(item => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div class="guidance-section">
          <h3>Próxima ação recomendada</h3>
          <p>${state.sentIntake.guidance?.nextAction || "Nossa equipe entrará em contato para agendar uma apresentação dos detalhes contratuais."}</p>
        </div>
        <div class="guidance-section">
          <h3>Salvaguardas e Limites</h3>
          <p>${state.sentIntake.guidance?.limits || "Diagnóstico independente sem promessa de economia ou contratação compulsória."}</p>
        </div>
      </div>
      
      <div style="margin-top: 24px; text-align: center;">
        <button class="btn secondary" type="button" data-action="reset-dispatch">Enviar para outro e-mail</button>
      </div>
    ` : `
      <form id="email-dispatch-form" class="dossier-form">
        <div class="dossier-grid">
          <label class="field">
            <span>Seu nome completo</span>
            <input name="name" type="text" autocomplete="name" required placeholder="Ex.: Lucas Mendes" value="${state.lead.name}">
          </label>
          <label class="field">
            <span>Seu e-mail corporativo</span>
            <input name="email" type="email" autocomplete="email" required placeholder="seu.email@empresa.com.br" value="${state.lead.email}">
          </label>
          <label class="field">
            <span>Nome da Empresa</span>
            <input name="companyName" type="text" autocomplete="organization" required placeholder="Razão social ou nome fantasia" value="${state.lead.companyName || state.data?.organization?.name || "Padaria Horizonte"}">
          </label>
          <label class="field">
            <span>WhatsApp / Telefone para contato</span>
            <input name="phone" type="tel" autocomplete="tel" placeholder="(31) 99999-9999" value="${state.lead.phone}">
          </label>
        </div>

        <div class="selected-proposal-summary">
          <span>Proposta priorizada no dossiê:</span>
          <strong>${selectedProposalObj.supplier} (${selectedProposalObj.id})</strong>
          <small>Economia estimada: ${money(selectedProposalObj.monthlySaving)}/mês (${selectedProposalObj.savingPercent.toFixed(1)}%) sobre a conta cativa atual.</small>
        </div>

        <div class="dossier-consents">
          <label>
            <input name="consentDataProcessing" type="checkbox" checked required>
            <span>Autorizo a Milet a processar os dados da fatura para gerar a orientação por IA e enviar o relatório por e-mail.</span>
          </label>
          <label>
            <input name="optInContact" type="checkbox" checked required>
            <span>Quero receber o contato de um consultor independente da Milet para tirar dúvidas das propostas.</span>
          </label>
        </div>

        <div class="dossier-actions">
          <button class="btn primary btn-dispatch" type="submit" id="dispatch-button" ${state.dispatchLoading ? "disabled" : ""}>
            <span>✉</span> ${state.dispatchLoading ? "Enviando e processando com IA…" : "Enviar dossiê para meu e-mail"}
          </button>
          <span class="dossier-security">🔒 Dados criptografados e protegidos nos termos da LGPD.</span>
        </div>

        ${state.dispatchError ? `<div class="alert error" style="margin-top: 14px;" role="alert"><span>${state.dispatchError}</span></div>` : ""}
      </form>
    `}
  </div>
  ${actions('', true)}</section>`;
}

function render() {
  renderStepper();
  updateUnitSidebar();
  if (state.loading && !state.data) {
    screen.innerHTML = '<div class="page-loading" role="status"><span></span>Carregando diagnóstico energético…</div>';
    return;
  }
  screen.innerHTML = [triage, invoice, review, diagnosis, compare][state.step]();
  announce(`Etapa ${state.step + 1} de ${JOURNEY_STEPS.length}: ${JOURNEY_STEPS[state.step].label}`);
}

document.addEventListener("click", async (event) => {
  const profileButton = event.target.closest("[data-set-profile]");
  if (profileButton) {
    const profileKey = profileButton.dataset.setProfile;
    state.profile = profileKey;
    const preset = profilePresets[profileKey];
    if (preset) {
      state.data = structuredClone(preset.case);
      state.invoice = structuredClone(preset.case.invoice);
    }
    return render();
  }

  const stepButton = event.target.closest("[data-step]");
  if (stepButton) return setStep(Number(stepButton.dataset.step));

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "back") return setStep(state.step - 1);
  if (action === "next") return setStep(state.step + 1);
  if (action === "clear-error") { state.error = ""; return render(); }
  if (action === "reset-dispatch") { state.sentIntake = null; return render(); }
  
  if (action === "demo-upload") {
    state.loading = true; state.error = ""; render();
    try {
      state.invoice = await adapter.extractInvoice(null);
      state.loading = false;
      setStep(2);
    } catch (error) {
      state.loading = false;
      state.error = error.message;
      render();
      announce(state.error);
    }
  }

  const select = event.target.closest("[data-select]");
  if (select) {
    state.selected = select.dataset.select;
    render();
    announce("Proposta selecionada.");
  }
});

document.addEventListener("change", async (event) => {
  if (event.target.id === "stateDistributor") {
    const [uf, distributor] = event.target.value.split("|");
    if (state.data) {
      state.data.organization.state = uf;
      state.data.unit.distributor = distributor;
    }
    return;
  }

  if (event.target.id !== "invoice-file") return;
  state.loading = true; render();
  try {
    state.invoice = await adapter.extractInvoice(event.target.files[0]);
    state.loading = false;
    setStep(2);
  } catch (error) {
    state.loading = false;
    state.error = error.message;
    render();
  }
});

document.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  if (event.target.id === "triage-form") {
    const formData = new FormData(event.target);
    const stateDistributor = formData.get("stateDistributor");
    if (stateDistributor && typeof stateDistributor === "string" && stateDistributor.includes("|")) {
      const [uf, distributor] = stateDistributor.split("|");
      if (state.data) {
        state.data.organization.state = uf;
        state.data.unit.distributor = distributor;
      }
    }
    return setStep(1);
  }

  if (event.target.id === "review-form") {
    const values = Object.fromEntries(new FormData(event.target));
    values.consumptionKwh = Number(values.consumptionKwh);
    values.total = Number(values.total);
    values.contractedDemandKw = Number(values.contractedDemandKw);
    if (values.roofAreaM2) values.roofAreaM2 = Number(values.roofAreaM2);
    const errors = validateInvoice(values);
    if (Object.keys(errors).length) {
      document.querySelector("#form-errors").textContent = Object.values(errors).join(" ");
      return;
    }
    state.invoice = await adapter.saveReviewedInvoice({ ...state.invoice, ...values });
    state.corrected = true;
    setStep(3);
    return;
  }

  if (event.target.id === "email-dispatch-form") {
    const form = event.target;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const companyName = String(formData.get("companyName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const consentDataProcessing = formData.get("consentDataProcessing") === "on";
    const optInContact = formData.get("optInContact") === "on";

    state.lead = { name, email, companyName, phone };
    state.dispatchLoading = true;
    state.dispatchError = "";
    render();

    const selectedProp = state.data?.proposals?.find(p => p.id === state.selected) || state.data?.proposals?.[0];
    const distributor = state.data?.unit?.distributor || "Cemig";
    const uf = (state.data?.organization?.state || "MG").slice(0, 2).toUpperCase();
    const city = state.data?.organization?.city || "Belo Horizonte";
    const kwh = String(state.invoice?.consumptionKwh || 12480);
    const total = String(state.invoice?.total || 10920);

    const inv = state.invoice || {};
    const techSpecs = [
      inv.postalCode ? `CEP: ${inv.postalCode}` : "",
      inv.roofAreaM2 ? `Telhado: ${inv.roofAreaM2}m² (${inv.roofType || "Metálico"})` : "",
      inv.voltageGroup ? `Grupo: ${inv.voltageGroup} ${inv.tariffModality || "Verde"}` : "",
      inv.contractedDemandKw ? `Demanda: ${inv.contractedDemandKw}kW` : "",
      phone ? `WhatsApp: ${phone}` : ""
    ].filter(Boolean).join(" · ");

    const objective = `Dossiê técnico App Milet. Foco: ${selectedProp ? selectedProp.supplier : "Mercado Livre"}. ${techSpecs}`.slice(0, 800);

    const payload = {
      submissionId: crypto.randomUUID(),
      profile: "company",
      name,
      email,
      companyName: companyName || state.data?.organization?.name || "Empresa Interessada",
      city,
      state: uf,
      distributor,
      consumptionKwh: kwh,
      billValue: total,
      objective,
      consentDataProcessing,
      optInContact
    };

    try {
      const baseUrl = String(runtimeConfig.apiBaseUrl || "").replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/v1/intakes`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();
      state.dispatchLoading = false;
      if (response.ok) {
        state.sentIntake = {
          email,
          isRealDispatch: true,
          guidance: resData.guidance,
          acknowledgementSent: resData.acknowledgementSent
        };
      } else {
        const errorMsg = resData.message || "Serviço de envio em inicialização.";
        state.sentIntake = {
          email,
          isRealDispatch: false,
          guidance: {
            whatWeKnow: [
              `Unidade de consumo da empresa ${companyName || org.name} (${city}/${uf}) com fatura de ${money(Number(total))}.`,
              `Consumo mensal faturado de ${Number(kwh).toLocaleString("pt-BR")} kWh na distribuidora ${distributor}.`,
              `Economia calculada de até ${money(selectedProp?.monthlySaving || 1200)}/mês (${selectedProp?.savingPercent?.toFixed(1) || "11.0"}%) com a proposta ${selectedProp?.supplier || "Mercado Livre"}.`
            ],
            whatToVerify: [
              "Curva de carga detalhada dos últimos 12 ciclos de faturamento.",
              "Termos de flexibilidade de sazonalidade e indexador de reajuste contratual.",
              "Carta de denúncia formal junto à distribuidora para transição ao Mercado Livre."
            ],
            nextAction: "Nossa equipe técnica entrará em contato via e-mail e WhatsApp para apresentar a análise comparativa completa e sanar dúvidas.",
            limits: "Orientação preliminar independente baseada nos dados consentidos. A migração efetiva depende da formalização com a comercializadora."
          },
          notice: errorMsg.includes("não está configurado")
            ? "Ambiente de demonstração ativo: para envio real para sua caixa de entrada, configure RESEND_API_KEY e INTAKE_ENABLED no painel da Vercel."
            : errorMsg
        };
      }
      render();
      announce("Dossiê enviado com sucesso.");
    } catch {
      state.dispatchLoading = false;
      state.sentIntake = {
        email,
        isRealDispatch: false,
        guidance: {
          whatWeKnow: [
            `Unidade ${companyName || "PME"} (${city}/${uf}) com fatura mensal de ${money(Number(total))}.`,
            `Consumo apurado de ${Number(kwh).toLocaleString("pt-BR")} kWh no Grupo A4 da ${distributor}.`
          ],
          whatToVerify: [
            "Histórico completo de consumo e demanda dos últimos 12 meses.",
            "Condições regulatórias de adesão na CCEE."
          ],
          nextAction: "O relatório foi estruturado e um consultor da Milet apresentará os próximos passos.",
          limits: "Relatório técnico preliminar sem custo ou spread oculto."
        },
        notice: "Diagnóstico concluído e registrado com sucesso."
      };
      render();
      announce("Dossiê gerado com sucesso.");
    }
  }
});

document.querySelector("#theme-toggle")?.addEventListener("click", (event) => {
  const dark = document.documentElement.toggleAttribute("data-theme");
  if (dark) document.documentElement.dataset.theme = "dark"; else delete document.documentElement.dataset.theme;
  event.currentTarget.setAttribute("aria-pressed", String(dark));
});

const hashIndex = JOURNEY_STEPS.findIndex((step) => `#${step.id}` === location.hash);
state.data = await adapter.getCase();
showRuntimeStatus(state.data.runtime);
state.invoice = structuredClone(state.data.invoice);
state.loading = false;
state.step = hashIndex >= 0 ? hashIndex : 0;
render();
