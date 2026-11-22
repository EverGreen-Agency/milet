import type { PortalSession, UserRole } from "@milet/contracts";

export const PORTAL_SESSION_COOKIE = "milet_portal_session";

export const PORTAL_ROLE_PREFIX: Record<UserRole, string> = {
  CONSUMIDOR: "/portal/consumidor",
  COMERCIALIZADORA: "/portal/comercializadora",
  USINA: "/portal/usinas",
  ADMIN: "/portal/admin"
};

export interface DemoPortalAccount {
  userId: string;
  tenantId: string;
  role: UserRole;
  displayName: string;
  email: string;
}

export const DEMO_PORTAL_ACCOUNTS: readonly DemoPortalAccount[] = [
  {
    userId: "usr-consumidor-padaria",
    tenantId: "t-consumidor-1",
    role: "CONSUMIDOR",
    displayName: "Carlos · Padaria Horizonte Ltda",
    email: "consumidor@padariahorizonte.com.br"
  },
  {
    userId: "usr-com-alvorada",
    tenantId: "t-comercializadora-1",
    role: "COMERCIALIZADORA",
    displayName: "Mesa B2B · Alvorada Energia Varejista",
    email: "mesa@alvoradaenergia.com.br"
  },
  {
    userId: "usr-usina-cerrado",
    tenantId: "t-usina-1",
    role: "USINA",
    displayName: "Operação GD · Consórcio Solar Cerrado",
    email: "gestao@solarcerrado.com.br"
  },
  {
    userId: "usr-admin-milet",
    tenantId: "t-admin-milet",
    role: "ADMIN",
    displayName: "Governança · Milet Engine",
    email: "admin@milet.com.br"
  }
];

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(input: string): Uint8Array<ArrayBuffer> {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Resolve o segredo HMAC da sessão dos portais, falhando fechado em produção sem configuração explícita.
 */
export function getPortalSessionSecret(): string {
  const envSecret = process.env.MILET_SESSION_SECRET;
  if (envSecret && envSecret.length >= 16) return envSecret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("MILET_SESSION_SECRET obrigatório em produção.");
  }
  return "milet-dev-demo-session-secret-v1";
}

export function authenticateDemoAccount(emailOrRole: string): DemoPortalAccount | null {
  const normalized = emailOrRole.trim().toLowerCase();
  if (!normalized) return null;
  return (
    DEMO_PORTAL_ACCOUNTS.find(
      (account) =>
        account.email.toLowerCase() === normalized ||
        account.role.toLowerCase() === normalized
    ) ?? null
  );
}

export async function signPortalSession(
  session: PortalSession,
  secret = getPortalSessionSecret()
): Promise<string> {
  const encoder = new TextEncoder();
  const payloadB64 = bytesToBase64Url(encoder.encode(JSON.stringify(session)));
  const key = await importHmacKey(secret);
  const signature = await globalThis.crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  const sigB64 = bytesToBase64Url(new Uint8Array(signature));
  return `${payloadB64}.${sigB64}`;
}

export async function verifyPortalSession(
  token: string | undefined | null,
  secret = getPortalSessionSecret(),
  nowMs = Date.now()
): Promise<PortalSession | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

  try {
    const key = await importHmacKey(secret);
    const sigBytes = base64UrlToBytes(parts[1]);
    const validSig = await globalThis.crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(parts[0])
    );
    if (!validSig) return null;

    const payloadJson = new TextDecoder().decode(base64UrlToBytes(parts[0]));
    const parsed = JSON.parse(payloadJson) as Partial<PortalSession>;
    if (
      typeof parsed.userId !== "string" ||
      typeof parsed.tenantId !== "string" ||
      typeof parsed.role !== "string" ||
      !(parsed.role in PORTAL_ROLE_PREFIX) ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= nowMs
    ) {
      return null;
    }
    return parsed as PortalSession;
  } catch {
    return null;
  }
}

export function parseCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const prefix = `${name}=`;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
}

export function getDefaultPortalPath(role: UserRole): string {
  return PORTAL_ROLE_PREFIX[role];
}

export function canAccessPortalPath(role: UserRole, pathname: string): boolean {
  const prefix = PORTAL_ROLE_PREFIX[role];
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export async function computeAuditHash(input: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input)
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
