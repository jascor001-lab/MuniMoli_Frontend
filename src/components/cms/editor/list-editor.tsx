"use client";

import type { ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Plus,
  Trash2,
} from "lucide-react";

type Props<T> = {
  title: string;
  description?: string;
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  getTitle: (item: T, index: number) => string;
  renderItem: (
    item: T,
    index: number,
    update: (patch: Partial<T> | T) => void,
  ) => ReactNode;
  emptyLabel?: string;
};

export function ListEditor<T extends object>({
  title,
  description,
  items,
  onChange,
  createItem,
  getTitle,
  renderItem,
  emptyLabel = "Aún no hay elementos. Agrega el primero.",
}: Props<T>) {
  function updateAt(index: number, patch: Partial<T> | T) {
    onChange(
      items.map((item, i) =>
        i === index
          ? ({ ...item, ...(patch as object) } as T)
          : item,
      ),
    );
  }

  function removeAt(index: number) {
    if (!confirm("¿Eliminar este elemento?")) return;
    onChange(items.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    const copy = [...items];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item);
    onChange(copy);
  }

  function duplicate(index: number) {
    const item = items[index];
    const clone = JSON.parse(JSON.stringify(item)) as T;
    if ("id" in clone && typeof (clone as { id?: unknown }).id === "string") {
      (clone as { id: string }).id = `${(clone as { id: string }).id}-copia`;
    }
    if ("slug" in clone && typeof (clone as { slug?: unknown }).slug === "string") {
      (clone as { slug: string }).slug = `${(clone as { slug: string }).slug}-copia`;
    }
    const copy = [...items];
    copy.splice(index + 1, 0, clone);
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-molina-deep">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-molina-muted">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onChange([...items, createItem()])}
          className="inline-flex items-center gap-1.5 rounded-xl bg-molina-teal px-3.5 py-2 text-sm font-bold text-white hover:bg-molina-deep"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-molina-muted">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <details
              key={index}
              open={index === 0 || items.length <= 3}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-molina-deep">
                    {index + 1}. {getTitle(item, index)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    title="Subir"
                    onClick={(e) => {
                      e.preventDefault();
                      move(index, -1);
                    }}
                    className="rounded-lg p-1.5 text-molina-muted hover:bg-slate-100 hover:text-molina-deep"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Bajar"
                    onClick={(e) => {
                      e.preventDefault();
                      move(index, 1);
                    }}
                    className="rounded-lg p-1.5 text-molina-muted hover:bg-slate-100 hover:text-molina-deep"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Duplicar"
                    onClick={(e) => {
                      e.preventDefault();
                      duplicate(index);
                    }}
                    className="rounded-lg p-1.5 text-molina-muted hover:bg-slate-100 hover:text-molina-deep"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Eliminar"
                    onClick={(e) => {
                      e.preventDefault();
                      removeAt(index);
                    }}
                    className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </summary>
              <div className="space-y-3 border-t border-slate-100 px-4 py-4">
                {renderItem(item, index, (patch) => updateAt(index, patch))}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

export function StringListEditor({
  label,
  items,
  onChange,
  placeholder = "Nuevo ítem",
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-molina-deep">{label}</p>
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="text-xs font-bold text-molina-teal hover:underline"
        >
          + Agregar línea
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={item}
              placeholder={placeholder}
              onChange={(e) =>
                onChange(
                  items.map((v, i) => (i === index ? e.target.value : v)),
                )
              }
              className="h-10 flex-1 rounded-lg border border-slate-300 px-3 text-sm"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="rounded-lg px-2 text-red-600 hover:bg-red-50"
              aria-label="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
