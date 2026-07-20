"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
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
import { usePortalCms } from "@/components/cms/portal-cms";

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
  const { gestionMunicipal } = usePortalCms();
  const hero = gestionMunicipal.images[0];
  const heroAlt = gestionMunicipal.images[1];
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
          <div className="relative mx-auto max-w-7xl px-4 portal-page-hero-dark">
            <Reveal variant="up">
              <Badge className="bg-white/15 text-emerald-50 ring-1 ring-white/25">
                Institucional
              </Badge>
              <h1 className="mt-3 max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                {gestionMunicipal.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/90 sm:text-base">
                Información oficial sobre el alcalde, el concejo municipal, la
                estructura orgánica, comisiones, funcionarios y reconocimientos
                de la Municipalidad Distrital de La Molina.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-slate-50/70 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Badge variant="mint">Secciones</Badge>
              <h2 className="mt-3 text-2xl font-bold text-molina-deep sm:text-3xl">
                Conoce la gestión municipal
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-molina-muted">
                Contenido migrado desde el portal institucional, con textos,
                fotografías y datos oficiales.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gestionMunicipal.sections.map((section, index) => {
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
