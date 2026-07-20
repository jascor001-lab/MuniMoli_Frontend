"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { NEWS_ITEMS } from "@/data/portal-data";
import type { NewsCategory } from "@/types/portal";
import { Badge } from "@/components/ui/badge";
import { NewsCard } from "@/components/sections/NewsCard";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const CATEGORIES: (NewsCategory | "Todas")[] = [
  "Todas",
  "Obras",
  "Cultura",
  "Seguridad",
  "Deportes",
  "General",
];

const HOME_LIMIT = 4;

export function NewsGrid() {
  const [filter, setFilter] = useState<NewsCategory | "Todas">("Todas");

  const filtered = useMemo(() => {
    const list =
      filter === "Todas"
        ? NEWS_ITEMS
        : NEWS_ITEMS.filter((n) => n.category === filter);
    return list.slice(0, HOME_LIMIT);
  }, [filter]);

  return (
    <section className="py-16 lg:py-24" aria-labelledby="news-heading">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal
          variant="up"
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <Badge variant="mint">Sala de Prensa</Badge>
            <h2
              id="news-heading"
              className="mt-3 text-3xl font-bold text-molina-deep"
            >
              MoliNoticias
            </h2>
            <p className="mt-2 text-molina-muted">
              Últimas noticias del distrito publicadas en el portal oficial.
            </p>
          </div>
          <Link
            href="/noticias"
            className="text-sm font-semibold text-molina-teal hover:text-molina-mint"
          >
            Ver todas las noticias →
          </Link>
        </Reveal>

        <Reveal variant="up" delayMs={100} className="mt-6 flex flex-wrap gap-2">
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

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((item, index) => (
            <Reveal key={item.id} variant="up" delayMs={80 + index * 100}>
              <NewsCard item={item} />
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-molina-muted">
            No hay noticias en esta categoría.
          </p>
        )}
      </div>
    </section>
  );
}
