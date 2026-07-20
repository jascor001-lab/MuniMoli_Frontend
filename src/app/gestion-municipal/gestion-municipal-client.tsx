"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ExternalLink,
  Award,
  Landmark,
  Network,
  Users,
  UserRound,
  Eye,
  Scale,
} from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  GESTION_MUNICIPAL_DATA,
  GESTION_MUNICIPAL_SOURCE_URL,
} from "@/data/gestion-municipal-data";

const SECTION_ICONS: Record<string, typeof Building2> = {
  alcalde: UserRound,
  "vision-y-objetivos": Eye,
  "concejo-municipal": Users,
  "estructura-organica": Network,
  comisiones: Scale,
  funcionarios: Landmark,
  reconocimientos: Award,
};

export function GestionMunicipalClient() {
  const hero = GESTION_MUNICIPAL_DATA.images[0];
  const heroAlt = GESTION_MUNICIPAL_DATA.images[1];

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <section className="relative overflow-hidden border-b border-emerald-900/10">
          <div className="absolute inset-0">
            {(heroAlt || hero) && (
              <Image
                src={(heroAlt || hero).url}
                alt="Municipalidad Distrital de La Molina"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/85 via-molina-deep/80 to-emerald-900/70" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-16 lg:py-24">
            <Reveal variant="up">
              <Badge className="bg-white/15 text-emerald-50 ring-1 ring-white/25">
                Institucional
              </Badge>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {GESTION_MUNICIPAL_DATA.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50/90 sm:text-lg">
                Información oficial sobre el alcalde, el concejo municipal, la
                estructura orgánica, comisiones, funcionarios y reconocimientos
                de la Municipalidad Distrital de La Molina.
              </p>
              <a
                href={GESTION_MUNICIPAL_SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-100 hover:underline"
              >
                Ver en portal.munimolina.gob.pe
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </Reveal>
          </div>
        </section>

        <section className="bg-slate-50/70 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Badge variant="mint">Secciones</Badge>
              <h2 className="mt-3 text-3xl font-bold text-molina-deep">
                Conoce la gestión municipal
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-molina-muted">
                Contenido migrado desde el portal institucional, con textos,
                fotografías y datos oficiales.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {GESTION_MUNICIPAL_DATA.sections.map((section, index) => {
                const Icon = SECTION_ICONS[section.slug] ?? Building2;
                return (
                  <Reveal
                    key={section.slug}
                    variant="up"
                    delayMs={(index % 6) * 45}
                  >
                    <Link
                      href={`/gestion-municipal/${section.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-molina-mint/50 hover:shadow-lg"
                    >
                      <Icon
                        className="h-8 w-8 text-molina-teal transition-transform group-hover:scale-105"
                        aria-hidden
                      />
                      <h3 className="mt-4 text-lg font-bold text-molina-deep">
                        {section.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-molina-muted">
                        {section.summary}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-molina-teal">
                        Ver información
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
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
