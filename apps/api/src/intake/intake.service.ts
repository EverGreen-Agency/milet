import { BadGatewayException, BadRequestException, Inject, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { TOKENS } from "../tokens";
import type { AppConfig } from "../config/app-config";
import type { ExternalFetch, IntakeGuidance, IntakeRequest } from "./intake.types";

const schema = {
  type: "object",
  properties: {
    whatWeKnow: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
    whatToVerify: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
    nextAction: { type: "string" },
    limits: { type: "string" },
  },
  required: ["whatWeKnow", "whatToVerify", "nextAction", "limits"],
} as const;

@Injectable()
export class IntakeService {
  constructor(
    @Inject(TOKENS.appConfig) private readonly config: AppConfig,
    @Inject(TOKENS.externalFetch) private readonly http: ExternalFetch,
  ) {}

  async submit(raw: IntakeRequest): Promise<{ submissionId: string; guidance: IntakeGuidance }> {
    if (!this.config.intakeEnabled || !this.config.geminiApiKey || !this.config.resendApiKey || !this.config.resendFrom || !this.config.intakeNotificationTo) {
      throw new ServiceUnavailableException("O intake real não está configurado neste ambiente.");
    }
    const input = validate(raw);
    const guidance = await this.generateGuidance(input);
    await this.notifyTeam(input, guidance);
    return { submissionId: input.submissionId, guidance };
  }

  private async generateGuidance(input: IntakeRequest): Promise<IntakeGuidance> {
    const response = await this.http.fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.config.geminiModel!)}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": this.config.geminiApiKey! },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: promptFor(input) }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: schema, temperature: 0.1 },
      }),
    });
    const payload = await safeJson(response);
    if (!response.ok) throw new BadGatewayException("A análise por IA não está disponível agora. Tente novamente mais tarde.");
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    try { return validateGuidance(JSON.parse(String(text))); } catch { throw new BadGatewayException("A IA não retornou uma orientação válida. Tente novamente mais tarde."); }
  }

  private async notifyTeam(input: IntakeRequest, guidance: IntakeGuidance): Promise<void> {
    const response = await this.http.fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${this.config.resendApiKey}`, "content-type": "application/json", "idempotency-key": `milet-intake/${input.submissionId}` },
      body: JSON.stringify({
        from: this.config.resendFrom,
        to: [this.config.intakeNotificationTo],
        subject: `[Milet V2] novo intake ${input.profile === "company" ? "empresa" : "residencial"}`,
        html: emailHtml(input, guidance),
      }),
    });
    if (!response.ok) throw new BadGatewayException("Recebemos seus dados, mas não conseguimos encaminhar a solicitação agora. Tente novamente mais tarde.");
  }
}

function validate(raw: IntakeRequest): IntakeRequest {
  if (!raw || typeof raw !== "object") throw new BadRequestException("Dados de intake inválidos.");
  const input: IntakeRequest = {
    submissionId: required(raw.submissionId, "identificador da solicitação", 64),
    profile: raw.profile,
    name: required(raw.name, "nome", 120),
    email: required(raw.email, "e-mail", 160).toLowerCase(),
    city: required(raw.city, "cidade", 100),
    state: required(raw.state, "estado", 2).toUpperCase(),
    distributor: required(raw.distributor, "distribuidora", 120),
    consumptionKwh: optional(raw.consumptionKwh, 32),
    billValue: optional(raw.billValue, 32),
    objective: required(raw.objective, "objetivo", 800),
    companyName: optional(raw.companyName, 160),
    companySize: optional(raw.companySize, 80),
    voltageGroup: optional(raw.voltageGroup, 40),
    propertyType: optional(raw.propertyType, 80),
    optInContact: raw.optInContact === true,
    consentDataProcessing: raw.consentDataProcessing === true,
  };
  if (!(input.profile === "company" || input.profile === "home")) throw new BadRequestException("Perfil inválido.");
  if (!/^[0-9a-f-]{36}$/i.test(input.submissionId)) throw new BadRequestException("Identificador da solicitação inválido.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new BadRequestException("Informe um e-mail válido.");
  if (!/^[A-Z]{2}$/.test(input.state)) throw new BadRequestException("Informe uma UF válida.");
  if (!input.consentDataProcessing || !input.optInContact) throw new BadRequestException("São necessários os consentimentos de dados e contato para enviar o intake.");
  if (!input.consumptionKwh && !input.billValue) throw new BadRequestException("Informe consumo médio ou valor aproximado da conta.");
  if (input.profile === "company" && !input.companyName) throw new BadRequestException("Informe o nome da empresa.");
  return input;
}

function required(value: unknown, field: string, max: number): string {
  const cleaned = optional(value, max);
  if (!cleaned) throw new BadRequestException(`Informe ${field}.`);
  return cleaned;
}

function optional(value: unknown, max: number): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") throw new BadRequestException("Formato de dados inválido.");
  const cleaned = value.replace(/[<>]/g, "").trim();
  if (!cleaned || cleaned.length > max) throw new BadRequestException("Um campo contém um valor inválido ou longo demais.");
  return cleaned;
}

function promptFor(input: IntakeRequest): string {
  return `Você é a triagem explicável da Milet Energia para o Brasil. Analise apenas estes dados consentidos:\n${JSON.stringify(input)}\n\nResponda estritamente no schema JSON solicitado, em pt-BR. Não prometa economia, elegibilidade, cobertura, aprovação, preço, prazo ou conformidade. Não faça cálculo financeiro ou regulatório. Explique contexto conhecido, dados que ainda exigem fatura/proposta/validação humana e uma próxima ação prática. Nunca peça senha, login de distribuidora, CPF/CNPJ completo, documentos completos ou dados bancários.`;
}

function validateGuidance(value: unknown): IntakeGuidance {
  const candidate = value as Partial<IntakeGuidance>;
  if (!candidate || !Array.isArray(candidate.whatWeKnow) || !Array.isArray(candidate.whatToVerify) || typeof candidate.nextAction !== "string" || typeof candidate.limits !== "string") throw new Error("schema");
  const list = (items: unknown[]) => items.map((item) => String(item).trim()).filter(Boolean).slice(0, 4);
  const guidance = { whatWeKnow: list(candidate.whatWeKnow), whatToVerify: list(candidate.whatToVerify), nextAction: String(candidate.nextAction).trim(), limits: String(candidate.limits).trim() };
  if (!guidance.whatWeKnow.length || !guidance.whatToVerify.length || !guidance.nextAction || !guidance.limits) throw new Error("schema");
  return guidance;
}

function emailHtml(input: IntakeRequest, guidance: IntakeGuidance): string {
  const field = (label: string, value: string | undefined) => value ? `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>` : "";
  const list = (items: string[]) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  return `<h1>Novo intake Milet V2</h1><p>ID: ${escapeHtml(input.submissionId)}</p><table>${field("Perfil", input.profile)}${field("Nome", input.name)}${field("E-mail", input.email)}${field("Empresa", input.companyName)}${field("Cidade/UF", `${input.city}/${input.state}`)}${field("Distribuidora", input.distributor)}${field("Consumo", input.consumptionKwh)}${field("Conta", input.billValue)}${field("Objetivo", input.objective)}</table><h2>IA — o que sabemos</h2>${list(guidance.whatWeKnow)}<h2>Validar</h2>${list(guidance.whatToVerify)}<h2>Próxima ação</h2><p>${escapeHtml(guidance.nextAction)}</p><h2>Limites</h2><p>${escapeHtml(guidance.limits)}</p>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

async function safeJson(response: Response): Promise<any> {
  try { return await response.json(); } catch { return undefined; }
}
