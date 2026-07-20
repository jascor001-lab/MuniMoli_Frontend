"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  EXTERNAL_LINKS,
  GOBIERNO_DIGITAL_APLICACIONES,
  GOBIERNO_DIGITAL_SERVICIOS,
  type GobiernoDigitalLink,
} from "@/data/portal-data";

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
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <Reveal key={item.id} variant="up" delayMs={60 + index * 60}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all ${hover}`}
          >
            <span className="text-sm font-semibold leading-snug text-molina-deep group-hover:text-molina-teal">
              {item.label}
            </span>
            <ArrowUpRight
              className="mt-0.5 h-4 w-4 shrink-0 text-molina-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-molina-teal"
              aria-hidden
            />
          </a>
        </Reveal>
      ))}
    </div>
  );
}

export function GobiernoDigitalPageClient() {
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
        <section className="border-b border-emerald-900/10 bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-10 lg:py-14">
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
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-molina-deep sm:text-4xl">
                Gobierno Digital
              </h1>
              <p className="mt-2 max-w-3xl text-molina-muted">
                Proceso continuo, disruptivo, estratégico y de cambio cultural
                que sustenta el uso intensivo de las tecnologías digitales para
                generar valor para las personas. Enlaces oficiales del portal
                municipal.
              </p>
              <a
                href={EXTERNAL_LINKS.gobiernoDigital}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-molina-teal hover:underline"
              >
                Ver en portal.munimolina.gob.pe
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
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
              <h2
                id="servicios-heading"
                className="text-2xl font-bold text-molina-deep"
              >
                Servicios al ciudadano
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-molina-muted">
                Consultas, trámites, pagos, reclamos y demás servicios digitales
                para vecinas y vecinos.
              </p>
            </Reveal>
            <div className="mt-8">
              <LinkGrid items={GOBIERNO_DIGITAL_SERVICIOS} accent="servicios" />
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
              <h2
                id="aplicaciones-heading"
                className="text-2xl font-bold text-molina-deep"
              >
                Aplicaciones
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-molina-muted">
                Sistemas institucionales para la gestión documental, territorial
                y administrativa.
              </p>
            </Reveal>
            <div className="mt-8">
              <LinkGrid
                items={GOBIERNO_DIGITAL_APLICACIONES}
                accent="aplicaciones"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
