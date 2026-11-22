import { NextResponse } from "next/server";
import type { PortalSession } from "@milet/contracts";
import {
  authenticateDemoAccount,
  computeAuditHash,
  getDefaultPortalPath,
  parseCookieValue,
  PORTAL_SESSION_COOKIE,
  signPortalSession,
  verifyPortalSession
} from "@/lib/portal-auth";

const SESSION_TTL_SECONDS = 8 * 60 * 60;

export async function GET(request: Request) {
  const token = parseCookieValue(request.headers.get("cookie"), PORTAL_SESSION_COOKIE);
  const session = await verifyPortalSession(token);
  if (!session) {
    return NextResponse.json({ authenticated: false, session: null }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, session }, { status: 200 });
}

export async function POST(request: Request) {
  let body: { email?: string; role?: string };
  try {
    body = (await request.json()) as { email?: string; role?: string };
  } catch {
    return NextResponse.json({ message: "Payload JSON inválido." }, { status: 400 });
  }

  const identifier = String(body.email || body.role || "");
  const account = authenticateDemoAccount(identifier);
  if (!account) {
    return NextResponse.json(
      { message: "Perfil de acesso não reconhecido para ambiente de demonstração." },
      { status: 400 }
    );
  }

  const now = Date.now();
  const session: PortalSession = {
    ...account,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_SECONDS * 1000
  };
  const token = await signPortalSession(session);
  const redirectTo = getDefaultPortalPath(session.role);
  const auditHash = await computeAuditHash(`PORTAL_LOGIN|${session.tenantId}|${session.role}|${now}`);

  const response = NextResponse.json(
    { ok: true, session, redirectTo, auditHash },
    { status: 201 }
  );
  response.cookies.set(PORTAL_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(PORTAL_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}
