const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map();

export default async function handler(request, response) {
  if (request.method === "OPTIONS") return response.status(204).end();
  if (request.method !== "POST") return response.status(405).json({ message: "Método não permitido." });

  try {
    checkRateLimit(clientKey(request));
    const result = await processIntake(request.body, process.env, fetch);
    return response.status(200).json(result);
  } catch (error) {
    const status = Number(error?.status) || 500;
    return response.status(status).json({ message: error?.message || "Não foi possível concluir sua solicitação agora." });
  }
}

export async function processIntake(raw, environment, httpFetch) {
  const config = loadConfig(environment);
  const input = validate(raw);
  const guidance = await generateGuidance(input, config, httpFetch);
  await notifyTeam(input, guidance, config, httpFetch);
  const acknowledgementSent = await acknowledgeLead(input, config, httpFetch);
  return { submissionId: input.submissionId, guidance, acknowledgementSent };
}

function loadConfig(environment) {
  if (environment.INTAKE_ENABLED !== "true" || environment.DEMO_DATA_ONLY !== "false") {
    throw problem(503, "O intake real ainda não está configurado neste ambiente.");
  }
  const config = {
    geminiApiKey: clean(environment.GEMINI_API_KEY),
    geminiModel: clean(environment.GEMINI_MODEL) || "gemini-2.5-flash-lite",
    resendApiKey: clean(environment.RESEND_API_KEY),
    resendFrom: clean(environment.RESEND_FROM),
    resendReplyTo: clean(environment.RESEND_REPLY_TO),
    intakeNotificationTo: clean(environment.INTAKE_NOTIFICATION_TO),
  };
  for (const [name, value] of Object.entries({ GEMINI_API_KEY: config.geminiApiKey, RESEND_API_KEY: config.resendApiKey, RESEND_FROM: config.resendFrom, INTAKE_NOTIFICATION_TO: config.intakeNotificationTo })) {
    if (!value) throw problem(503, `${name} não está configurada neste ambiente.`);
  }
  if (!isEmail(config.intakeNotificationTo) || !isAddress(config.resendFrom) || (config.resendReplyTo && !isEmail(config.resendReplyTo))) {
    throw problem(503, "A configuração de e-mail deste ambiente é inválida.");
  }
  return config;
}

async function generateGuidance(input, config, httpFetch) {
  const response = await httpFetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.geminiModel)}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": config.geminiApiKey },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: promptFor(input) }]}],
      generationConfig: { responseMimeType: "application/json", responseSchema: guidanceSchema, temperature: 0.1 },
    }),
  });
  const payload = await safeJson(response);
  if (!response.ok) throw problem(502, "A análise por IA não está disponível agora. Tente novamente mais tarde.");
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  try { return validateGuidance(JSON.parse(String(text))); }
  catch { throw problem(502, "A IA não retornou uma orientação válida. Tente novamente mais tarde."); }
}

async function notifyTeam(input, guidance, config, httpFetch) {
  const response = await sendEmail({
    config, httpFetch, idempotencyKey: `milet-intake/${input.submissionId}`,
    to: [config.intakeNotificationTo], replyTo: input.email,
    subject: `[Milet V2] novo intake ${input.profile === "company" ? "empresa" : "residencial"}`,
    html: teamEmailHtml(input, guidance),
  });
  if (!response.ok) throw problem(502, "Recebemos seus dados, mas não conseguimos encaminhar a solicitação agora. Tente novamente mais tarde.");
}

async function acknowledgeLead(input, config, httpFetch) {
  const response = await sendEmail({
    config, httpFetch, idempotencyKey: `milet-intake-ack/${input.submissionId}`,
    to: [input.email], replyTo: config.resendReplyTo || config.intakeNotificationTo,
    subject: "Recebemos sua solicitação na Milet", html: acknowledgementHtml(input),
  });
  return response.ok;
}

function sendEmail({ config, httpFetch, idempotencyKey, to, replyTo, subject, html }) {
  return httpFetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${config.resendApiKey}`, "content-type": "application/json", "idempotency-key": idempotencyKey },
    body: JSON.stringify({ from: config.resendFrom, to, reply_to: replyTo, subject, html }),
  });
}

function validate(raw) {
  if (!raw || typeof raw !== "object") throw problem(400, "Dados de intake inválidos.");
  const input = {
    submissionId: required(raw.submissionId, "identificador da solicitação", 64), profile: raw.profile,
    name: required(raw.name, "nome", 120), email: required(raw.email, "e-mail", 160).toLowerCase(),
    city: required(raw.city, "cidade", 100), state: required(raw.state, "UF", 2).toUpperCase(),
    distributor: required(raw.distributor, "distribuidora", 120), consumptionKwh: optional(raw.consumptionKwh, 32),
    billValue: optional(raw.billValue, 32), objective: required(raw.objective, "objetivo", 800),
    companyName: optional(raw.companyName, 160), optInContact: raw.optInContact === true,
    consentDataProcessing: raw.consentDataProcessing === true,
  };
  if (!(input.profile === "company" || input.profile === "home")) throw problem(400, "Perfil inválido.");
  if (!/^[0-9a-f-]{36}$/i.test(input.submissionId)) throw problem(400, "Identificador da solicitação inválido.");
  if (!isEmail(input.email)) throw problem(400, "Informe um e-mail válido.");
  if (!/^[A-Z]{2}$/.test(input.state)) throw problem(400, "Informe uma UF válida.");
  if (!input.consentDataProcessing || !input.optInContact) throw problem(400, "São necessários os consentimentos de dados e contato para enviar o intake.");
  if (!input.consumptionKwh && !input.billValue) throw problem(400, "Informe consumo médio ou valor aproximado da conta.");
  if (input.profile === "company" && !input.companyName) throw problem(400, "Informe o nome da empresa.");
  return input;
}

const guidanceSchema = {
  type: "object", properties: {
    whatWeKnow: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
    whatToVerify: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
    nextAction: { type: "string" }, limits: { type: "string" },
  }, required: ["whatWeKnow", "whatToVerify", "nextAction", "limits"],
};

function validateGuidance(value) {
  if (!value || !Array.isArray(value.whatWeKnow) || !Array.isArray(value.whatToVerify) || typeof value.nextAction !== "string" || typeof value.limits !== "string") throw new Error("schema");
  const list = (items) => items.map((item) => String(item).trim()).filter(Boolean).slice(0, 4);
  const guidance = { whatWeKnow: list(value.whatWeKnow), whatToVerify: list(value.whatToVerify), nextAction: String(value.nextAction).trim(), limits: String(value.limits).trim() };
  if (!guidance.whatWeKnow.length || !guidance.whatToVerify.length || !guidance.nextAction || !guidance.limits) throw new Error("schema");
  return guidance;
}

function promptFor(input) {
  return `Você é a triagem explicável da Milet Energia para o Brasil. Analise apenas estes dados consentidos:\n${JSON.stringify(input)}\n\nResponda estritamente no schema JSON solicitado, em pt-BR. Não prometa economia, elegibilidade, cobertura, aprovação, preço, prazo ou conformidade. Não faça cálculo financeiro ou regulatório. Explique contexto conhecido, dados que ainda exigem fatura/proposta/validação humana e uma próxima ação prática. Nunca peça senha, login de distribuidora, CPF/CNPJ completo, documentos completos ou dados bancários.`;
}

function teamEmailHtml(input, guidance) {
  const field = (label, value) => value ? `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>` : "";
  const list = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  return `<h1>Novo intake Milet V2</h1><p>ID: ${escapeHtml(input.submissionId)}</p><table>${field("Perfil", input.profile)}${field("Nome", input.name)}${field("E-mail", input.email)}${field("Empresa", input.companyName)}${field("Cidade/UF", `${input.city}/${input.state}`)}${field("Distribuidora", input.distributor)}${field("Consumo", input.consumptionKwh)}${field("Conta", input.billValue)}${field("Objetivo", input.objective)}</table><h2>IA — o que sabemos</h2>${list(guidance.whatWeKnow)}<h2>Validar</h2>${list(guidance.whatToVerify)}<h2>Próxima ação</h2><p>${escapeHtml(guidance.nextAction)}</p><h2>Limites</h2><p>${escapeHtml(guidance.limits)}</p>`;
}

function acknowledgementHtml(input) {
  const profile = input.profile === "company" ? "sua empresa" : "sua residência";
  return `<h1>Recebemos sua solicitação.</h1><p>Olá, ${escapeHtml(input.name)}.</p><p>A Milet recebeu seu contexto sobre ${profile}. Enviaremos uma orientação inicial e, se fizer sentido, entraremos em contato para entender os próximos passos.</p><p>Esta mensagem confirma o recebimento; ela não representa cotação, elegibilidade, economia, prazo ou contratação.</p><p>Se precisar complementar alguma informação, responda a este e-mail.</p>`;
}

function required(value, field, max) { const result = optional(value, max); if (!result) throw problem(400, `Informe ${field}.`); return result; }
function optional(value, max) { if (value === undefined || value === null || value === "") return undefined; if (typeof value !== "string") throw problem(400, "Formato de dados inválido."); const result = value.replace(/[<>]/g, "").trim(); if (!result || result.length > max) throw problem(400, "Um campo contém um valor inválido ou longo demais."); return result; }
function clean(value) { return typeof value === "string" ? value.trim() : undefined; }
function isEmail(value) { return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function isAddress(value) { return typeof value === "string" && isEmail(value.match(/<([^>]+)>$/)?.[1] ?? value); }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character); }
function problem(status, message) { return { status, message }; }
function clientKey(request) { return String(request.headers?.["x-forwarded-for"] || request.socket?.remoteAddress || "unknown").split(",")[0].trim(); }
function checkRateLimit(key) { const now = Date.now(); const windowAttempts = (attempts.get(key) || []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS); if (windowAttempts.length >= RATE_LIMIT_MAX) throw problem(429, "Muitas tentativas. Tente novamente em alguns minutos."); windowAttempts.push(now); attempts.set(key, windowAttempts); }
async function safeJson(response) { try { return await response.json(); } catch { return undefined; } }
