import { NextResponse, type NextRequest } from "next/server";
import {
  canAccessPortalPath,
  computeAuditHash,
  getDefaultPortalPath,
  PORTAL_SESSION_COOKIE,
  verifyPortalSession
} from "@/lib/portal-auth";

export const config = {
  matcher: ["/portal/:path*"]
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(PORTAL_SESSION_COOKIE)?.value;
  const session = await verifyPortalSession(token);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/portal" || pathname === "/portal/") {
    return NextResponse.redirect(new URL(getDefaultPortalPath(session.role), request.url));
  }

  if (!canAccessPortalPath(session.role, pathname)) {
    const auditHash = await computeAuditHash(
      `RBAC_DENIED|${session.tenantId}|${session.role}|${pathname}`
    );
    return NextResponse.json(
      {
        error: "Acesso negado para este perfil no portal solicitado.",
        currentRole: session.role,
        pathname,
        auditHash
      },
      { status: 403 }
    );
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-milet-tenant-id", session.tenantId);
  requestHeaders.set("x-milet-role", session.role);

  return NextResponse.next({
    request: { headers: requestHeaders }
  });
}
