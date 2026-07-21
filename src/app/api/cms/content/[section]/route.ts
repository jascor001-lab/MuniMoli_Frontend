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
import {
  fetchCmsSectionFromNest,
  syncSectionToNest,
} from "@/lib/api/cms-nest-sync";

type Ctx = { params: Promise<{ section: string }> };

function hasUsableCmsData(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const o = data as Record<string, unknown>;
  // Si hay alguna clave con array no vacío u objeto con contenido, usamos Nest
  for (const v of Object.values(o)) {
    if (Array.isArray(v) && v.length > 0) return true;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      if (Object.keys(v as object).length > 0) return true;
    }
    if (typeof v === "string" && v.trim()) return true;
    if (typeof v === "number") return true;
  }
  return false;
}

export async function GET(_request: Request, context: Ctx) {
  const { section } = await context.params;
  if (!isCmsSectionId(section)) {
    return NextResponse.json({ error: "Sección inválida" }, { status: 404 });
  }

  const session = await getCmsSession();
  const fromNest = await fetchCmsSectionFromNest(section as CmsSectionId);
  const nestReachable = fromNest !== null;
  const useNest = hasUsableCmsData(fromNest);
  const data = useNest ? fromNest : readSectionContent(section);

  return NextResponse.json({
    section,
    source: useNest ? "nest" : "local",
    nestReachable,
    hasOverride: sectionHasOverride(section),
    data,
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
    // Backup local + fuente de verdad Nest
    writeSectionContent(section as CmsSectionId, body.data);
    const nestSync = await syncSectionToNest(
      section as CmsSectionId,
      body.data,
    );
    revalidatePath("/", "layout");
    for (const path of pathsForSection(section as CmsSectionId)) {
      revalidatePath(path);
    }
    return NextResponse.json({
      ok: true,
      section,
      data: body.data,
      nestSync,
      source: nestSync.ok ? "nest" : "local",
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
  return NextResponse.json({ ok: true, section, data, source: "local" });
}
