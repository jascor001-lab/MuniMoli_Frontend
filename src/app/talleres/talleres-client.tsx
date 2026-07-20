"use client";

import Image from "next/image";
import Link from "next/link";
import { Drama } from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Reveal } from "@/components/ui/reveal";
import { type TallerCategory } from "@/data/talleres-data";
import { usePortalCms } from "@/components/cms/portal-cms";

function CategoryIcon({ category }: { category: TallerCategory }) {
  if (category.icon.type === "svg") {
    return (
      <Image
        src={category.icon.url}
        alt=""
        width={88}
        height={88}
        className="h-14 w-14 object-contain sm:h-24 sm:w-24"
        aria-hidden
      />
    );
  }

  return (
    <Drama
      className="h-14 w-14 text-[#00A651] sm:h-24 sm:w-24"
      strokeWidth={1.4}
      aria-hidden
    />
  );
}

export function TalleresClient() {
  const { talleres } = usePortalCms();
  const categories = talleres.categories;

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main className="bg-white">
        <section className="py-6 sm:py-8">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal variant="up" className="flex justify-center">
              <h1 className="rounded-2xl bg-[#00A651] px-6 py-3 text-center text-xl font-bold tracking-wide text-white shadow-md sm:px-14 sm:py-4 sm:text-3xl">
                {talleres.title}
              </h1>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-6 lg:mx-auto lg:max-w-4xl">
              {categories.map((category, index) => {
                const isLastOdd =
                  index === categories.length - 1 &&
                  categories.length % 2 === 1;
                return (
                  <Reveal
                    key={category.slug}
                    variant="up"
                    delayMs={40 + index * 50}
                    className={
                      isLastOdd
                        ? "col-span-2 justify-self-center w-full max-w-[11.5rem] sm:col-span-1 sm:max-w-none sm:justify-self-stretch"
                        : undefined
                    }
                  >
                    <Link
                      href={`/talleres/${category.slug}`}
                      className="group flex h-full min-h-[150px] flex-col items-center justify-center gap-3 rounded-2xl bg-[#F3F3F3] px-3 py-6 text-center transition-all hover:-translate-y-0.5 hover:bg-[#E8E8E8] hover:shadow-md sm:min-h-[200px] sm:gap-4 sm:px-5 sm:py-8"
                    >
                      <CategoryIcon category={category} />
                      <span className="text-sm font-semibold leading-snug text-[#00A651] sm:text-lg">
                        {category.title}
                      </span>
                      {category.notice ? (
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-molina-muted ring-1 ring-slate-200 sm:text-xs">
                          {category.notice}
                        </span>
                      ) : null}
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
