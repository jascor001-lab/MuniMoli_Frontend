"use client";

import Link from "next/link";
import {
  ExternalLink,
  Mic2,
  Newspaper,
  Radio,
  Video,
} from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Reveal } from "@/components/ui/reveal";
import {
  MOLINA_TV_DATA,
  MOLINA_TV_SOURCE_URL,
} from "@/data/molina-tv-data";

const CATEGORY_ICONS = {
  "en-vivo": Radio,
  "sesiones-concejo": Video,
  "molina-noticias": Newspaper,
  podcast: Mic2,
} as const;

export function MolinaTvClient() {
  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main className="bg-white">
        <section className="py-10 lg:py-14">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal variant="up" className="flex justify-center">
              <h1 className="rounded-2xl bg-[#00AC68] px-8 py-4 text-center text-2xl font-bold tracking-wide text-white shadow-md sm:px-12 sm:text-3xl">
                {MOLINA_TV_DATA.title}
              </h1>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {MOLINA_TV_DATA.categories.map((category, index) => {
                const Icon =
                  CATEGORY_ICONS[
                    category.slug as keyof typeof CATEGORY_ICONS
                  ] ?? Video;
                return (
                  <Reveal
                    key={category.slug}
                    variant="up"
                    delayMs={40 + index * 50}
                  >
                    <Link
                      href={`/molina-tv/${category.slug}`}
                      className="group flex h-full min-h-[180px] flex-col items-center justify-center gap-4 rounded-2xl bg-[#F3F3F3] px-5 py-8 text-center transition-all hover:-translate-y-0.5 hover:bg-[#D1D1D1] hover:shadow-md"
                    >
                      <Icon
                        className="h-12 w-12 text-[#00AC68] transition-transform group-hover:scale-105"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <span className="text-sm font-bold uppercase leading-snug tracking-wide text-[#00AC68] sm:text-base">
                        {category.title}
                      </span>
                      <span className="text-xs font-medium text-molina-muted">
                        {category.videos.length}{" "}
                        {category.videos.length === 1
                          ? "contenido"
                          : "contenidos"}
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>

            <Reveal variant="up" className="mt-10 flex justify-center">
              <a
                href={MOLINA_TV_SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-molina-teal hover:underline"
              >
                Ver en portal.munimolina.gob.pe
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
