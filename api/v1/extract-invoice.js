import crypto from "node:crypto";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp"
]);

const extractionSchema = {
  type: "object",
  properties: {
    distributor: { type: "string", description: "Nome da distribuidora/concessionária (ex: CEMIG, CPFL, Enel, etc)" },
    customerName: { type: "string", description: "Nome do cliente ou Razão Social" },
    documentNumber: { type: "string", description: "CNPJ ou CPF do titular" },
    installationNumber: { type: "string", description: "Número de instalação ou Unidade Consumidora (UC)" },
    city: { type: "string", description: "Cidade da instalação" },
    state: { type: "string", description: "Sigla do Estado (UF)" },
    postalCode: { type: "string", description: "CEP da instalação" },
    voltageGroup: { type: "string", description: "Grupo tarifário (ex: A4, B3, B1)" },
    tariffModality: { type: "string", description: "Modalidade tarifária (ex: Verde, Azul, Convencional)" },
    contractedDemandKw: { type: "number", description: "Demanda contratada em kW, se aplicável (Grupo A)" },
    measuredDemandKw: { type: "number", description: "Demanda medida/faturada em kW, se aplicável" },
    consumptionKwh: { type: "number", description: "Consumo faturado total no ciclo em kWh" },
    totalAmount: { type: "number", description: "Valor total da fatura em reais" },
    dueDate: { type: "string", description: "Data de vencimento no formato AAAA-MM-DD" },
    confidence: {
      type: "object",
      properties: {
        overall: { type: "number", description: "Grau de confiança geral na leitura de 0 a 1" },
        fields: {
          type: "object",
          additionalProperties: { type: "number" }
        }
      },
      required: ["overall"]
    }
  },
  required: ["distributor", "consumptionKwh", "totalAmount"]
};

export default async function handler(request, response) {
  if (request.method === "OPTIONS") return response.status(204).end();
  if (request.method !== "POST") return response.status(405).json({ message: "Método não permitido." });

  try {
    const result = await processInvoiceExtraction(request.body, process.env, fetch);
    return response.status(200).json(result);
  } catch (error) {
    const status = Number(error?.status) || 500;
    return response.status(status).json({
      message: error?.message || "Não foi possível processar a fatura no momento."
    });
  }
}

export async function processInvoiceExtraction(raw, environment, httpFetch) {
  const config = loadExtractionConfig(environment);
  const input = validateExtractionInput(raw);

  const fileBuffer = Buffer.from(input.fileBase64, "base64");
  const fileKey = `invoices/${crypto.randomUUID()}-${sanitizeFileName(input.fileName || "invoice")}`;

  // 1. Arquivar no S3 se configurado
  if (config.s3) {
    try {
      await uploadToS3(fileBuffer, fileKey, input.mimeType, config.s3, httpFetch);
    } catch (s3Err) {
      console.warn("Aviso: Falha ao arquivar no S3:", s3Err.message);
    }
  }

  // 2. Extrair dados via Gemini Multimodal
  const extractedData = await extractWithGemini(input.fileBase64, input.mimeType, config, httpFetch);

  return {
    success: true,
    fileKey,
    data: extractedData
  };
}

function loadExtractionConfig(environment) {
  const apiKey = clean(environment.GEMINI_API_KEY);
  if (!apiKey) {
    throw problem(503, "O serviço de extração por IA não está configurado.");
  }

  let s3 = null;
  if (environment.S3_ENDPOINT && environment.S3_BUCKET && environment.S3_ACCESS_KEY_ID && environment.S3_SECRET_ACCESS_KEY) {
    s3 = {
      endpoint: clean(environment.S3_ENDPOINT),
      region: clean(environment.S3_REGION) || "iad",
      bucket: clean(environment.S3_BUCKET),
      accessKeyId: clean(environment.S3_ACCESS_KEY_ID),
      secretAccessKey: clean(environment.S3_SECRET_ACCESS_KEY)
    };
  }

  return {
    geminiApiKey: apiKey,
    geminiModel: clean(environment.GEMINI_MODEL) || "gemini-2.5-flash-lite",
    s3
  };
}

function validateExtractionInput(raw) {
  if (!raw || typeof raw !== "object") throw problem(400, "Corpo da requisição inválido.");
  const fileBase64 = String(raw.fileBase64 || "").trim();
  const mimeType = String(raw.mimeType || "").trim().toLowerCase();

  if (!fileBase64) throw problem(400, "Arquivo em formato base64 é obrigatório.");
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw problem(400, `Tipo de arquivo inválido. Suportados: ${Array.from(ALLOWED_MIME_TYPES).join(", ")}`);
  }

  return {
    fileBase64,
    mimeType,
    fileName: String(raw.fileName || "invoice").trim()
  };
}

async function extractWithGemini(fileBase64, mimeType, config, httpFetch) {
  const prompt = `Analise atentamente o documento de fatura/conta de energia elétrica em anexo.
Extraia com o máximo de precisão os seguintes campos regulatórios e técnicos brasileiros:
- Distribuidora/concessionária de energia (ex: CEMIG, CPFL, Enel, Light, Neoenergia, etc)
- Nome do cliente/titular ou Razão Social
- CNPJ ou CPF
- Número da instalação / Unidade Consumidora (UC)
- Cidade, Estado (UF) e CEP do local de consumo
- Subgrupo tarifário (ex: A4, A3, B3, B1) e modalidade (Verde, Azul, Convencional)
- Demanda contratada em kW e Demanda medida/faturada em kW (para faturas do Grupo A)
- Consumo total de energia faturado no ciclo em kWh
- Valor total da fatura (R$) e data de vencimento
- Grau de confiança para cada dado extraído.

Se algum dado não estiver legível ou não for aplicável, retorne nulo ou omitido.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.geminiModel)}:generateContent`;

  const response = await httpFetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": config.geminiApiKey
    },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [
          { inlineData: { mimeType, data: fileBase64 } },
          { text: prompt }
        ]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: extractionSchema,
        temperature: 0.1
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw problem(502, `Falha no processamento pelo modelo de IA: ${errorBody.slice(0, 200)}`);
  }

  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw problem(502, "A IA não retornou conteúdo estruturado legível.");

  try {
    return JSON.parse(text);
  } catch {
    throw problem(502, "Erro ao interpretar resposta JSON da IA.");
  }
}

async function uploadToS3(buffer, key, contentType, s3, httpFetch) {
  const endpoint = s3.endpoint.replace(/\/$/, "");
  const url = `${endpoint}/${s3.bucket}/${key}`;

  // Upload simples S3 compatível
  const response = await httpFetch(url, {
    method: "PUT",
    headers: {
      "content-type": contentType,
      "x-amz-content-sha256": crypto.createHash("sha256").update(buffer).digest("hex")
    },
    body: buffer
  });

  return response;
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60);
}

function clean(value) {
  return String(value ?? "").trim();
}

function problem(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}
