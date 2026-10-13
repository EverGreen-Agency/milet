const form = document.querySelector("#intake");
const error = document.querySelector("#error");
const result = document.querySelector("#result");
const guidance = document.querySelector("#guidance");
const submit = form.querySelector(".submit");

const copy = {
  company: { kicker: "diagnóstico para empresa", title: "Vamos organizar a sua unidade.", objective: "Ex.: quero entender uma variação na conta ou quais informações preciso reunir antes de avaliar alternativas." },
  home: { kicker: "orientação para a minha casa", title: "Vamos tornar a sua conta mais compreensível.", objective: "Ex.: quero entender minha conta e saber o que preciso verificar antes de considerar uma alternativa." },
};

function setProfile(profile) {
  document.body.dataset.profile = profile;
  form.profile.value = profile;
  const value = copy[profile];
  document.querySelector("#form-kicker").textContent = value.kicker;
  document.querySelector("#form-title").textContent = value.title;
  form.objective.placeholder = value.objective;
  form.companyName.required = profile === "company";
  document.querySelectorAll("[data-profile]").forEach((button) => {
    const active = button.dataset.profile === profile;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  error.textContent = "";
}

document.querySelectorAll("[data-profile]").forEach((button) => button.addEventListener("click", () => setProfile(button.dataset.profile)));

function addSection(title, values) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");
  heading.textContent = title;
  section.append(heading);
  if (Array.isArray(values)) {
    const list = document.createElement("ul");
    values.forEach((value) => { const item = document.createElement("li"); item.textContent = value; list.append(item); });
    section.append(list);
  } else { const paragraph = document.createElement("p"); paragraph.textContent = values; section.append(paragraph); }
  guidance.append(section);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  error.textContent = "";
  if (!form.reportValidity()) return;
  const payload = Object.fromEntries(new FormData(form));
  payload.optInContact = form.optInContact.checked;
  payload.consentDataProcessing = form.consentDataProcessing.checked;
  payload.submissionId = crypto.randomUUID();
  submit.disabled = true;
  submit.innerHTML = "<span>Gerando orientação com cuidado…</span><b>↗</b>";
  try {
    const baseUrl = String(window.MILET_V2_API_BASE_URL || "").replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/v1/intakes`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Não foi possível concluir sua solicitação agora.");
    guidance.replaceChildren();
    addSection("O que já sabemos", data.guidance.whatWeKnow);
    addSection("O que ainda precisa de validação", data.guidance.whatToVerify);
    addSection("Próxima ação", data.guidance.nextAction);
    addSection("Limites desta orientação", data.guidance.limits);
    result.classList.remove("hidden");
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (cause) { error.textContent = cause instanceof Error ? cause.message : "Não foi possível concluir sua solicitação agora."; }
  finally { submit.disabled = false; submit.innerHTML = "<span>Gerar orientação inicial</span><b>→</b>"; }
});

document.querySelector("#restart").addEventListener("click", () => { result.classList.add("hidden"); form.scrollIntoView({ behavior: "smooth", block: "start" }); });
