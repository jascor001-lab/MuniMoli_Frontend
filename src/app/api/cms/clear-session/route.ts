import { NextResponse } from "next/server";
import { clearSessionCookieOptions } from "@/lib/cms/session";

/** Limpia sesión CMS inválida/expirada y vuelve al login (evita bucles 307). */
export async function GET(request: Request) {
  const url = new URL("/acceso-interno", request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set(clearSessionCookieOptions());
  response.cookies.set({
    name: "munimol_nest_jwt",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
