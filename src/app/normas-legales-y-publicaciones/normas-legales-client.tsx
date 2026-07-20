"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  FileSearch,
  FileText,
  Landmark,
  Search,
} from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  LEGAL_NORM_CATEGORIES,
  LEGAL_PUBLICATIONS_SOURCE_URL,
  OTHER_PUBLICATIONS,
} from "@/data/legal-publications-data";
import { EXTERNAL_LINKS } from "@/data/portal-data";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function NormasLegalesClient() {
  const [search, setSearch] = useState("");
  const query = normalize(search.trim());

  const normCategories = useMemo(
    () =>
      LEGAL_NORM_CATEGORIES.filter((item) =>
        normalize(`${item.title} ${item.description}`).includes(query),
      ),
    [query],
  );

  const publications = useMemo(
    () =>
      OTHER_PUBLICATIONS.filter((item) =>
        normalize(`${item.title} ${item.description} ${item.date}`).includes(
          query,
        ),
      ),
    [query],
  );

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
                Institucional
              </Badge>
              <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-molina-deep sm:text-4xl lg:text-5xl">
                Normas Legales y Publicaciones
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-molina-muted sm:text-lg">
                Consulta normas emitidas, documentos de gestión y publicaciones
                oficiales de la Municipalidad Distrital de La Molina.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={EXTERNAL_LINKS.transparencia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-molina-deep px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-molina-teal"
                >
                  Portal de Transparencia
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href={LEGAL_PUBLICATIONS_SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-molina-deep transition-colors hover:bg-slate-50"
                >
                  Fuente institucional
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          className="border-b border-slate-100 bg-white py-6"
          aria-label="Buscar normas y publicaciones"
        >
          <div className="mx-auto max-w-3xl px-4">
            <Reveal variant="down">
              <label
                htmlFor="legal-search"
                className="mb-2 block text-sm font-semibold text-molina-deep"
              >
                Buscar en esta sección
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-molina-muted"
                  aria-hidden
                />
                <input
                  id="legal-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Ejemplo: ordenanzas, presupuesto, PEI..."
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm text-molina-ink outline-none transition focus:border-molina-mint focus:ring-2 focus:ring-molina-mint/20"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section
          className="bg-slate-50/70 py-12 lg:py-16"
          aria-labelledby="norms-heading"
        >
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-molina-teal">
                  <Landmark className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <Badge variant="mint">Repositorio normativo</Badge>
                  <h2
                    id="norms-heading"
                    className="mt-1 text-3xl font-bold text-molina-deep"
                  >
                    Normas emitidas
                  </h2>
                </div>
              </div>
              <p className="mt-4 max-w-3xl leading-7 text-molina-muted">
                Selecciona una categoría para consultar sus documentos y
                utilizar los filtros por año, estado, asunto o número.
              </p>
            </Reveal>

            {normCategories.length > 0 ? (
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {normCategories.map((category, index) => (
                  <Reveal
                    key={category.id}
                    variant="up"
                    delayMs={50 + (index % 6) * 60}
                  >
                    <a
                      href={category.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-molina-mint/40 hover:shadow-md"
                    >
                      <FileText
                        className="h-6 w-6 text-molina-teal"
                        aria-hidden
                      />
                      <h3 className="mt-4 font-bold text-molina-deep group-hover:text-molina-teal">
                        {category.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-molina-muted">
                        {category.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-molina-teal">
                        Consultar documentos
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    </a>
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-molina-muted">
                No se encontraron categorías con ese término.
              </p>
            )}
          </div>
        </section>

        <section
          className="bg-white py-12 lg:py-16"
          aria-labelledby="publications-heading"
        >
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-molina-teal">
                  <FileSearch className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <Badge variant="mint">Actualizado en 2026</Badge>
                  <h2
                    id="publications-heading"
                    className="mt-1 text-3xl font-bold text-molina-deep"
                  >
                    Otras publicaciones
                  </h2>
                </div>
              </div>
            </Reveal>

            {publications.length > 0 ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {publications.map((publication, index) => {
                  const isInternal = publication.href.startsWith("/");
                  const content = (
                    <>
                      <div className="flex items-center gap-2 text-xs font-semibold text-molina-teal">
                        <CalendarDays className="h-4 w-4" aria-hidden />
                        {publication.date}
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-molina-deep group-hover:text-molina-teal">
                        {publication.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-molina-muted">
                        {publication.description}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-molina-teal">
                        Ver publicación
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    </>
                  );

                  return (
                    <Reveal
                      key={publication.href}
                      variant="up"
                      delayMs={60 + (index % 6) * 60}
                    >
                      {isInternal ? (
                        <Link
                          href={publication.href}
                          className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-molina-mint/40 hover:shadow-md"
                        >
                          {content}
                        </Link>
                      ) : (
                        <a
                          href={publication.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-molina-mint/40 hover:shadow-md"
                        >
                          {content}
                        </a>
                      )}
                    </Reveal>
                  );
                })}
              </div>
            ) : (
              <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-molina-muted">
                No se encontraron publicaciones con ese término.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
