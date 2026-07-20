"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { CMS_SECTIONS, type CmsSectionId } from "@/lib/cms/permissions";

type PublicUser = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: "admin" | "editor";
  sections: CmsSectionId[];
  active: boolean;
};

const EMPTY = {
  id: "",
  username: "",
  displayName: "",
  email: "",
  role: "editor" as "admin" | "editor",
  sections: [] as CmsSectionId[],
  password: "",
  active: true,
};

export function UsersAdminClient() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/cms/users", { cache: "no-store" });
    const data = (await res.json()) as { users?: PublicUser[]; error?: string };
    if (!res.ok) {
      setError(data.error || "No autorizado");
      setLoading(false);
      return;
    }
    setUsers(data.users || []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function editUser(user: PublicUser) {
    setForm({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      sections: user.sections,
      password: "",
      active: user.active,
    });
    setMessage("");
    setError("");
  }

  function toggleSection(id: CmsSectionId) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.includes(id)
        ? prev.sections.filter((s) => s !== id)
        : [...prev.sections, id],
    }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    const res = await fetch("/api/cms/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "No se pudo guardar");
      return;
    }
    setMessage(form.id ? "Usuario actualizado" : "Usuario creado");
    setForm(EMPTY);
    await load();
  }

  async function removeUser(id: string) {
    if (!confirm("¿Eliminar este usuario?")) return;
    const res = await fetch(`/api/cms/users?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "No se pudo eliminar");
      return;
    }
    setMessage("Usuario eliminado");
    if (form.id === id) setForm(EMPTY);
    await load();
  }

  return (
    <section className="space-y-6">
      <Link
        href="/panel"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-molina-teal hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al panel
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-molina-deep">Usuarios</h1>
        <p className="mt-1 text-sm text-molina-muted">
          Crea administradores (acceso total) o editores con pestañas
          específicas.
        </p>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-molina-deep">
            Cuentas ({users.length})
          </div>
          {loading ? (
            <p className="p-4 text-sm text-molina-muted">Cargando…</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-molina-deep">
                      {user.displayName}{" "}
                      <span className="text-xs font-medium text-molina-muted">
                        @{user.username}
                      </span>
                    </p>
                    <p className="text-xs text-molina-muted">
                      {user.role === "admin"
                        ? "Administrador · todas las pestañas"
                        : `Editor · ${user.sections.length} pestaña(s)`}
                      {!user.active ? " · inactivo" : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editUser(user)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-molina-deep hover:bg-slate-50"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeUser(user.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-bold text-molina-deep">
              {form.id ? "Editar usuario" : "Nuevo usuario"}
            </h2>
            {form.id ? (
              <button
                type="button"
                onClick={() => setForm(EMPTY)}
                className="text-xs font-semibold text-molina-teal hover:underline"
              >
                Limpiar
              </button>
            ) : (
              <Plus className="h-4 w-4 text-molina-mint" />
            )}
          </div>

          <div className="space-y-3">
            <input
              placeholder="Usuario"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
              required
              disabled={Boolean(form.id)}
            />
            <input
              placeholder="Nombre para mostrar"
              value={form.displayName}
              onChange={(e) =>
                setForm((f) => ({ ...f, displayName: e.target.value }))
              }
              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
              required
            />
            <input
              type="email"
              placeholder="Correo"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
              required
            />
            <select
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  role: e.target.value as "admin" | "editor",
                }))
              }
              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
            >
              <option value="editor">Editor (por pestaña)</option>
              <option value="admin">Administrador (todo)</option>
            </select>
            <input
              type="password"
              placeholder={
                form.id
                  ? "Nueva contraseña (opcional)"
                  : "Contraseña (obligatoria)"
              }
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
              required={!form.id}
            />

            {form.role === "editor" ? (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-molina-muted">
                  Pestañas permitidas
                </p>
                <div className="grid max-h-48 gap-1.5 overflow-y-auto rounded-lg border border-slate-200 p-2 sm:grid-cols-2">
                  {CMS_SECTIONS.map((section) => (
                    <label
                      key={section.id}
                      className="flex items-start gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={form.sections.includes(section.id)}
                        onChange={() => toggleSection(section.id)}
                        className="mt-0.5"
                      />
                      <span>{section.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            <label className="flex items-center gap-2 text-sm text-molina-deep">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((f) => ({ ...f, active: e.target.checked }))
                }
              />
              Usuario activo
            </label>

            <button
              type="submit"
              className="h-10 w-full rounded-xl bg-molina-deep text-sm font-bold text-white hover:bg-molina-teal"
            >
              {form.id ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
