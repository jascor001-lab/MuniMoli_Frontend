"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  RotateCcw,
  Save,
} from "lucide-react";
import type { CmsSectionId } from "@/lib/cms/permissions";
import { CMS_SECTIONS } from "@/lib/cms/permissions";
import { VisualSectionForm } from "@/components/cms/editor/section-forms";

type Props = {
  sectionId: CmsSectionId;
  sectionLabel: string;
};

export function SectionEditor({ sectionId, sectionLabel }: Props) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [hasOverride, setHasOverride] = useState(false);
  const [source, setSource] = useState<"nest" | "local" | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const [raw, setRaw] = useState("");

  const previewHref =
    CMS_SECTIONS.find((s) => s.id === sectionId)?.href || "/";

  async function load() {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/cms/content/${sectionId}`, {
        cache: "no-store",
      });
      const payload = (await res.json()) as {
        data: unknown;
        hasOverride: boolean;
        source?: "nest" | "local";
        nestReachable?: boolean;
        error?: string;
      };
      if (!res.ok) {
        setError(payload.error || "No se pudo cargar");
        return;
      }
      const next =
        payload.data && typeof payload.data === "object"
          ? (payload.data as Record<string, unknown>)
          : {};
      setData(next);
      setRaw(JSON.stringify(next, null, 2));
      setHasOverride(payload.hasOverride);
      setSource(payload.source === "nest" ? "nest" : "local");
      if (payload.source === "nest") {
        setMessage("Datos cargados desde PostgreSQL (Nest).");
      } else if (payload.nestReachable === false) {
        setMessage(
          "No se pudo contactar el API Nest (¿está en :3001?). Se muestran datos locales. Arranca el backend y pulsa «Subir a BD».",
        );
      } else {
        setMessage(
          "La BD no tiene filas para esta sección (o están vacías). Pulsa «Subir a BD» para guardar lo que ves en Postgres.",
        );
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [sectionId]);

  async function save(payload?: Record<string, unknown>) {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      let bodyData: unknown = payload ?? data;
      if (advanced) {
        bodyData = JSON.parse(raw) as unknown;
      }
      if (!bodyData || typeof bodyData !== "object") {
        setError("No hay datos para guardar");
        return;
      }
      const res = await fetch(`/api/cms/content/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: bodyData }),
      });
      const result = (await res.json()) as {
        error?: string;
        nestSync?: { ok?: boolean; detail?: string };
        source?: string;
      };
      if (!res.ok) {
        setError(result.error || "No se pudo guardar");
        return;
      }
      const next = bodyData as Record<string, unknown>;
      setData(next);
      setRaw(JSON.stringify(next, null, 2));
      setHasOverride(true);
      if (result.nestSync?.ok) {
        setSource("nest");
        setMessage("Guardado en PostgreSQL correctamente.");
        // Relee BD para traer ids y estado real (evita lista desfasada)
        await load();
      } else {
        setSource("local");
        setError(
          `Guardado local OK, pero Nest falló: ${result.nestSync?.detail || "sin detalle"}. Revisa login (JWT) y que el backend esté en :3001.`,
        );
      }
    } catch {
      setError(
        advanced
          ? "El modo avanzado tiene un error de formato"
          : "No se pudo guardar",
      );
    } finally {
      setSaving(false);
    }
  }

  async function reloadFromDb() {
    if (
      !confirm(
        "¿Recargar desde PostgreSQL?\n\nSe descartarán cambios no guardados en este formulario. La base de datos NO se modifica.",
      )
    ) {
      return;
    }
    await load();
  }

  async function resetToSeedTemplate() {
    if (
      !confirm(
        "⚠️ PELIGRO: esto carga la plantilla del CÓDIGO (no tu BD).\n\nSi después pulsas «Guardar», Postgres tomará solo lo que veas aquí y el resto de trámites quedará inactivo.\n\n¿Continuar solo con la plantilla en el editor?",
      )
    ) {
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/cms/content/${sectionId}`, {
        method: "DELETE",
      });
      const result = (await res.json()) as {
        data?: unknown;
        error?: string;
      };
      if (!res.ok) {
        setError(result.error || "No se pudo cargar la plantilla");
        return;
      }
      const next =
        result.data && typeof result.data === "object"
          ? (result.data as Record<string, unknown>)
          : {};
      setData(next);
      setRaw(JSON.stringify(next, null, 2));
      setHasOverride(false);
      setSource("local");
      setMessage(
        "Plantilla del código cargada en el editor (aún no tocó la BD). No guardes si quieres conservar lo de Postgres: usa «Recargar desde BD».",
      );
    } catch {
      setError("Error al cargar la plantilla");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-5">
      <Link
        href="/panel"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-molina-teal hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al panel
      </Link>

      <div className="sticky top-0 z-20 -mx-4 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-molina-deep">
              {sectionLabel}
            </h1>
            <p className="mt-1 text-sm text-molina-muted">
              Completa los campos, sube imágenes o PDF y guarda.{" "}
              {hasOverride
                ? "Versión personalizada activa."
                : "Versión original del portal."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-molina-deep hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" />
              Ver en portal
            </a>
            <button
              type="button"
              onClick={() => void reloadFromDb()}
              disabled={saving || loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-molina-deep hover:bg-slate-50 disabled:opacity-60"
            >
              <RotateCcw className="h-4 w-4" />
              Recargar desde BD
            </button>
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving || loading || !data}
              className="inline-flex items-center gap-1.5 rounded-xl bg-molina-deep px-4 py-2 text-sm font-bold text-white hover:bg-molina-teal disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving
                ? "Guardando…"
                : source === "local"
                  ? "Subir a BD / Guardar"
                  : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>

      {source ? (
        <p
          className={`rounded-xl px-3 py-2 text-sm ${
            source === "nest"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-900"
          }`}
        >
          Fuente actual:{" "}
          <strong>{source === "nest" ? "PostgreSQL" : "JSON local"}</strong>
          {source === "local"
            ? " — pulsa «Subir a BD / Guardar» para sincronizar con Nest/Postgres."
            : null}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}

      {loading || !data ? (
        <p className="text-sm text-molina-muted">Cargando contenido…</p>
      ) : (
        <>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900">
            <strong>Cómo editar:</strong> usa los botones{" "}
            <em>Agregar</em> / <em>Eliminar</em>, sube archivos con{" "}
            <em>Subir archivo</em> y al terminar pulsa{" "}
            <strong>Guardar cambios</strong>.
          </div>

          {!advanced ? (
            <VisualSectionForm
              sectionId={sectionId}
              data={data}
              onChange={(next) => {
                setData(next);
                setRaw(JSON.stringify(next, null, 2));
              }}
            />
          ) : (
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              spellCheck={false}
              className="min-h-[50vh] w-full rounded-2xl border border-slate-300 bg-slate-950 p-4 font-mono text-xs leading-5 text-emerald-100 outline-none focus:ring-2 focus:ring-molina-mint/30 sm:text-sm"
            />
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (!advanced && data) {
                  setRaw(JSON.stringify(data, null, 2));
                } else {
                  try {
                    const parsed = JSON.parse(raw) as Record<string, unknown>;
                    setData(parsed);
                    setError("");
                  } catch {
                    setError("No se pudo pasar a modo visual: JSON inválido");
                    return;
                  }
                }
                setAdvanced((v) => !v);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-molina-muted hover:text-molina-deep"
            >
              <Code2 className="h-3.5 w-3.5" />
              {advanced
                ? "Volver al editor visual"
                : "Modo avanzado (solo soporte técnico)"}
            </button>
            {advanced ? (
              <button
                type="button"
                onClick={() => void resetToSeedTemplate()}
                disabled={saving || loading}
                className="text-xs font-semibold text-amber-800 underline hover:text-amber-950 disabled:opacity-60"
              >
                Cargar plantilla del código (peligroso)
              </button>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
