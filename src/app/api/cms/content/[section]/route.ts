import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCmsSession } from "@/lib/cms/session";
import {
  canEditSection,
  isCmsSectionId,
  type CmsSectionId,
} from "@/lib/cms/permissions";
import {
  readSectionContent,
  resetSectionContent,
  sectionHasOverride,
  writeSectionContent,
} from "@/lib/cms/content-store";
import { pathsForSection } from "@/lib/cms/portal-content";

type Ctx = { params: Promise<{ section: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { section } = await context.params;
  if (!isCmsSectionId(section)) {
    return NextResponse.json({ error: "Sección inválida" }, { status: 404 });
  }

  const session = await getCmsSession();
  // Lectura pública permitida para que el portal consuma contenido CMS
  // Escritura sí requiere sesión (PUT/DELETE)
  return NextResponse.json({
    section,
    hasOverride: sectionHasOverride(section),
    data: readSectionContent(section),
    canEdit: session ? canEditSection(session, section) : false,
  });
}

export async function PUT(request: Request, context: Ctx) {
  const session = await getCmsSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { section } = await context.params;
  if (!isCmsSectionId(section)) {
    return NextResponse.json({ error: "Sección inválida" }, { status: 404 });
  }
  if (!canEditSection(session, section)) {
    return NextResponse.json(
      { error: "No tienes permiso para editar esta pestaña" },
      { status: 403 },
    );
  }

  try {
    const body = (await request.json()) as { data?: unknown };
    if (body.data === undefined) {
      return NextResponse.json({ error: "Falta data" }, { status: 400 });
    }
    writeSectionContent(section as CmsSectionId, body.data);
    revalidatePath("/", "layout");
    for (const path of pathsForSection(section as CmsSectionId)) {
      revalidatePath(path);
    }
    return NextResponse.json({
      ok: true,
      section,
      data: body.data,
    });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const session = await getCmsSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { section } = await context.params;
  if (!isCmsSectionId(section)) {
    return NextResponse.json({ error: "Sección inválida" }, { status: 404 });
  }
  if (!canEditSection(session, section)) {
    return NextResponse.json(
      { error: "No tienes permiso para editar esta pestaña" },
      { status: 403 },
    );
  }
  const data = resetSectionContent(section as CmsSectionId);
  revalidatePath("/", "layout");
  for (const path of pathsForSection(section as CmsSectionId)) {
    revalidatePath(path);
  }
  return NextResponse.json({ ok: true, section, data });
}
