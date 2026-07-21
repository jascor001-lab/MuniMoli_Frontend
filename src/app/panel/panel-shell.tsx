"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  FileImage,
  FileText,
  LayoutDashboard,
  LogOut,
  Newspaper,
  PanelLeftOpen,
  Settings2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CmsSessionUser } from "@/lib/cms/permissions";

type SidebarSection = {
  id: string;
  label: string;
  description: string;
};

const SECTION_ICON: Record<string, typeof Newspaper> = {
  home: FileImage,
  noticias: Newspaper,
  contacto: Settings2,
  tramites: FileText,
  talleres: FileImage,
  muniservicios: Settings2,
  "gestion-municipal": Settings2,
  integridad: FileText,
  "normas-legales": FileText,
  "molina-tv": FileImage,
  "gobierno-digital": Settings2,
  "control-interno": FileText,
  "nav-global": Settings2,
};

const SIDEBAR_STORAGE_KEY = "munimol-panel-sidebar-collapsed";

export function PanelShell({
  user,
  sections,
  children,
}: {
  user: CmsSessionUser;
  sections: SidebarSection[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored != null) setCollapsed(stored === "1");
  }, []);

  function toggleSidebar() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  async function logout() {
    await fetch("/api/cms/login", { method: "DELETE" });
    router.replace("/acceso-interno");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-molina-deep hover:bg-slate-50"
              aria-label={collapsed ? "Mostrar menú" : "Ocultar menú"}
              title={collapsed ? "Mostrar menú" : "Ocultar menú"}
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>
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

      <div className="flex">
        <aside
          className={cn(
            "sticky top-[57px] hidden h-[calc(100vh-57px)] shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out sm:flex",
            collapsed ? "w-16" : "w-64",
          )}
        >
          <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2">
            <ul className="space-y-1">
              {sections.map((section) => {
                const Icon = SECTION_ICON[section.id] || Settings2;
                const href = `/panel/seccion/${section.id}`;
                const active = pathname === href;
                return (
                  <li key={section.id}>
                    <Link
                      href={href}
                      title={collapsed ? section.label : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-semibold transition",
                        active
                          ? "bg-molina-deep text-white"
                          : "text-molina-deep hover:bg-emerald-50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition",
                          active
                            ? "bg-white/15 text-white"
                            : "bg-emerald-50 text-molina-teal group-hover:bg-white",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span
                        className={cn(
                          "truncate transition-opacity duration-200",
                          collapsed && "pointer-events-none opacity-0",
                        )}
                      >
                        {section.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-slate-200 p-2">
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-semibold text-molina-muted transition hover:bg-slate-50"
              aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <ChevronLeft
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    collapsed && "rotate-180",
                  )}
                />
              </span>
              <span
                className={cn(
                  "truncate transition-opacity duration-200",
                  collapsed && "pointer-events-none opacity-0",
                )}
              >
                Contraer
              </span>
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
