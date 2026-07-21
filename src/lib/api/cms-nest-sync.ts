import { cookies } from "next/headers";
import { getNestApiBaseUrl, isNestApiEnabled } from "@/lib/api/nest-client";
import type { CmsSectionId } from "@/lib/cms/permissions";

const NEST_JWT_COOKIE = "munimol_nest_jwt";

const SYNC_SECTIONS = new Set<CmsSectionId>([
  "home",
  "noticias",
  "contacto",
  "tramites",
  "talleres",
  "muniservicios",
  "gestion-municipal",
  "integridad",
  "normas-legales",
  "molina-tv",
  "gobierno-digital",
  "control-interno",
  "nav-global",
]);

function bodyForSection(section: CmsSectionId, data: unknown): unknown {
  if (section === "noticias") {
    return { items: (data as { items?: unknown[] })?.items ?? [] };
  }
  if (section === "tramites") {
    return {
      procedures: (data as { procedures?: unknown[] })?.procedures ?? [],
    };
  }
  return data;
}

/** Lee el shape CMS desde Nest (Postgres). null si falla o vacío no usable. */
export async function fetchCmsSectionFromNest(
  section: CmsSectionId,
): Promise<unknown | null> {
  if (!isNestApiEnabled() || !SYNC_SECTIONS.has(section)) return null;
  try {
    const res = await fetch(`${getNestApiBaseUrl()}/cms-sync/${section}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function syncSectionToNest(
  section: CmsSectionId,
  data: unknown,
): Promise<{ ok: boolean; detail?: string; result?: unknown }> {
  if (!isNestApiEnabled()) {
    return { ok: false, detail: "Nest deshabilitado" };
  }
  if (!SYNC_SECTIONS.has(section)) {
    return { ok: false, detail: `Sección sin sync Nest: ${section}` };
  }

  const jar = await cookies();
  const jwt = jar.get(NEST_JWT_COOKIE)?.value;
  if (!jwt) {
    return { ok: false, detail: "Sin JWT Nest (vuelve a iniciar sesión)" };
  }

  try {
    const res = await fetch(`${getNestApiBaseUrl()}/cms-sync/${section}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(bodyForSection(section, data)),
      cache: "no-store",
    });
    const text = await res.text();
    let parsed: unknown = text;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      /* keep text */
    }
    if (!res.ok) {
      return {
        ok: false,
        detail:
          typeof parsed === "object" && parsed && "message" in parsed
            ? String((parsed as { message: unknown }).message)
            : text || `HTTP ${res.status}`,
      };
    }
    return { ok: true, result: parsed };
  } catch (e) {
    return {
      ok: false,
      detail: e instanceof Error ? e.message : "Error de red",
    };
  }
}
