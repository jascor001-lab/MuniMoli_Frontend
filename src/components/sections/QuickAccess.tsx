"use client";

import { ArrowUpRight } from "lucide-react";
import { AUTHORITIES } from "@/data/portal-data";
import { PLATAFORMA_DIGITAL_PATH } from "@/lib/routes";
import { SafeImage } from "@/components/ui/safe-image";
import { Reveal } from "@/components/ui/reveal";
import { UtilityServices } from "@/components/sections/UtilityServices";

export function QuickAccess() {
  const mayor = AUTHORITIES[0];

  return (
    <section
      className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_#e8f5f0_0%,_#f8fafc_45%,_#ffffff_100%)] py-12 lg:py-16"
      aria-labelledby="quick-access-heading"
    >
      <div
        className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-molina-mint/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4">
        <Reveal
          variant="up"
          className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-molina-teal">
              Servicios municipales
            </p>
            <h2
              id="quick-access-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-molina-deep sm:text-4xl"
            >
              Municipalidad Digital y Accesos del Portal
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-molina-muted sm:text-base">
              Despliega cada categoría y elige el servicio. Sin iconos
              redundantes: solo menús claros y directos.
            </p>
          </div>
          <a
            href={PLATAFORMA_DIGITAL_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-full bg-molina-deep px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-molina-teal hover:shadow-xl hover:shadow-molina-teal/30 lg:self-auto"
          >
            Abrir plataforma digital
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
          {mayor && (
            <Reveal
              variant="right"
              delayMs={100}
              as="aside"
              className="mx-auto w-full max-w-[220px] lg:mx-0 lg:sticky lg:top-24"
            >
              <div className="group overflow-hidden rounded-3xl bg-white shadow-xl shadow-molina-deep/10 ring-1 ring-slate-200/70">
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
                  <SafeImage
                    src={mayor.imageUrl}
                    alt={mayor.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="220px"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-molina-deep to-transparent" />
                </div>
                <div className="bg-gradient-to-br from-molina-deep via-[#0a5c45] to-molina-teal px-4 py-4 text-center">
                  <p className="text-sm font-bold leading-snug text-white">
                    {mayor.name}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-molina-mint-light">
                    {mayor.role}
                  </p>
                </div>
              </div>
            </Reveal>
          )}

          <Reveal variant="left" delayMs={160}>
            <UtilityServices />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
