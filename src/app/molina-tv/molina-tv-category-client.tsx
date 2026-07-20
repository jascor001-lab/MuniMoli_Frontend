"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Search } from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import type { MolinaTvCategory, MolinaTvVideo } from "@/data/molina-tv-data";

type Props = {
  category: MolinaTvCategory;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function VideoEmbed({ video }: { video: MolinaTvVideo }) {
  if (video.provider === "live") {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        <iframe
          src={video.embedUrl}
          title={video.title}
          className="absolute inset-0 h-full w-full"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      </div>
    );
  }

  if (video.provider === "facebook") {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900">
        <iframe
          src={video.embedUrl}
          title={video.title}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
      <iframe
        src={video.embedUrl}
        title={video.title}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export function MolinaTvCategoryClient({ category }: Props) {
  const [search, setSearch] = useState("");
  const showSearch = category.videos.length > 8;

  const videos = useMemo(() => {
    const query = normalize(search.trim());
    if (!query) return category.videos;
    return category.videos.filter((video) =>
      normalize(video.title).includes(query),
    );
  }, [category.videos, search]);

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main className="bg-white">
        <section className="border-b border-emerald-900/10 bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-10 lg:py-12">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Link
                href="/molina-tv"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-molina-teal hover:text-molina-mint"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a La Molina TV
              </Link>
              <p className="mt-4 text-sm text-molina-muted">
                Te encuentras: {category.breadcrumb}
              </p>
              <Badge variant="mint" className="mt-3">
                La Molina TV
              </Badge>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-molina-deep sm:text-4xl">
                {category.title}
              </h1>
              <p className="mt-2 text-sm text-molina-muted">
                {category.videos.length}{" "}
                {category.videos.length === 1
                  ? "contenido migrado"
                  : "contenidos migrados"}{" "}
                desde el portal oficial.
              </p>
              <a
                href={category.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-molina-teal hover:underline"
              >
                Ver en portal oficial
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </Reveal>
          </div>
        </section>

        {showSearch ? (
          <section className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 py-4 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4">
              <label htmlFor="tv-search" className="sr-only">
                Buscar contenido
              </label>
              <div className="relative mx-auto max-w-2xl">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-molina-muted"
                  aria-hidden
                />
                <input
                  id="tv-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar sesión, fecha o programa..."
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-molina-mint focus:ring-2 focus:ring-molina-mint/20"
                />
              </div>
            </div>
          </section>
        ) : null}

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            {videos.length > 0 ? (
              <div
                className={
                  category.slug === "en-vivo"
                    ? "mx-auto max-w-4xl"
                    : "grid gap-8 md:grid-cols-2"
                }
              >
                {videos.map((video, index) => (
                  <Reveal
                    key={`${video.provider}-${video.embedUrl}-${index}`}
                    variant="up"
                    delayMs={(index % 6) * 40}
                    as="article"
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <VideoEmbed video={video} />
                    <div className="px-4 py-4">
                      <h2 className="text-base font-semibold leading-snug text-molina-deep sm:text-lg">
                        {video.title}
                      </h2>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-molina-muted">
                        {video.provider === "youtube"
                          ? "YouTube"
                          : video.provider === "facebook"
                            ? "Facebook"
                            : "En vivo"}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-molina-muted">
                No encontramos contenidos con ese término.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
