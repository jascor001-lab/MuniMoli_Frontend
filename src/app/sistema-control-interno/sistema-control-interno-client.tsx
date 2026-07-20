"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  INTERNAL_CONTROL_PERIODS,
  INTERNAL_CONTROL_SOURCE_URL,
} from "@/data/internal-control-data";
import { cn } from "@/lib/utils";

const KIND_STYLES = {
  "Plan de acción": "bg-blue-50 text-blue-700",
  Evaluación: "bg-emerald-50 text-emerald-700",
  Seguimiento: "bg-amber-50 text-amber-700",
} as const;

export function SistemaControlInternoClient() {
  const [selectedYear, setSelectedYear] = useState(
    INTERNAL_CONTROL_PERIODS[0].year,
  );
  const selectedPeriod =
    INTERNAL_CONTROL_PERIODS.find((period) => period.year === selectedYear) ??
    INTERNAL_CONTROL_PERIODS[0];

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <section className="border-b border-emerald-900/10 bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-10 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-molina-teal hover:text-molina-mint"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Volver al inicio
              </Link>
              <Badge variant="mint" className="mt-5">
                Transparencia e integridad
              </Badge>
              <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-molina-deep sm:text-4xl lg:text-5xl">
                Sistema de Control Interno
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-molina-muted sm:text-lg">
                Planes de Acción Anual, evaluaciones de implementación y
                reportes de seguimiento publicados por la Municipalidad
                Distrital de La Molina.
              </p>
              <a
                href={INTERNAL_CONTROL_SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-molina-teal hover:underline"
              >
                Consultar fuente institucional
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-white py-10">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Control y prevención",
                text: "Medidas destinadas a fortalecer la gestión y reducir riesgos institucionales.",
              },
              {
                icon: FileCheck2,
                title: "Evaluación periódica",
                text: "Revisión del avance en la implementación del Sistema de Control Interno.",
              },
              {
                icon: FileText,
                title: "Documentación oficial",
                text: "Archivos institucionales disponibles localmente en formato PDF.",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal
                  key={item.title}
                  variant="up"
                  delayMs={70 + index * 90}
                >
                  <article className="h-full rounded-2xl border border-slate-200 p-5">
                    <Icon className="h-6 w-6 text-molina-teal" aria-hidden />
                    <h2 className="mt-3 font-bold text-molina-deep">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-molina-muted">
                      {item.text}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section
          className="bg-slate-50/70 py-12 lg:py-16"
          aria-labelledby="reports-heading"
        >
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Badge variant="mint">Reportes disponibles</Badge>
              <h2
                id="reports-heading"
                className="mt-3 text-3xl font-bold text-molina-deep"
              >
                Plan de Acción y Evaluación Anual
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-molina-muted">
                Selecciona un periodo para visualizar y descargar sus
                documentos oficiales.
              </p>
            </Reveal>

            <Reveal
              variant="up"
              delayMs={80}
              className="mt-7 flex flex-wrap gap-2"
            >
              {INTERNAL_CONTROL_PERIODS.map((period) => (
                <button
                  key={period.year}
                  type="button"
                  onClick={() => setSelectedYear(period.year)}
                  aria-pressed={selectedYear === period.year}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-colors",
                    selectedYear === period.year
                      ? "border-molina-deep bg-molina-deep text-white"
                      : "border-slate-300 bg-white text-molina-deep hover:border-molina-mint",
                  )}
                >
                  <CalendarDays className="h-4 w-4" aria-hidden />
                  {period.year}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      selectedYear === period.year
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-molina-muted",
                    )}
                  >
                    {period.documents.length}
                  </span>
                </button>
              ))}
            </Reveal>

            <div
              key={selectedPeriod.year}
              className="mt-8 grid gap-4 md:grid-cols-2"
            >
              {selectedPeriod.documents.map((document, index) => (
                <Reveal
                  key={document.href}
                  variant="up"
                  delayMs={50 + index * 70}
                >
                  <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          KIND_STYLES[document.kind],
                        )}
                      >
                        {document.kind}
                      </span>
                      <span className="text-xs font-semibold text-molina-muted">
                        PDF
                      </span>
                    </div>
                    <h3 className="mt-4 flex-1 font-bold leading-6 text-molina-deep">
                      {document.title}
                    </h3>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <a
                        href={document.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-molina-deep px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-molina-teal"
                      >
                        <FileText className="h-4 w-4" aria-hidden />
                        Ver PDF
                      </a>
                      <a
                        href={document.href}
                        download
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-molina-deep transition-colors hover:bg-slate-50"
                      >
                        <Download className="h-4 w-4" aria-hidden />
                        Descargar
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
