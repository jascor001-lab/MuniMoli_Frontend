import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CMS_COOKIE } from "@/lib/cms/session";

/** Solo comprueba presencia/formato de cookie; la firma se valida en el panel (Node). */
function hasCmsCookie(token: string | undefined): boolean {
  if (!token) return false;
  const [body, sig] = token.split(".");
  return Boolean(body && sig);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(CMS_COOKIE)?.value;

  // Proteger el panel: sin cookie → login
  if (pathname.startsWith("/panel")) {
    if (!hasCmsCookie(token)) {
      const loginUrl = new URL("/acceso-interno", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // No redirigir acceso-interno → panel aquí.
  // Si la cookie está presente pero es inválida/expirada, un redirect
  // automático crea un bucle 307 con el panel (que sí valida la firma).
  // La página /acceso-interno redirige solo cuando getCmsSession() es válida.

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/acceso-interno"],
};
