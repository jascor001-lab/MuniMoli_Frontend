"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSso } from "@/components/auth/SsoProvider";

export function SsoUserMenu() {
  const { session, isAuthenticated, isLoading, signIn, signOut } = useSso();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div
        className="h-10 w-10 animate-pulse rounded-full bg-slate-200"
        aria-hidden
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => signIn()}
        className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2 shadow-sm transition-shadow hover:shadow-md"
        aria-label="Iniciar sesión con SSO municipal"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-white">
          <User className="h-5 w-5" aria-hidden />
        </span>
        <ChevronDown className="h-4 w-4 text-molina-muted" aria-hidden />
      </button>
    );
  }

  const initials = session!.displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm transition-shadow hover:shadow-md"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Cuenta de ${session!.displayName}`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-molina-teal to-molina-deep text-sm font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-molina-ink md:inline">
          {session!.displayName.split(" ")[0]}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-molina-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-100 bg-white py-2 shadow-xl"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="font-semibold text-molina-ink">{session!.displayName}</p>
            <p className="text-xs text-molina-muted">{session!.email}</p>
            <p className="mt-1 text-xs text-molina-muted">
              {session!.documentType}: {session!.documentNumber}
            </p>
          </div>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-molina-ink hover:bg-emerald-50"
            onClick={() => setOpen(false)}
          >
            <User className="h-4 w-4 text-molina-teal" />
            Mi perfil ciudadano
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
