"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Users } from "lucide-react";
import type { CmsSessionUser } from "@/lib/cms/permissions";

export function PanelShell({
  user,
  children,
}: {
  user: CmsSessionUser;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/cms/login", { method: "DELETE" });
    router.replace("/acceso-interno");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/panel"
              className="inline-flex items-center gap-2 font-bold text-molina-deep"
            >
              <LayoutDashboard className="h-5 w-5 text-molina-teal" />
              Panel MuniMol
            </Link>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-molina-teal">
              {user.role === "admin" ? "Administrador" : "Editor"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-molina-muted sm:inline">
              {user.displayName}
            </span>
            {user.role === "admin" ? (
              <Link
                href="/panel/usuarios"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-molina-deep hover:bg-slate-50"
              >
                <Users className="h-4 w-4" />
                Usuarios
              </Link>
            ) : null}
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">{children}</div>
    </div>
  );
}
