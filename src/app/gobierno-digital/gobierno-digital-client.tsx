"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { SafeImage } from "@/components/ui/safe-image";
import { type GobiernoDigitalLink } from "@/data/portal-data";
import { usePortalCms } from "@/components/cms/portal-cms";
import { isExternalHref } from "@/lib/utils";

function LinkGrid({
  items,
  accent,
}: {
  items: GobiernoDigitalLink[];
  accent: "servicios" | "aplicaciones";
}) {
  const hover =
    accent === "servicios"
      ? "hover:border-molina-mint/40 hover:bg-emerald-50/70"
      : "hover:border-molina-teal/40 hover:bg-teal-50/70";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const external = isExternalHref(item.href);
        const className = `group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all ${hover}`;
        const content = (
          <>
            {item.imageUrl ? (
              <div className="relative aspect-[16/7] w-full bg-slate-50">
                <SafeImage
                  src={item.imageUrl}
                  alt={item.label}
                  fill
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            ) : null}
            <div className="flex items-start justify-between gap-3 px-3 py-3.5 sm:px-4 sm:py-4">
              <span className="min-w-0 text-sm font-semibold leading-snug text-molina-deep group-hover:text-molina-teal">
                {item.label}
              </span>
              <ArrowUpRight
                className="mt-0.5 h-4 w-4 shrink-0 text-molina-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-molina-teal"
                aria-hidden
              />
            </div>
          </>
        );
        const key = item.id || `${item.href || "link"}-${index}`;

        return (
          <Reveal key={key} variant="up" delayMs={60 + index * 60}>
            {external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link href={item.href} className={className}>
                {content}
              </Link>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}

export function GobiernoDigitalPageClient() {
  const { gobiernoDigital } = usePortalCms();
  const { servicios, aplicaciones } = gobiernoDigital;

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <section className="portal-page-hero">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-molina-teal hover:text-molina-mint"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Link>
              <Badge variant="mint" className="mt-4">
                Gobierno Digital
              </Badge>
              <h1 className="portal-page-title mt-3">Gobierno Digital</h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-molina-muted sm:text-base">
                Proceso continuo, disruptivo, estratégico y de cambio cultural
                que sustenta el uso intensivo de las tecnologías digitales para
                generar valor para las personas.
              </p>
            </Reveal>
          </div>
        </section>

        <section
          id="servicios"
          className="scroll-mt-24 py-12 lg:py-16"
          aria-labelledby="servicios-heading"
        >
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <h2 id="servicios-heading" className="portal-section-title">
                Servicios al ciudadano
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-molina-muted">
                Consultas, trámites, pagos, reclamos y demás servicios digitales
                para vecinas y vecinos.
              </p>
            </Reveal>
            <div className="mt-8">
              <LinkGrid items={servicios} accent="servicios" />
            </div>
          </div>
        </section>

        <section
          id="aplicaciones"
          className="scroll-mt-24 border-t border-slate-100 bg-slate-50/60 py-12 lg:py-16"
          aria-labelledby="aplicaciones-heading"
        >
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <h2 id="aplicaciones-heading" className="portal-section-title">
                Aplicaciones
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-molina-muted">
                Sistemas institucionales para la gestión documental, territorial
                y administrativa.
              </p>
            </Reveal>
            <div className="mt-8">
              <LinkGrid items={aplicaciones} accent="aplicaciones" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
