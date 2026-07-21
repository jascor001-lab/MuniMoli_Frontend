import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword } from "@/lib/cms/password";
import {
  clearSessionCookieOptions,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/cms/session";
import { findUserByUsername, publicUser } from "@/lib/cms/users-store";
import type { CmsRole, CmsSectionId } from "@/lib/cms/permissions";
import { getNestApiBaseUrl, isNestApiEnabled } from "@/lib/api/nest-client";

const NEST_JWT_COOKIE = "munimol_nest_jwt";
const NEST_LOGIN_TIMEOUT_MS = 12_000;

type NestLoginResponse = {
  accessToken: string;
  usuario: {
    id: string;
    nombreUsuario: string;
    nombreMostrar: string;
    correo: string;
    rol?: { codigo?: string } | null;
  };
};

type NestLoginResult =
  | { kind: "ok"; data: NestLoginResponse }
  | { kind: "unauthorized"; message: string }
  | { kind: "error"; message: string }
  | { kind: "unreachable" };

function nestErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const msg = (body as { message?: unknown }).message;
  if (typeof msg === "string" && msg.trim()) return msg;
  if (Array.isArray(msg) && msg.length) return msg.map(String).join("; ");
  return fallback;
}

async function loginViaNest(
  username: string,
  password: string,
): Promise<NestLoginResult> {
  if (!isNestApiEnabled()) return { kind: "unreachable" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NEST_LOGIN_TIMEOUT_MS);

  try {
    const res = await fetch(`${getNestApiBaseUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreUsuario: username,
        contrasena: password,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    const text = await res.text();
    let parsed: unknown = null;
    if (text) {
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        parsed = null;
      }
    }

    if (res.status === 401 || res.status === 400) {
      return {
        kind: "unauthorized",
        message: nestErrorMessage(
          parsed,
          res.status === 400
            ? "Datos de acceso inválidos"
            : "Credenciales inválidas (Nest)",
        ),
      };
    }

    if (!res.ok) {
      return {
        kind: "error",
        message: nestErrorMessage(
          parsed,
          `Nest respondió ${res.status}. Revisa que el backend esté en marcha.`,
        ),
      };
    }

    const data = parsed as NestLoginResponse | null;
    if (!data?.accessToken || !data.usuario) {
      return {
        kind: "error",
        message: "Nest respondió sin token de sesión",
      };
    }

    return { kind: "ok", data };
  } catch (err) {
    const aborted =
      err instanceof Error &&
      (err.name === "AbortError" || err.message.includes("abort"));
    return {
      kind: aborted ? "error" : "unreachable",
      message: aborted
        ? "Tiempo de espera agotado al contactar Nest (:3001)"
        : "No se pudo contactar Nest",
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };
    const username = body.username?.trim() ?? "";
    const password = body.password ?? "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son obligatorios" },
        { status: 400 },
      );
    }

    // 1) Preferir Nest (PostgreSQL + JWT)
    const nest = await loginViaNest(username, password);

    if (nest.kind === "ok") {
      const roleCodigo = nest.data.usuario.rol?.codigo;
      const role: CmsRole =
        roleCodigo === "admin" || roleCodigo === "editor"
          ? roleCodigo
          : "editor";

      const sessionUser = {
        id: nest.data.usuario.id,
        username: nest.data.usuario.nombreUsuario,
        displayName: nest.data.usuario.nombreMostrar,
        email: nest.data.usuario.correo,
        role,
        sections: [] as CmsSectionId[],
      };

      const token = createSessionToken(sessionUser);
      const response = NextResponse.json({
        ok: true,
        source: "nest",
        user: {
          id: sessionUser.id,
          username: sessionUser.username,
          displayName: sessionUser.displayName,
          email: sessionUser.email,
          role: sessionUser.role,
          sections: sessionUser.sections,
          active: true,
        },
      });
      response.cookies.set(sessionCookieOptions(token));
      response.cookies.set({
        name: NEST_JWT_COOKIE,
        value: nest.data.accessToken,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 12,
      });
      return response;
    }

    if (nest.kind === "unauthorized") {
      return NextResponse.json({ error: nest.message }, { status: 401 });
    }

    if (nest.kind === "error") {
      // Nest respondió mal / timeout: no ocultar el fallo
      return NextResponse.json({ error: nest.message }, { status: 502 });
    }

    // 2) Fallback local (users.json) solo si Nest no está alcanzable
    const user = findUserByUsername(username);
    if (!user || !user.active || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        {
          error:
            "Credenciales incorrectas (Nest no disponible; tampoco coinciden en usuarios locales)",
        },
        { status: 401 },
      );
    }

    const sessionUser = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      sections: user.sections,
    };
    const token = createSessionToken(sessionUser);
    const response = NextResponse.json({
      ok: true,
      source: "local",
      user: publicUser(user),
      warning: "Entraste en modo local: Nest no respondió en :3001",
    });
    response.cookies.set(sessionCookieOptions(token));
    return response;
  } catch {
    return NextResponse.json(
      { error: "No se pudo iniciar sesión" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  const jar = await cookies();
  jar.set(clearSessionCookieOptions());
  jar.set({
    name: NEST_JWT_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set(clearSessionCookieOptions());
  response.cookies.set({
    name: NEST_JWT_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
