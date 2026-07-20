"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { SOCIAL_BRAND_ICONS } from "@/components/ui/social-icons";
import { MunicipalityMapLazy } from "@/components/sections/MunicipalityMapLazy";
import {
  ATTENTION_PHONES,
  MUNICIPAL_CONTACT,
  OFFICIAL_PORTAL_URL,
  SOCIAL_LINKS,
} from "@/data/portal-data";

function telHref(number: string) {
  const digits = number.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : undefined;
}

export function ContactoPageClient() {
  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <section className="border-b border-emerald-900/10 bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-10 lg:py-14">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-molina-teal hover:text-molina-mint"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Link>
              <Badge variant="mint" className="mt-4">
                Atención al vecino
              </Badge>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-molina-deep sm:text-4xl">
                Contáctanos
              </h1>
              <p className="mt-2 max-w-3xl text-molina-muted">
                Información oficial de comunicación con la Municipalidad
                Distrital de La Molina y canales del portal digital.
              </p>
              <a
                href={MUNICIPAL_CONTACT.sobreNosotrosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-molina-teal hover:underline"
              >
                Ver en portal.munimolina.gob.pe
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </Reveal>
          </div>
        </section>

        <section className="py-12 lg:py-16" aria-labelledby="sede-heading">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-6 lg:grid-cols-3">
              <Reveal
                variant="right"
                as="article"
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"
              >
                <h2
                  id="sede-heading"
                  className="text-xl font-bold text-molina-deep"
                >
                  Sede municipal
                </h2>
                <ul className="mt-5 space-y-4">
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-molina-mint" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-molina-muted">
                        Dirección
                      </p>
                      <p className="mt-0.5 font-medium text-molina-ink">
                        {MUNICIPAL_CONTACT.address}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-molina-mint" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-molina-muted">
                        Horario de atención
                      </p>
                      <p className="mt-0.5 font-medium text-molina-ink">
                        {MUNICIPAL_CONTACT.hoursWeekdays}
                      </p>
                      <p className="font-medium text-molina-ink">
                        {MUNICIPAL_CONTACT.hoursSaturday}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-molina-muted">
                        {MUNICIPAL_CONTACT.hoursNote}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-molina-mint" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-molina-muted">
                        Central telefónica
                      </p>
                      <a
                        href={telHref(MUNICIPAL_CONTACT.phone)}
                        className="mt-0.5 block text-2xl font-bold text-molina-deep hover:text-molina-teal"
                      >
                        {MUNICIPAL_CONTACT.phone}
                      </a>
                    </div>
                  </li>
                </ul>
              </Reveal>

              <Reveal
                variant="left"
                delayMs={120}
                as="article"
                className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-molina-deep to-[#0a5c45] p-6 text-white shadow-md"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <UserRound className="h-5 w-5" aria-hidden />
                  </div>
                  <h2 className="mt-4 text-lg font-bold">Portal del Usuario</h2>
                  <p className="mt-2 text-sm text-emerald-100/85">
                    Realiza trámites y solicitudes rápidamente desde el portal
                    digital oficial.
                  </p>
                </div>
                <div className="mt-6 space-y-2">
                  <a
                    href={MUNICIPAL_CONTACT.portalUsuarioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-molina-deep transition-colors hover:bg-emerald-50"
                  >
                    Ir al Portal del Usuario
                    <ExternalLink className="h-4 w-4" aria-hidden />
                  </a>
                  <a
                    href={OFFICIAL_PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Portal municipal
                    <ExternalLink className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="pb-12 lg:pb-16" aria-labelledby="ubicacion-heading">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up" delayMs={80}>
              <MunicipalityMapLazy />
            </Reveal>
          </div>
        </section>

        <section
          className="border-t border-slate-100 bg-slate-50/70 py-12 lg:py-16"
          aria-labelledby="telefonos-heading"
        >
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <h2
                id="telefonos-heading"
                className="text-2xl font-bold text-molina-deep"
              >
                Otros teléfonos de atención
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-molina-muted">
                Líneas de comunicación con áreas y servicios municipales.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ATTENTION_PHONES.map((item, index) => {
                const href = telHref(item.number);
                return (
                  <Reveal
                    key={item.label}
                    variant="up"
                    delayMs={60 + index * 70}
                  >
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-molina-muted">
                        {item.label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="mt-1.5 block text-base font-bold text-molina-deep hover:text-molina-teal"
                        >
                          {item.number}
                        </a>
                      ) : (
                        <p className="mt-1.5 text-base font-bold text-molina-deep">
                          {item.number}
                        </p>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16" aria-labelledby="redes-heading">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <h2
                id="redes-heading"
                className="text-2xl font-bold text-molina-deep"
              >
                Redes sociales
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-molina-muted">
                Síguenos en los canales oficiales de la Municipalidad.
              </p>
            </Reveal>
            <ul className="mt-6 flex flex-wrap gap-4">
              {SOCIAL_LINKS.map((social, index) => {
                const Icon =
                  SOCIAL_BRAND_ICONS[
                    social.id as keyof typeof SOCIAL_BRAND_ICONS
                  ];
                if (!Icon) return null;
                return (
                  <Reveal
                    key={social.id}
                    as="li"
                    variant="up"
                    delayMs={80 + index * 80}
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} — abrir en nueva pestaña`}
                      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-molina-mint/40 hover:shadow-md"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-100 transition-colors group-hover:bg-white">
                        <Icon className="h-6 w-6" title={social.label} />
                      </span>
                      <span className="pr-1 text-sm font-semibold text-molina-ink">
                        {social.label}
                      </span>
                    </a>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
