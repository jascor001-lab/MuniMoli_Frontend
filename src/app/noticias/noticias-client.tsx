"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { NewsCard } from "@/components/sections/NewsCard";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { NEWS_ITEMS, OFFICIAL_PORTAL_URL } from "@/data/portal-data";
import type { NewsCategory } from "@/types/portal";
import { cn } from "@/lib/utils";

const CATEGORIES: (NewsCategory | "Todas")[] = [
  "Todas",
  "Obras",
  "Cultura",
  "Seguridad",
  "Deportes",
  "General",
];

export function NoticiasPageClient() {
  const [filter, setFilter] = useState<NewsCategory | "Todas">("Todas");

  const filtered = useMemo(
    () =>
      filter === "Todas"
        ? NEWS_ITEMS
        : NEWS_ITEMS.filter((n) => n.category === filter),
    [filter],
  );

  const [featured, ...rest] = filtered;

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
                Sala de Prensa
              </Badge>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-molina-deep sm:text-4xl">
                Todas las noticias
              </h1>
              <p className="mt-2 max-w-2xl text-molina-muted">
                Comunicados y notas de prensa de la Municipalidad Distrital de
                La Molina. Fuente:{" "}
                <a
                  href={`${OFFICIAL_PORTAL_URL}/noticias/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-molina-teal hover:underline"
                >
                  portal.munimolina.gob.pe/noticias
                </a>
              </p>
              <p className="mt-3 text-sm text-molina-muted">
                {filtered.length} noticia{filtered.length === 1 ? "" : "s"}
                {filter !== "Todas" ? ` en ${filter}` : ""}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-10 lg:py-14" aria-label="Listado de noticias">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up" delayMs={80} className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                    filter === cat
                      ? "bg-molina-teal text-white"
                      : "bg-white text-molina-muted ring-1 ring-slate-200",
                  )}
                  aria-pressed={filter === cat}
                >
                  {cat}
                </button>
              ))}
            </Reveal>

            {featured ? (
              <div className="mt-8 space-y-6">
                <Reveal variant="up" delayMs={120}>
                  <NewsCard item={featured} featured />
                </Reveal>
                {rest.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((item, index) => (
                      <Reveal
                        key={item.id}
                        variant="up"
                        delayMs={80 + index * 80}
                      >
                        <NewsCard item={item} />
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-12 text-center text-molina-muted">
                No hay noticias en esta categoría.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
