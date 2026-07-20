"use client";

import { useRef, useState } from "react";
import { FileText, ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { FieldLabel } from "./fields";

type Props = {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  accept?: "image" | "pdf" | "any";
};

export function MediaUpload({
  label,
  hint,
  value,
  onChange,
  accept = "any",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const acceptAttr =
    accept === "image"
      ? "image/jpeg,image/png,image/webp,image/gif"
      : accept === "pdf"
        ? "application/pdf"
        : "image/jpeg,image/png,image/webp,image/gif,application/pdf";

  const isPdf =
    value.toLowerCase().endsWith(".pdf") || value.includes("/docs/");
  const isImage =
    Boolean(value) &&
    !isPdf &&
    (/\.(jpe?g|png|webp|gif)(\?|$)/i.test(value) ||
      value.includes("/images/") ||
      value.startsWith("/uploads/"));

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/cms/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "No se pudo subir");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Error de conexión al subir");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-3">
        {value ? (
          <div className="mb-3 flex items-start gap-3">
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt=""
                className="h-20 w-28 rounded-lg object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="flex h-20 w-28 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
                {isPdf ? (
                  <FileText className="h-8 w-8 text-red-600" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-molina-muted" />
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-molina-deep">
                {value}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-molina-teal hover:underline"
                >
                  Ver archivo
                </a>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Quitar
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-molina-deep px-3 py-2 text-xs font-bold text-white hover:bg-molina-teal disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {uploading ? "Subiendo…" : "Subir archivo"}
          </button>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="O pega una URL…"
            className="h-9 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 text-xs outline-none focus:border-molina-mint"
          />
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          className="hidden"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
        {error ? (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        ) : null}
      </div>
    </div>
  );
}
