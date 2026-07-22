"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { SOCIAL_BRAND_ICONS, resolveSocialBrandId } from "@/components/ui/social-icons";
import { MunicipalityMapLazy } from "@/components/sections/MunicipalityMapLazy";
import { usePortalCms } from "@/components/cms/portal-cms";

function telHref(number: string) {
  const digits = number.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : undefined;
}

export function ContactoPageClient() {
  const { contacto } = usePortalCms();
  const contact = contacto.contact;
  const phones = contacto.phones;
  const socialLinks = contacto.socialLinks;

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <section className="portal-page-hero">
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
              <h1 className="portal-page-title mt-3">
                Contáctanos
              </h1>
              <p className="mt-2 max-w-3xl text-molina-muted">
                Información oficial de comunicación con la Municipalidad
                Distrital de La Molina y canales del portal digital.
              </p>

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
                        {contact.address}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-molina-mint" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-molina-muted">
                        Horario de atención
                      </p>
                      {contact.hours ? (
                        <p className="mt-0.5 whitespace-pre-line font-medium text-molina-ink">
                          {contact.hours}
                        </p>
                      ) : null}
                      {contact.hoursWeekdays ? (
                        <p className="mt-0.5 font-medium text-molina-ink">
                          {contact.hoursWeekdays}
                        </p>
                      ) : null}
                      {contact.hoursSaturday ? (
                        <p className="font-medium text-molina-ink">
                          {contact.hoursSaturday}
                        </p>
                      ) : null}
                      {!contact.hours &&
                      !contact.hoursWeekdays &&
                      !contact.hoursSaturday ? (
                        <p className="mt-0.5 text-sm text-molina-muted">
                          Horario no registrado
                        </p>
                      ) : null}
                      {contact.hoursNote ? (
                        <p className="mt-2 text-xs leading-relaxed text-molina-muted">
                          {contact.hoursNote}
                        </p>
                      ) : null}
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-molina-mint" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-molina-muted">
                        Central telefónica
                      </p>
                      <a
                        href={telHref(contact.phone)}
                        className="mt-0.5 block text-2xl font-bold text-molina-deep hover:text-molina-teal"
                      >
                        {contact.phone}
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
                  <Link
                    href="/plataforma-digital"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-molina-deep transition-colors hover:bg-emerald-50"
                  >
                    Ir a la Plataforma Digital
                  </Link>
                  <Link
                    href="/tramites-municipales"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Ver trámites municipales
                  </Link>
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
              {phones.map((item, index) => {
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
              {socialLinks.map((social, index) => {
                const brandId = resolveSocialBrandId(
                  social.id,
                  social.label,
                  social.href,
                );
                const Icon = brandId ? SOCIAL_BRAND_ICONS[brandId] : null;
                return (
                  <Reveal
                    key={`${brandId || social.id || social.href}-${index}`}
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
                        {Icon ? (
                          <Icon className="h-6 w-6" title={social.label} />
                        ) : (
                          <span className="text-xs font-bold text-molina-teal">
                            {(social.label || "?").slice(0, 2).toUpperCase()}
                          </span>
                        )}
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
