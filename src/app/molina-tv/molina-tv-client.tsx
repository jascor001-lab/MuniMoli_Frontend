"use client";

import Link from "next/link";
import {
  Mic2,
  Newspaper,
  Radio,
  Video,
} from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Reveal } from "@/components/ui/reveal";
import { usePortalCms } from "@/components/cms/portal-cms";

const CATEGORY_ICONS = {
  "en-vivo": Radio,
  "sesiones-concejo": Video,
  "molina-noticias": Newspaper,
  podcast: Mic2,
} as const;

export function MolinaTvClient() {
  const { molinaTv } = usePortalCms();

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main className="bg-white">
        <section className="py-6 sm:py-8">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal variant="up" className="flex justify-center">
              <h1 className="rounded-2xl bg-[#00AC68] px-5 py-3 text-center text-xl font-bold tracking-wide text-white shadow-md sm:px-12 sm:py-4 sm:text-3xl">
                {molinaTv.title}
              </h1>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4">
              {molinaTv.categories.map((category, index) => {
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
                      className="group flex h-full min-h-[140px] flex-col items-center justify-center gap-3 rounded-2xl bg-[#F3F3F3] px-4 py-6 text-center transition-all hover:-translate-y-0.5 hover:bg-[#D1D1D1] hover:shadow-md sm:min-h-[180px] sm:gap-4 sm:px-5 sm:py-8"
                    >
                      <Icon
                        className="h-10 w-10 text-[#00AC68] transition-transform group-hover:scale-105 sm:h-12 sm:w-12"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <span className="text-xs font-bold uppercase leading-snug tracking-wide text-[#00AC68] sm:text-base">
                        {category.title}
                      </span>
                      <span className="text-[11px] font-medium text-molina-muted sm:text-xs">
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
