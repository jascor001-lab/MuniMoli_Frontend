import { NextResponse } from "next/server";
import { getCmsSession } from "@/lib/cms/session";
import type { CmsSectionId } from "@/lib/cms/permissions";
import {
  deleteUser,
  publicUser,
  readUsers,
  upsertUser,
} from "@/lib/cms/users-store";

async function requireAdmin() {
  const session = await getCmsSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  return NextResponse.json({
    users: readUsers().map(publicUser),
  });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  try {
    const body = (await request.json()) as {
      id?: string;
      username: string;
      displayName: string;
      email: string;
      role: "admin" | "editor";
      sections?: CmsSectionId[];
      password?: string;
      active?: boolean;
    };
    const user = upsertUser({
      id: body.id,
      username: body.username,
      displayName: body.displayName,
      email: body.email,
      role: body.role,
      sections: body.sections ?? [],
      password: body.password,
      active: body.active,
    });
    return NextResponse.json({ user: publicUser(user) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al guardar" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Falta id" }, { status: 400 });
    }
    if (id === session.id) {
      return NextResponse.json(
        { error: "No puedes eliminar tu propia cuenta" },
        { status: 400 },
      );
    }
    deleteUser(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al eliminar" },
      { status: 400 },
    );
  }
}
