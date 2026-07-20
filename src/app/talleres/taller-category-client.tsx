"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import type { TallerCategory } from "@/data/talleres-data";

type Props = {
  category: TallerCategory;
};

export function TallerCategoryClient({ category }: Props) {
  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main className="bg-white">
        <section className="border-b border-emerald-900/10 bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-10 lg:py-12">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Link
                href="/talleres"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-molina-teal hover:text-molina-mint"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Talleres
              </Link>
              <p className="mt-4 text-sm text-molina-muted">
                Te encuentras: {category.breadcrumb}
              </p>
              <Badge variant="mint" className="mt-3">
                Talleres
              </Badge>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-molina-deep sm:text-4xl">
                {category.pageTitle || category.title}
              </h1>
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

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            {category.notice ? (
              <Reveal variant="up">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-10 text-center">
                  <p className="text-2xl font-bold text-amber-800">
                    {category.notice}
                  </p>
                  <p className="mt-2 text-sm text-amber-700/80">
                    La información de esta categoría se publicará cuando esté
                    disponible en el portal municipal.
                  </p>
                </div>
              </Reveal>
            ) : null}

            {category.images.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.images.map((image, index) => (
                  <Reveal
                    key={image.url}
                    variant="up"
                    delayMs={(index % 8) * 40}
                  >
                    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                      <div className="relative aspect-square">
                        <Image
                          src={image.url}
                          alt={image.alt || category.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover"
                          priority={index < 4}
                        />
                      </div>
                      {image.title ? (
                        <figcaption className="border-t border-slate-100 bg-white px-4 py-3 text-sm font-medium leading-snug text-molina-deep">
                          {image.title}
                        </figcaption>
                      ) : null}
                    </figure>
                  </Reveal>
                ))}
              </div>
            ) : null}

            {!category.notice && category.images.length === 0 ? (
              <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-molina-muted">
                No hay imágenes publicadas en esta categoría por el momento.
              </p>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
