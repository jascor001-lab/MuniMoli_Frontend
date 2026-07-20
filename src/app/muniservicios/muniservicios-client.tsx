"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  MUNICIPAL_SERVICE_CATEGORIES,
  MUNICIPAL_SERVICE_COUNT,
} from "@/data/municipal-services";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function MuniserviciosClient() {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("q");
    if (query) setSearch(query);
  }, []);

  const matchingServices = useMemo(() => {
    const query = normalize(search.trim());
    if (!query) return [];

    return MUNICIPAL_SERVICE_CATEGORIES.flatMap((category) =>
      category.services
        .filter((service) =>
          normalize(
            `${category.title} ${service.title} ${service.summary} ${service.details?.join(" ") ?? ""}`,
          ).includes(query),
        )
        .map((service) => ({ category, service })),
    );
  }, [search]);

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <section className="border-b border-emerald-100 bg-gradient-to-br from-emerald-900 via-molina-deep to-molina-teal py-14 text-white lg:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Badge className="bg-white/15 text-emerald-50 ring-1 ring-white/25">
                Servicios para el vecino
              </Badge>
              <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Muniservicios
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-emerald-50/90 sm:text-lg">
                Catálogo oficial de programas y servicios municipales para los
                vecinos de La Molina, migrado desde el portal institucional.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold">
                <span className="rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/20">
                  {MUNICIPAL_SERVICE_CATEGORIES.length} áreas municipales
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/20">
                  {MUNICIPAL_SERVICE_COUNT} servicios y programas
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 py-4 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4">
            <label htmlFor="muniservicios-search" className="sr-only">
              Buscar un servicio municipal
            </label>
            <div className="relative mx-auto max-w-2xl">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-molina-muted"
                aria-hidden
              />
              <input
                id="muniservicios-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar programa, servicio o área municipal..."
                className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-molina-mint focus:ring-2 focus:ring-molina-mint/20"
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-50/70 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            {search.trim() ? (
              <>
                <Reveal variant="up">
                  <Badge variant="mint">Resultados</Badge>
                  <h2 className="mt-3 text-3xl font-bold text-molina-deep">
                    Servicios encontrados
                  </h2>
                  <p className="mt-2 text-sm text-molina-muted">
                    {matchingServices.length} coincidencias para “{search}”
                  </p>
                </Reveal>
                {matchingServices.length > 0 ? (
                  <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {matchingServices.map(({ category, service }, index) => (
                      <Reveal
                        key={`${category.slug}-${service.slug}`}
                        variant="up"
                        delayMs={(index % 6) * 50}
                      >
                        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                          <div className="relative h-36 overflow-hidden">
                            <Image
                              src={category.imageUrl}
                              alt={category.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <span className="text-xs font-bold uppercase tracking-wide text-molina-teal">
                              {category.shortTitle}
                            </span>
                            <h3 className="mt-2 text-lg font-bold text-molina-deep">
                              {service.title}
                            </h3>
                            <p className="mt-2 flex-1 text-sm leading-6 text-molina-muted">
                              {service.summary}
                            </p>
                            <Link
                              href={`/muniservicios/${category.slug}#${service.slug}`}
                              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl border-2 border-molina-teal px-4 text-sm font-semibold text-molina-teal transition-colors hover:bg-molina-teal hover:text-white"
                            >
                              Ver información
                              <ArrowRight className="h-4 w-4" aria-hidden />
                            </Link>
                          </div>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  <p className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-molina-muted">
                    No encontramos servicios con ese término.
                  </p>
                )}
              </>
            ) : (
              <>
                <Reveal variant="up">
                  <Badge variant="mint">Catálogo municipal</Badge>
                  <h2 className="mt-3 text-3xl font-bold text-molina-deep">
                    Servicios para el vecino
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-molina-muted">
                    Fotografías, títulos y descripciones oficiales migrados
                    desde el portal de la Municipalidad de La Molina.
                  </p>
                </Reveal>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {MUNICIPAL_SERVICE_CATEGORIES.map((category, index) => (
                    <Reveal
                      key={category.slug}
                      variant="up"
                      delayMs={(index % 8) * 45}
                    >
                      <Link
                        href={`/muniservicios/${category.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-molina-mint/50 hover:shadow-lg"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                          <Image
                            src={category.imageUrl}
                            alt={category.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority={index < 4}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="text-base font-bold uppercase leading-snug tracking-wide text-molina-deep">
                            {category.title}
                          </h3>
                          <p className="mt-3 flex-1 text-sm leading-6 text-molina-muted">
                            {category.summary}
                          </p>
                          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-molina-teal">
                            Ver área
                            <ArrowRight
                              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                              aria-hidden
                            />
                            <span className="ml-auto text-xs font-medium text-molina-muted">
                              {category.services.length}{" "}
                              {category.services.length === 1
                                ? "servicio"
                                : "servicios"}
                            </span>
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
