"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { NewsCategory } from "@/types/portal";
import { Badge } from "@/components/ui/badge";
import { NewsCard } from "@/components/sections/NewsCard";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { usePortalCms } from "@/components/cms/portal-cms";

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
  const { noticias } = usePortalCms();
  const newsItems = noticias.items;
  const [filter, setFilter] = useState<NewsCategory | "Todas">("Todas");

  const filtered = useMemo(() => {
    const list =
      filter === "Todas"
        ? newsItems
        : newsItems.filter((n) => n.category === filter);
    return list.slice(0, HOME_LIMIT);
  }, [filter, newsItems]);

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
              className="portal-section-title mt-3"
            >
              MoliNoticias
            </h2>
            <p className="mt-2 text-sm text-molina-muted sm:text-base">
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

        <Reveal
          variant="up"
          delayMs={100}
          className="portal-h-scroll mt-6 pb-1"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={cn(
                "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
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

        <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
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
