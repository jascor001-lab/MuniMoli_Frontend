"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LockKeyhole, Shield } from "lucide-react";

export function AccesoInternoLogin() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "same-origin",
      });

      let data: { error?: string; ok?: boolean; warning?: string } = {};
      try {
        data = (await res.json()) as typeof data;
      } catch {
        setError(
          res.ok
            ? "Respuesta inválida del servidor"
            : `Error HTTP ${res.status} al iniciar sesión`,
        );
        return;
      }

      if (!res.ok) {
        setError(data.error || `No se pudo iniciar sesión (${res.status})`);
        return;
      }

      const next = searchParams.get("next") || "/panel";
      const target = next.startsWith("/panel") ? next : "/panel";
      // Navegación completa para que el navegador aplique las cookies de sesión
      window.location.assign(target);
    } catch {
      setError("Error de conexión con el servidor Next");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-emerald-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-molina-deep text-white">
            <Shield className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-molina-muted">
              Acceso interno
            </p>
            <h1 className="text-xl font-bold text-molina-deep">
              Gestión del portal
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-molina-muted">
          Ingresa con tu usuario institucional para administrar o editar
          contenidos por pestaña.
        </p>
        <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-molina-muted">
          Usuario seed: <strong>admin</strong> · Clave:{" "}
          <strong>AdminMolina2026</strong>
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-molina-deep">
              Usuario
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-molina-mint focus:ring-2 focus:ring-molina-mint/20"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-molina-deep">
              Contraseña
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-molina-mint focus:ring-2 focus:ring-molina-mint/20"
              required
            />
          </label>

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-molina-deep text-sm font-bold text-white transition hover:bg-molina-teal disabled:opacity-60"
          >
            <LockKeyhole className="h-4 w-4" aria-hidden />
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
