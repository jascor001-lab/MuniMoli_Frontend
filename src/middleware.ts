import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CMS_COOKIE } from "@/lib/cms/session";

/** Solo comprueba presencia de cookie; la firma se valida en el panel/API (Node). */
function hasCmsCookie(token: string | undefined): boolean {
  if (!token) return false;
  const [body, sig] = token.split(".");
  return Boolean(body && sig);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(CMS_COOKIE)?.value;

  if (pathname.startsWith("/panel")) {
    if (!hasCmsCookie(token)) {
      const loginUrl = new URL("/acceso-interno", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/acceso-interno" && hasCmsCookie(token)) {
    return NextResponse.redirect(new URL("/panel", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/acceso-interno"],
};
