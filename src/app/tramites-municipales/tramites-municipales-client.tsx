"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Clock3,
  FileText,
  Heart,
  MapPin,
  Phone,
  Search,
  Store,
  Users,
} from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { MunicipalityMapLazy } from "@/components/sections/MunicipalityMapLazy";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  MUNICIPAL_PROCEDURE_CATEGORIES,
  MUNICIPAL_PROCEDURES,
  type MunicipalProcedureCategory,
} from "@/data/municipal-procedures";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = {
  Vecinos: Users,
  Negocios: Store,
  "Registro Civil": Heart,
  Edificación: Building2,
  TUPA: FileText,
} as const;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function TramitesMunicipalesClient() {
  const [activeCategory, setActiveCategory] =
    useState<MunicipalProcedureCategory>("Vecinos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("q");
    if (query) setSearch(query);
  }, []);

  const procedures = useMemo(() => {
    const query = normalize(search.trim());
    return MUNICIPAL_PROCEDURES.filter(
      (procedure) =>
        procedure.categories.includes(activeCategory) &&
        (!query ||
          normalize(
            `${procedure.title} ${procedure.summary} ${procedure.requirements.join(" ")}`,
          ).includes(query)),
    );
  }, [activeCategory, search]);

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-10 lg:py-14">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-molina-teal hover:underline"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Volver al inicio
              </Link>
              <Badge variant="mint" className="ml-3">
                Atención al ciudadano
              </Badge>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-molina-deep sm:text-4xl lg:text-5xl">
                Trámites Municipales
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-molina-muted">
                Revisa requisitos, modalidades, plazos, costos y resultados
                antes de presentar tu solicitud ante la Municipalidad de La
                Molina.
              </p>
            </Reveal>
          </div>
        </section>

        <nav
          aria-label="Categorías de trámites municipales"
          className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"
        >
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4">
            {MUNICIPAL_PROCEDURE_CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category];
              const count = MUNICIPAL_PROCEDURES.filter((procedure) =>
                procedure.categories.includes(category),
              ).length;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
                    activeCategory === category
                      ? "border-molina-deep bg-molina-deep text-white"
                      : "border-slate-200 bg-white text-molina-deep hover:border-molina-mint hover:bg-emerald-50",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {category}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      activeCategory === category
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-molina-muted",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <section className="bg-slate-50/70 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <Reveal variant="right">
                <Badge variant="mint">{activeCategory}</Badge>
                <h2 className="mt-3 text-3xl font-bold text-molina-deep">
                  Trámites de {activeCategory}
                </h2>
                <p className="mt-2 text-sm text-molina-muted">
                  {procedures.length}{" "}
                  {procedures.length === 1
                    ? "trámite disponible"
                    : "trámites disponibles"}
                </p>
              </Reveal>
              <Reveal variant="left" className="w-full lg:max-w-sm">
                <label htmlFor="procedure-search" className="sr-only">
                  Buscar trámite o requisito
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-molina-muted"
                    aria-hidden
                  />
                  <input
                    id="procedure-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar trámite o requisito..."
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-molina-mint focus:ring-2 focus:ring-molina-mint/20"
                  />
                </div>
              </Reveal>
            </div>

            {procedures.length > 0 ? (
              <div
                key={activeCategory}
                className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
              >
                {procedures.map((procedure, index) => (
                  <Reveal
                    key={procedure.slug}
                    variant="up"
                    delayMs={50 + (index % 6) * 60}
                  >
                    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-molina-mint/40 hover:shadow-md">
                      <div className="flex flex-wrap gap-2">
                        {procedure.channels.map((channel) => (
                          <span
                            key={`${procedure.slug}-${channel.type}`}
                            className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                          >
                            {channel.type}
                          </span>
                        ))}
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-molina-deep">
                        {procedure.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-molina-muted">
                        {procedure.summary}
                      </p>
                      <Link
                        href={`/tramites-municipales/${procedure.slug}`}
                        className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border-2 border-molina-teal px-4 text-sm font-semibold text-molina-teal transition-colors hover:bg-molina-teal hover:text-white"
                      >
                        Ver información completa
                      </Link>
                    </article>
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-molina-muted">
                No se encontraron trámites con ese término.
              </p>
            )}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Badge variant="mint">Atención presencial</Badge>
              <h2 className="mt-3 text-3xl font-bold text-molina-deep">
                Sede y horario de atención
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <Reveal variant="right">
                <article className="h-full rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="space-y-6">
                    <div className="flex gap-3">
                      <MapPin
                        className="mt-0.5 h-5 w-5 shrink-0 text-molina-teal"
                        aria-hidden
                      />
                      <div>
                        <h3 className="font-bold text-molina-deep">Sede</h3>
                        <p className="mt-1 text-sm leading-6 text-molina-muted">
                          Av. Ricardo Elías Aparicio 740, La Molina
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Clock3
                        className="mt-0.5 h-5 w-5 shrink-0 text-molina-teal"
                        aria-hidden
                      />
                      <div>
                        <h3 className="font-bold text-molina-deep">
                          Horario de atención
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-molina-muted">
                          Lunes a viernes de 8:10 a.m. a 5:20 p.m.
                          <br />
                          Sábados de 8:10 a.m. a 1:00 p.m.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Phone
                        className="mt-0.5 h-5 w-5 shrink-0 text-molina-teal"
                        aria-hidden
                      />
                      <div>
                        <h3 className="font-bold text-molina-deep">
                          Central telefónica
                        </h3>
                        <a
                          href="tel:+5117544000"
                          className="mt-1 block text-sm font-semibold text-molina-teal hover:underline"
                        >
                          (01) 754 4000
                        </a>
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-900">
                    Proyectos y anexos foliados de Obras Privadas, Obras
                    Públicas, Inversiones, Desarrollo Sostenible y Servicios a
                    la Ciudad se reciben hasta las 5:00 p.m. Los sábados se
                    atiende únicamente la liquidación de pagos y caja.
                  </p>
                </article>
              </Reveal>
              <Reveal variant="left">
                <MunicipalityMapLazy />
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
