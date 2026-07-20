"use client";

import Image from "next/image";
import Link from "next/link";
import { Drama, ExternalLink } from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Reveal } from "@/components/ui/reveal";
import {
  TALLERES_DATA,
  TALLERES_SOURCE_URL,
  type TallerCategory,
} from "@/data/talleres-data";

function CategoryIcon({ category }: { category: TallerCategory }) {
  if (category.icon.type === "svg") {
    return (
      <Image
        src={category.icon.url}
        alt=""
        width={88}
        height={88}
        className="h-20 w-20 object-contain sm:h-24 sm:w-24"
        aria-hidden
      />
    );
  }

  return (
    <Drama
      className="h-20 w-20 text-[#00A651] sm:h-24 sm:w-24"
      strokeWidth={1.4}
      aria-hidden
    />
  );
}

export function TalleresClient() {
  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main className="bg-white">
        <section className="py-10 lg:py-14">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal variant="up" className="flex justify-center">
              <h1 className="rounded-2xl bg-[#00A651] px-10 py-4 text-2xl font-bold tracking-wide text-white shadow-md sm:px-14 sm:text-3xl">
                {TALLERES_DATA.title}
              </h1>
            </Reveal>

            <div className="mt-12 flex flex-wrap justify-center gap-5 sm:gap-6">
              {TALLERES_DATA.categories.map((category, index) => (
                <Reveal
                  key={category.slug}
                  variant="up"
                  delayMs={40 + index * 50}
                  className="w-full max-w-[220px] sm:w-[200px]"
                >
                  <Link
                    href={`/talleres/${category.slug}`}
                    className="group flex h-full min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl bg-[#F3F3F3] px-5 py-8 text-center transition-all hover:-translate-y-0.5 hover:bg-[#E8E8E8] hover:shadow-md"
                  >
                    <CategoryIcon category={category} />
                    <span className="text-base font-semibold leading-snug text-[#00A651] sm:text-lg">
                      {category.title}
                    </span>
                    {category.notice ? (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-molina-muted ring-1 ring-slate-200">
                        {category.notice}
                      </span>
                    ) : null}
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal variant="up" className="mt-10 flex justify-center">
              <a
                href={TALLERES_SOURCE_URL}
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
