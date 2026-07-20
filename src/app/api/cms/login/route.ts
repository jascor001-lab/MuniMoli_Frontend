import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword } from "@/lib/cms/password";
import {
  clearSessionCookieOptions,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/cms/session";
import { findUserByUsername, publicUser } from "@/lib/cms/users-store";

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

    const user = findUserByUsername(username);
    if (!user || !user.active || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
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
      user: publicUser(user),
    });
    response.cookies.set(sessionCookieOptions(token));
    return response;
  } catch {
    return NextResponse.json({ error: "No se pudo iniciar sesión" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  const jar = await cookies();
  jar.set(clearSessionCookieOptions());
  response.cookies.set(clearSessionCookieOptions());
  return response;
}
