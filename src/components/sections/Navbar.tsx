"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Award,
  ChevronDown,
  Contrast,
  Menu,
  Search,
  Type,
  X,
} from "lucide-react";
import { cn, isExternalHref } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MunicipalityLogo } from "@/components/ui/MunicipalityLogo";
import {
  CREDIT_RATING,
  EXTERNAL_LINKS,
  MAIN_NAV_BAR,
  QUICK_ACCESS,
} from "@/data/portal-data";
import type { MainNavItem, NavChild } from "@/types/portal";

function ChildLink({ child }: { child: NavChild }) {
  const isExternal = child.href.startsWith("http");
  const className =
    "block rounded-lg px-3 py-2.5 transition-colors hover:bg-emerald-50";

  const content = (
    <>
      <span className="block text-sm font-semibold text-molina-deep">
        {child.label}
      </span>
      {child.description && (
        <span className="mt-0.5 block text-xs text-molina-muted">
          {child.description}
        </span>
      )}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={child.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={child.href} className={className}>
      {content}
    </Link>
  );
}

function NavItem({ item }: { item: MainNavItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasChildren = Boolean(item.children?.length);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerClass =
    "group relative inline-flex items-center gap-0.5 whitespace-nowrap px-1.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white/90 transition-colors hover:text-white xl:gap-1 xl:px-2.5 xl:text-[11px] xl:tracking-[0.1em]";

  const underline = (
    <span
      className={cn(
        "absolute bottom-0 left-1.5 right-1.5 h-0.5 origin-left rounded-full bg-molina-mint-light transition-transform duration-300 xl:left-2.5 xl:right-2.5",
        open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
      )}
      aria-hidden
    />
  );

  if (!hasChildren) {
    if (item.openInNewTab || item.external) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={triggerClass}
        >
          {item.label}
          {underline}
        </a>
      );
    }
    return (
      <Link href={item.href} className={triggerClass}>
        {item.label}
        {underline}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200 xl:h-3.5 xl:w-3.5",
            open && "rotate-180",
          )}
          aria-hidden
        />
        {underline}
      </button>

      <div
        role="menu"
        className={cn(
          "absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-1 transition-all duration-200",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-molina-deep/15">
          {item.children!.map((child) => (
            <div key={child.label} role="none" onClick={() => setOpen(false)}>
              <ChildLink child={child} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = headerSearch.trim();
    window.location.href = query
      ? `/tramites-municipales?q=${encodeURIComponent(query)}`
      : "/tramites-municipales";
  };

  useEffect(() => {
    document.documentElement.classList.toggle("a11y-high-contrast", highContrast);
    document.documentElement.classList.toggle("a11y-large-text", largeText);
  }, [highContrast, largeText]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-gradient-to-r from-molina-deep via-[#0a5c45] to-molina-deep text-white transition-shadow duration-300",
        scrolled && "shadow-lg shadow-molina-deep/30",
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-3 py-2 lg:gap-3 lg:px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.02]"
        >
          <MunicipalityLogo
            variant="dark"
            height={30}
            priority
            className="max-w-[130px] sm:max-w-[160px] lg:max-w-[170px]"
          />
        </Link>

        <form
          onSubmit={handleHeaderSearch}
          className="relative hidden w-[140px] shrink-0 sm:block md:w-[160px] xl:w-[180px]"
          role="search"
        >
          <label htmlFor="header-search" className="sr-only">
            Buscar en el portal
          </label>
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-molina-deep/70"
            aria-hidden
          />
          <input
            id="header-search"
            type="search"
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            placeholder="Buscar…"
            className="h-8 w-full rounded-full border-0 bg-white/95 pl-8 pr-14 text-xs text-molina-ink shadow-sm placeholder:text-molina-muted focus:outline-none focus:ring-2 focus:ring-molina-mint-light/60"
          />
          <button
            type="submit"
            className="absolute right-0.5 top-1/2 -translate-y-1/2 rounded-full bg-molina-teal px-2 py-0.5 text-[10px] font-bold text-white transition-colors hover:bg-molina-mint"
          >
            Ir
          </button>
        </form>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1"
          aria-label="Secciones del portal"
        >
          {MAIN_NAV_BAR.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/muniservicios"
            className="hidden rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-molina-mint-light ring-1 ring-molina-mint-light/50 transition-all hover:bg-white/25 hover:text-white md:inline-flex"
            title="Abrir Muniservicios"
          >
            Muniservicios
          </Link>

          <span
            className="hidden items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-white/80 xl:inline-flex"
            title={CREDIT_RATING.label}
          >
            <Award className="h-3 w-3 text-molina-mint-light" aria-hidden />
            {CREDIT_RATING.shortLabel}
          </span>

          <div className="hidden items-center gap-0.5 border-l border-white/20 pl-1.5 lg:flex">
            <button
              type="button"
              onClick={() => setHighContrast((v) => !v)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/15 hover:text-white",
                highContrast && "bg-white/20 text-white",
              )}
              aria-label="Alternar alto contraste"
              aria-pressed={highContrast}
            >
              <Contrast className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setLargeText((v) => !v)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/15 hover:text-white",
                largeText && "bg-white/20 text-white",
              )}
              aria-label="Aumentar tamaño de texto"
              aria-pressed={largeText}
            >
              <Type className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/25 bg-white/10 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
          >
            <Menu className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-molina-ink/50 backdrop-blur-sm transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-y-0" : "translate-y-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-4">
            <span className="font-bold text-molina-deep">Menú del portal</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleHeaderSearch} className="border-b border-slate-100 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-molina-muted" />
              <input
                type="search"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Buscar trámites, pagos…"
                className="h-11 w-full rounded-full border border-slate-200 pl-10 pr-4 text-sm text-molina-ink"
              />
            </div>
          </form>

          <nav className="space-y-1 p-4" aria-label="Secciones principales">
            {MAIN_NAV_BAR.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide text-molina-deep transition-colors hover:bg-emerald-50"
                >
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="mb-1 ml-3 space-y-0.5 border-l-2 border-molina-mint/30 pl-3">
                    {item.children.map((child) => {
                      const isExternal = child.href.startsWith("http");
                      const childClass =
                        "block rounded-lg px-3 py-2 text-xs font-semibold text-molina-teal hover:bg-emerald-50";
                      if (isExternal) {
                        return (
                          <a
                            key={child.label}
                            href={child.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileOpen(false)}
                            className={childClass}
                          >
                            {child.label}
                          </a>
                        );
                      }
                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className={childClass}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            <p className="px-4 py-2 text-[11px] font-medium text-molina-muted">
              {CREDIT_RATING.label}
            </p>
          </nav>

          <div className="border-t border-slate-100 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-molina-muted">
              Accesos directos
            </p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACCESS.map((item) => {
                const external =
                  isExternalHref(item.href) || Boolean(item.external);
                const openBlank = external || Boolean(item.openInNewTab);
                const className =
                  "rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left text-xs font-semibold text-molina-ink transition-colors hover:border-molina-mint/40 hover:bg-emerald-50";
                if (external || openBlank) {
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target={openBlank ? "_blank" : undefined}
                      rel={openBlank ? "noopener noreferrer" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={className}
                    >
                      {item.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={className}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 p-4">
            <a
              href={EXTERNAL_LINKS.transparencia}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
            >
              <Button variant="outline" className="w-full">
                Portal de Transparencia
              </Button>
            </a>
            <Link
              href="/muniservicios"
              onClick={() => setMobileOpen(false)}
            >
              <Button className="w-full">Muniservicios</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
