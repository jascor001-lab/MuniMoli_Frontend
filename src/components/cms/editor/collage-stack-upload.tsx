"use client";

import { useRef, useState, type DragEvent } from "react";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { FieldLabel } from "./fields";
import { cn } from "@/lib/utils";

export type CollageSlot = { src: string; alt: string };

type Props = {
  label: string;
  hint?: string;
  value: CollageSlot[];
  onChange: (slots: CollageSlot[]) => void;
  max?: number;
};

const EMPTY_SLOT = (index: number): CollageSlot => ({
  src: "",
  alt: `Imagen ${index + 1}`,
});

function normalizeSlots(value: CollageSlot[], max: number): CollageSlot[] {
  const slots = Array.from({ length: max }, (_, i) => ({
    src: String(value[i]?.src || ""),
    alt: String(value[i]?.alt || `Imagen ${i + 1}`),
  }));
  return slots;
}

export function CollageStackUpload({
  label,
  hint = "Arrastra hasta 5 imágenes o haz clic. Se fusionan en diagonal en la portada.",
  value,
  onChange,
  max = 5,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const slots = normalizeSlots(value, max);
  const filled = slots.filter((s) => s.src);
  const count = filled.length;

  async function uploadFile(file: File): Promise<string | null> {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/cms/upload", { method: "POST", body });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) {
      setError(data.error || "No se pudo subir");
      return null;
    }
    return data.url;
  }

  async function addFiles(fileList: FileList | File[] | null) {
    if (!fileList) return;
    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!files.length) {
      setError("Solo se permiten imágenes");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const next = [...slots];
      let cursor = 0;
      for (const file of files) {
        while (cursor < max && next[cursor]?.src) cursor += 1;
        if (cursor >= max) break;
        const url = await uploadFile(file);
        if (!url) continue;
        next[cursor] = {
          src: url,
          alt: next[cursor]?.alt || file.name.replace(/\.[^.]+$/, ""),
        };
        cursor += 1;
      }
      onChange(next);
      setOpen(true);
    } catch {
      setError("Error de conexión al subir");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clearSlot(index: number) {
    const next = slots.map((slot, i) =>
      i === index ? EMPTY_SLOT(i) : slot,
    );
    onChange(next);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    void addFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <FieldLabel hint={hint}>{label}</FieldLabel>

      <div
        className={cn(
          "rounded-xl border border-dashed bg-slate-50/80 p-3 transition",
          dragging
            ? "border-molina-teal bg-emerald-50"
            : "border-slate-300",
        )}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={onDrop}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading || count >= max}
            className="group relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200 transition hover:ring-molina-teal disabled:opacity-60"
            title="Arrastra o haz clic para añadir imágenes"
            aria-label="Añadir imágenes al collage"
          >
            {count > 0 ? (
              <>
                {filled.slice(0, 3).map((slot, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`${slot.src}-${i}`}
                    src={slot.src}
                    alt=""
                    className="absolute h-10 w-10 rounded-md object-cover shadow-sm ring-1 ring-white"
                    style={{
                      left: 10 + i * 6,
                      top: 10 + i * 5,
                      zIndex: i + 1,
                      transform: `rotate(${(i - 1) * 4}deg)`,
                    }}
                  />
                ))}
              </>
            ) : (
              <ImagePlus className="h-7 w-7 text-molina-muted" />
            )}
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-molina-deep text-white shadow ring-2 ring-white">
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <span className="text-sm font-bold leading-none">+</span>
              )}
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-molina-deep">
              Collage {count}/{max}
            </p>
            <p className="text-xs text-molina-muted">
              {dragging
                ? "Suelta las imágenes aquí…"
                : "Arrastra imágenes o pulsa el ícono apilado"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="text-xs font-semibold text-molina-teal hover:underline"
              >
                {open ? "Ocultar detalle" : "Ver / editar las 5"}
              </button>
              {count > 0 ? (
                <button
                  type="button"
                  onClick={() =>
                    onChange(Array.from({ length: max }, (_, i) => EMPTY_SLOT(i)))
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Vaciar
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => void addFiles(e.target.files)}
        />

        {open ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {slots.map((slot, index) => (
              <div
                key={`slot-${index}`}
                className="relative overflow-hidden rounded-lg bg-white ring-1 ring-slate-200"
              >
                {slot.src ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slot.src}
                      alt={slot.alt}
                      className="aspect-square w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => clearSlot(index)}
                      className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-600 shadow"
                      aria-label={`Quitar imagen ${index + 1}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex aspect-square w-full flex-col items-center justify-center gap-1 text-molina-muted hover:bg-emerald-50 hover:text-molina-teal"
                  >
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-[10px] font-semibold">{index + 1}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
