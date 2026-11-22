import { afterEach, describe, expect, it } from "vitest";
import type { PortalSession } from "@milet/contracts";
import {
  authenticateDemoAccount,
  canAccessPortalPath,
  computeAuditHash,
  getDefaultPortalPath,
  getPortalSessionSecret,
  parseCookieValue,
  signPortalSession,
  verifyPortalSession
} from "./portal-auth";

const originalSecret = process.env.MILET_SESSION_SECRET;
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.MILET_SESSION_SECRET;
  } else {
    process.env.MILET_SESSION_SECRET = originalSecret;
  }
  (process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv;
});

const SAMPLE_SESSION: PortalSession = {
  userId: "usr-consumidor-padaria",
  tenantId: "t-consumidor-1",
  role: "CONSUMIDOR",
  displayName: "Carlos",
  email: "consumidor@padariahorizonte.com.br",
  issuedAt: 1_700_000_000_000,
  expiresAt: 1_700_010_000_000
};

describe("portal-auth", () => {
  it("resolves session secret from env or development default and fails closed in production", () => {
    delete process.env.MILET_SESSION_SECRET;
    (process.env as Record<string, string | undefined>).NODE_ENV = "test";
    expect(getPortalSessionSecret()).toBe("milet-dev-demo-session-secret-v1");

    process.env.MILET_SESSION_SECRET = "prod-secret-with-more-than-16-chars";
    expect(getPortalSessionSecret()).toBe("prod-secret-with-more-than-16-chars");

    delete process.env.MILET_SESSION_SECRET;
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    expect(() => getPortalSessionSecret()).toThrow("MILET_SESSION_SECRET obrigatório em produção.");
  });

  it("authenticates demo accounts by email or role and rejects unknown inputs", () => {
    expect(authenticateDemoAccount("")).toBeNull();
    expect(authenticateDemoAccount("desconhecido@empresa.com.br")).toBeNull();
    expect(authenticateDemoAccount("CONSUMIDOR")?.tenantId).toBe("t-consumidor-1");
    expect(authenticateDemoAccount("mesa@alvoradaenergia.com.br")?.role).toBe("COMERCIALIZADORA");
  });

  it("signs, verifies, expires and detects tampering on HMAC-SHA256 portal tokens", async () => {
    const secret = "test-secret-key-min-16";
    const token = await signPortalSession(SAMPLE_SESSION, secret);

    const verified = await verifyPortalSession(token, secret, SAMPLE_SESSION.issuedAt + 1000);
    expect(verified).toEqual(SAMPLE_SESSION);

    expect(await verifyPortalSession(undefined, secret)).toBeNull();
    expect(await verifyPortalSession("malformed", secret)).toBeNull();
    expect(await verifyPortalSession("a.b.c", secret)).toBeNull();
    expect(await verifyPortalSession(`${token}tampered`, secret)).toBeNull();
    expect(await verifyPortalSession(token, "wrong-secret-key-min-16")).toBeNull();
    expect(await verifyPortalSession(token, secret, SAMPLE_SESSION.expiresAt)).toBeNull();

    const invalidRoleToken = await signPortalSession(
      { ...SAMPLE_SESSION, role: "INVADIDO" as never },
      secret
    );
    expect(await verifyPortalSession(invalidRoleToken, secret, SAMPLE_SESSION.issuedAt + 1)).toBeNull();

    const invalidBase64Token = "!!!.@@@";
    expect(await verifyPortalSession(invalidBase64Token, secret)).toBeNull();
  });

  it("parses cookie headers, evaluates strict RBAC paths and hashes audit payloads deterministically", async () => {
    expect(parseCookieValue(null, "milet_portal_session")).toBeNull();
    expect(parseCookieValue("other=1; milet_portal_session=tok%3D1; a=2", "milet_portal_session")).toBe(
      "tok=1"
    );
    expect(parseCookieValue("other=1", "milet_portal_session")).toBeNull();

    expect(getDefaultPortalPath("USINA")).toBe("/portal/usinas");
    expect(canAccessPortalPath("CONSUMIDOR", "/portal/consumidor")).toBe(true);
    expect(canAccessPortalPath("CONSUMIDOR", "/portal/consumidor/faturas")).toBe(true);
    expect(canAccessPortalPath("CONSUMIDOR", "/portal/admin")).toBe(false);
    expect(canAccessPortalPath("COMERCIALIZADORA", "/portal/consumidor")).toBe(false);

    const hashA = await computeAuditHash("RBAC_DENIED|CONSUMIDOR|/portal/admin");
    const hashB = await computeAuditHash("RBAC_DENIED|CONSUMIDOR|/portal/admin");
    expect(hashA).toHaveLength(64);
    expect(hashA).toBe(hashB);
  });
});
