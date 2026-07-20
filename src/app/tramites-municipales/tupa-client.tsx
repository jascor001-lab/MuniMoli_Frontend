"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Download,
  FileSearch,
  FileText,
  History,
  Search,
} from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  TUPA_CURRENT,
  TUPA_DOCUMENT_COUNT,
  TUPA_HISTORICAL_PERIODS,
  TUPA_TIMELINE,
  type TupaDocument,
} from "@/data/tupa-data";
import { cn } from "@/lib/utils";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function DownloadLink({ document }: { document: TupaDocument }) {
  if (!document.href) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        No disponible
      </span>
    );
  }

  return (
    <a
      href={document.href}
      download
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-molina-teal px-3 text-xs font-bold text-white transition-colors hover:bg-molina-deep"
    >
      <Download className="h-4 w-4" aria-hidden />
      Descargar
    </a>
  );
}

export function TupaPageClient() {
  const [activePeriod, setActivePeriod] = useState("Todos");
  const [search, setSearch] = useState("");

  const periods = useMemo(() => {
    const query = normalize(search.trim());
    return TUPA_HISTORICAL_PERIODS.map((period) => ({
      ...period,
      documents: period.documents.filter(
        (document) =>
          (!query ||
            normalize(
              `${period.year} ${document.title} ${document.description}`,
            ).includes(query)) &&
          (activePeriod === "Todos" || period.year === activePeriod),
      ),
    })).filter((period) => period.documents.length > 0);
  }, [activePeriod, search]);

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <section className="border-b border-emerald-100 bg-gradient-to-br from-emerald-950 via-molina-deep to-molina-teal py-14 text-white lg:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Link
                href="/tramites-municipales"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-100 hover:text-white hover:underline"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Volver a Trámites Municipales
              </Link>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge className="bg-white/15 text-white ring-1 ring-white/20">
                  Documento oficial
                </Badge>
                <Badge className="bg-emerald-400/20 text-emerald-50 ring-1 ring-emerald-300/30">
                  {TUPA_DOCUMENT_COUNT} registros
                </Badge>
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Texto Único de Procedimientos Administrativos
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-emerald-50/90 sm:text-lg">
                Consulta el TUPA vigente, sus normas de aprobación y todas las
                actualizaciones históricas almacenadas dentro del portal de La
                Molina.
              </p>
              <Link
                href="/tramites-municipales"
                className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-molina-deep transition-colors hover:bg-emerald-50"
              >
                <FileSearch className="h-5 w-5" aria-hidden />
                Buscar un trámite municipal
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <div className="flex items-center gap-3">
                <FileText className="h-7 w-7 text-molina-teal" aria-hidden />
                <div>
                  <Badge variant="mint">TUPA vigente</Badge>
                  <h2 className="mt-2 text-3xl font-bold text-molina-deep">
                    Ordenanza N.° 470/MDLM
                  </h2>
                </div>
              </div>
            </Reveal>
            <Reveal variant="up" delayMs={70}>
              <article className="mt-7 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
                <div className="grid gap-0 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-molina-teal">
                      Ordenanza distrital · Acuerdo de Concejo Metropolitano
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-molina-deep">
                      {TUPA_CURRENT.title}
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-molina-muted">
                      {TUPA_CURRENT.description}
                    </p>
                  </div>
                  <div className="border-t border-emerald-200 p-6 lg:border-l lg:border-t-0">
                    <DownloadLink document={TUPA_CURRENT} />
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-12">
          <div className="mx-auto grid max-w-7xl gap-7 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal variant="right">
              <Badge variant="mint">Línea de tiempo</Badge>
              <h2 className="mt-3 text-3xl font-bold text-molina-deep">
                Evolución del TUPA
              </h2>
              <p className="mt-3 text-sm leading-7 text-molina-muted">
                {TUPA_TIMELINE.description}
              </p>
              <div className="mt-5">
                <DownloadLink document={TUPA_TIMELINE} />
              </div>
            </Reveal>
            <Reveal variant="left">
              <a
                href={TUPA_TIMELINE.href}
                download
                className="group relative block aspect-[16/8] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <Image
                  src={TUPA_TIMELINE.href ?? ""}
                  alt="Línea de tiempo histórica del TUPA de La Molina"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </a>
            </Reveal>
          </div>
        </section>

        <section className="bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <div className="flex items-center gap-3">
                <History className="h-7 w-7 text-molina-teal" aria-hidden />
                <div>
                  <Badge variant="mint">Archivo institucional</Badge>
                  <h2 className="mt-2 text-3xl font-bold text-molina-deep">
                    TUPA histórico
                  </h2>
                </div>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-molina-muted"
                  aria-hidden
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar norma, año o descripción..."
                  className="h-12 w-full rounded-xl border border-slate-300 pl-12 pr-4 text-sm outline-none focus:border-molina-mint focus:ring-2 focus:ring-molina-mint/20"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {["Todos", ...TUPA_HISTORICAL_PERIODS.map((p) => p.year)].map(
                  (period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setActivePeriod(period)}
                      className={cn(
                        "shrink-0 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors",
                        activePeriod === period
                          ? "border-molina-deep bg-molina-deep text-white"
                          : "border-slate-200 bg-white text-molina-deep hover:border-molina-mint hover:bg-emerald-50",
                      )}
                    >
                      {period}
                    </button>
                  ),
                )}
              </div>
            </div>

            {periods.length > 0 ? (
              <div className="mt-8 space-y-8">
                {periods.map((period) => (
                  <Reveal key={period.year} variant="up">
                    <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                      <div className="bg-gradient-to-r from-emerald-700 to-molina-teal px-5 py-3 text-white">
                        <h3 className="text-lg font-bold">
                          Periodo {period.year}
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                          <thead className="bg-emerald-50 text-molina-deep">
                            <tr>
                              <th className="w-16 px-4 py-3 text-center">N.°</th>
                              <th className="w-64 px-4 py-3">Norma</th>
                              <th className="px-4 py-3">Descripción</th>
                              <th className="w-36 px-4 py-3 text-center">
                                Archivo
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 bg-white">
                            {period.documents.map((document) => (
                              <tr
                                key={`${period.year}-${document.order}`}
                                className="align-top hover:bg-slate-50"
                              >
                                <td className="px-4 py-4 text-center font-bold text-molina-teal">
                                  {document.order}
                                </td>
                                <td className="px-4 py-4 font-bold text-molina-deep">
                                  {document.title}
                                </td>
                                <td className="px-4 py-4 leading-6 text-molina-muted">
                                  {document.description}
                                  {document.sourceIssue && (
                                    <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 p-2 text-xs font-semibold leading-5 text-amber-800">
                                      <AlertTriangle
                                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                        aria-hidden
                                      />
                                      {document.sourceIssue}
                                    </p>
                                  )}
                                </td>
                                <td className="px-4 py-4 text-center">
                                  <DownloadLink document={document} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-molina-muted">
                No se encontraron documentos con esos criterios.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
