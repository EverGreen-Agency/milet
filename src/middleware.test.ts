import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { config, middleware } from "./middleware";
import {
  getPortalSessionSecret,
  PORTAL_SESSION_COOKIE,
  signPortalSession
} from "@/lib/portal-auth";

async function makeAuthenticatedRequest(
  pathname: string,
  role: "CONSUMIDOR" | "COMERCIALIZADORA" | "USINA" | "ADMIN"
): Promise<NextRequest> {
  const now = Date.now();
  const token = await signPortalSession(
    {
      userId: `usr-${role.toLowerCase()}`,
      tenantId: `t-${role.toLowerCase()}-1`,
      role,
      displayName: role,
      email: `${role.toLowerCase()}@milet.com.br`,
      issuedAt: now,
      expiresAt: now + 60_000
    },
    getPortalSessionSecret()
  );

  return new NextRequest(`https://milet.vercel.app${pathname}`, {
    headers: {
      cookie: `${PORTAL_SESSION_COOKIE}=${token}`
    }
  });
}

describe("portal RBAC middleware", () => {
  it("protects /portal/:path*", () => {
    expect(config.matcher).toEqual(["/portal/:path*"]);
  });

  it("redirects unauthenticated requests to /login with next parameter", async () => {
    const req = new NextRequest("https://milet.vercel.app/portal/consumidor");
    const res = await middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "https://milet.vercel.app/login?next=%2Fportal%2Fconsumidor"
    );
  });

  it("redirects authenticated visits to /portal or /portal/ to the role portal", async () => {
    const reqRoot = await makeAuthenticatedRequest("/portal", "USINA");
    const resRoot = await middleware(reqRoot);
    expect(resRoot.status).toBe(307);
    expect(resRoot.headers.get("location")).toBe("https://milet.vercel.app/portal/usinas");

    const reqSlash = await makeAuthenticatedRequest("/portal/", "ADMIN");
    const resSlash = await middleware(reqSlash);
    expect(resSlash.status).toBe(307);
    expect(resSlash.headers.get("location")).toBe("https://milet.vercel.app/portal/admin");
  });

  it("returns 403 JSON with immutable audit hash on cross-role portal access", async () => {
    const req = await makeAuthenticatedRequest("/portal/consumidor", "COMERCIALIZADORA");
    const res = await middleware(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.currentRole).toBe("COMERCIALIZADORA");
    expect(body.pathname).toBe("/portal/consumidor");
    expect(body.auditHash).toHaveLength(64);
  });

  it("allows authorized role traffic and forwards tenant context headers", async () => {
    const req = await makeAuthenticatedRequest("/portal/consumidor/faturas", "CONSUMIDOR");
    const res = await middleware(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("x-middleware-request-x-milet-tenant-id")).toBe("t-consumidor-1");
    expect(res.headers.get("x-middleware-request-x-milet-role")).toBe("CONSUMIDOR");
  });
});
