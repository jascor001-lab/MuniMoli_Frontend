"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Mail,
  Phone,
} from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { SafeImage } from "@/components/ui/safe-image";
import type {
  MunicipalServiceCategory,
  MunicipalServiceItem,
  MunicipalServiceTable,
} from "@/data/municipal-services";

type Props = {
  category: MunicipalServiceCategory;
};

function shortTabLabel(title: string) {
  const cleaned = title
    .replace(/^Gerencia de\s+/i, "")
    .replace(/^Certificado de\s+/i, "")
    .replace(/^Programa\s+/i, "")
    .trim();
  const words = cleaned.split(/\s+/);
  if (words.length <= 4) return cleaned.toUpperCase();
  return words.slice(0, 4).join(" ").toUpperCase();
}

function tabIconUrl(service: MunicipalServiceItem) {
  if (service.iconUrl) return service.iconUrl;
  const first = service.images?.find(
    (url) => !url.includes("/tabs/") && !/icon/i.test(url),
  );
  return first ?? null;
}

function galleryImages(service: MunicipalServiceItem) {
  return (service.images ?? []).filter(
    (url) => !url.includes("/tabs/") && !/icon|tab/i.test(url),
  );
}

function ContactLine({ value }: { value: string }) {
  const isEmail = value.includes("@");
  const Icon = isEmail ? Mail : Phone;
  return (
    <p className="mt-4 flex items-start gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-molina-teal">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      {value}
    </p>
  );
}

function ServiceTable({ table }: { table: MunicipalServiceTable }) {
  const hasHeaders = Boolean(table.headers?.length);
  const headers = hasHeaders
    ? table.headers!
    : table.rows[0]?.length
      ? table.rows[0]
      : [];
  const bodyRows = hasHeaders ? table.rows : table.rows.slice(1);

  if (!headers.length && !bodyRows.length) return null;

  return (
    <div className="table-scroll mt-5 rounded-xl border border-slate-200 sm:overflow-hidden">
      <table className="min-w-[36rem] w-full border-collapse text-left text-sm sm:min-w-full">
        {headers.length > 0 && (
          <thead className="bg-emerald-50/80">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={`${header}-${index}`}
                  scope="col"
                  className="whitespace-nowrap border-b border-emerald-100 px-3 py-2.5 font-semibold text-molina-deep sm:px-4 sm:py-3"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {bodyRows.map((row, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className="border-b border-slate-100 px-3 py-2.5 align-top text-slate-700 sm:px-4 sm:py-3"
                >
                  <span className="break-words">{cell}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ServiceTabIcon({
  service,
  active,
}: {
  service: MunicipalServiceItem;
  active: boolean;
}) {
  const icon = tabIconUrl(service);
  const initial = service.title.trim().charAt(0).toUpperCase() || "?";

  if (icon) {
    return (
      <span
        className={`relative mb-2 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white ring-2 transition ${
          active ? "ring-molina-mint" : "ring-slate-200"
        }`}
      >
        <SafeImage
          src={icon}
          alt=""
          width={56}
          height={56}
          className="h-full w-full object-contain p-1.5"
        />
      </span>
    );
  }

  return (
    <span
      className={`mb-2 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold transition ${
        active
          ? "bg-molina-teal text-white ring-2 ring-molina-mint"
          : "bg-emerald-50 text-molina-deep ring-2 ring-slate-200"
      }`}
      aria-hidden
    >
      {initial}
    </span>
  );
}

function ServiceContent({ service }: { service: MunicipalServiceItem }) {
  const photos = galleryImages(service);
  const paragraphs =
    service.body && service.body.length > 0
      ? service.body
      : [service.summary].filter(Boolean);

  return (
    <article
      id={service.slug}
      className="scroll-mt-36 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <h2 className="text-2xl font-bold text-molina-deep sm:text-3xl">
            {service.title}
          </h2>

          <div className="mt-4 space-y-3">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-sm leading-7 text-molina-muted sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {service.details && service.details.length > 0 && (
            <ul className="mt-5 space-y-2">
              {service.details.map((detail) => (
                <li
                  key={detail}
                  className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-molina-mint"
                    aria-hidden
                  />
                  {detail}
                </li>
              ))}
            </ul>
          )}

          {service.sections?.map((section) => (
            <section key={section.title} className="mt-8">
              <h3 className="text-lg font-bold text-molina-deep">
                {section.title}
              </h3>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-sm leading-7 text-molina-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.lists?.map((list, listIndex) => (
                <ul key={`list-${listIndex}`} className="mt-4 space-y-2">
                  {list.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-molina-mint"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              ))}
              {section.tables?.map((table, tableIndex) => (
                <ServiceTable key={`section-table-${tableIndex}`} table={table} />
              ))}
            </section>
          ))}

          {service.tables?.map((table, tableIndex) => (
            <ServiceTable key={`table-${tableIndex}`} table={table} />
          ))}

          {photos.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-molina-deep">Galería</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((src) => (
                  <div
                    key={src}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100"
                  >
                    <SafeImage
                      src={src}
                      alt={`Imagen de ${service.title}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.documents && service.documents.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-molina-deep">
                Documentos
              </h3>
              <ul className="mt-4 space-y-2">
                {service.documents.map((doc) => (
                  <li key={doc.href}>
                    <a
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-molina-teal transition-colors hover:border-molina-mint/50 hover:bg-emerald-50"
                    >
                      <FileText className="h-4 w-4 shrink-0" aria-hidden />
                      <span>{doc.label}</span>
                      <Download className="h-4 w-4 shrink-0" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.audience && (
            <p className="mt-4 text-sm text-slate-700">
              <strong>Dirigido a:</strong> {service.audience}
            </p>
          )}
          {service.availability && (
            <p className="mt-2 text-sm text-slate-700">
              <strong>Disponibilidad:</strong> {service.availability}
            </p>
          )}
          {service.contact && <ContactLine value={service.contact} />}
        </div>

        {service.action &&
          (service.action.external ? (
            <a
              href={service.action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-molina-teal px-5 text-sm font-semibold text-white transition-colors hover:bg-molina-deep"
            >
              {service.action.label}
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          ) : (
            <Link
              href={service.action.href}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-molina-teal px-5 text-sm font-semibold text-white transition-colors hover:bg-molina-deep"
            >
              {service.action.label}
            </Link>
          ))}
      </div>
    </article>
  );
}

export function MuniserviciosCategoryClient({ category }: Props) {
  const firstSlug = category.services[0]?.slug ?? "";
  const [activeSlug, setActiveSlug] = useState(firstSlug);

  const activeService = useMemo(
    () =>
      category.services.find((service) => service.slug === activeSlug) ??
      category.services[0],
    [activeSlug, category.services],
  );

  useEffect(() => {
    const readHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && category.services.some((service) => service.slug === hash)) {
        setActiveSlug(hash);
        requestAnimationFrame(() => {
          document
            .getElementById("servicio-contenido")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };

    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [category.services]);

  const selectService = (slug: string) => {
    setActiveSlug(slug);
    const url = `${window.location.pathname}#${slug}`;
    window.history.replaceState(null, "", url);
    requestAnimationFrame(() => {
      document
        .getElementById("servicio-contenido")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <section className="relative overflow-hidden border-b border-emerald-100">
          <div className="absolute inset-0">
            <Image
              src={category.imageUrl}
              alt={category.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-molina-deep/80 to-molina-teal/55" />
          </div>
          <div className="relative mx-auto max-w-6xl px-4 portal-page-hero-dark">
            <Reveal variant="up">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/muniservicios"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-100 hover:text-white hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Volver a Muniservicios
                </Link>
                <Badge className="bg-white/15 text-white ring-1 ring-white/25">
                  {category.services.length}{" "}
                  {category.services.length === 1 ? "servicio" : "servicios"}
                </Badge>
              </div>
              <h1 className="mt-3 max-w-4xl text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                {category.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90 sm:text-base">
                {category.summary}
              </p>
            </Reveal>
          </div>
        </section>

        {(category.mission || category.vision) && (
          <section className="border-b border-slate-100 bg-white py-10">
            <div className="mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-2">
              {category.mission && (
                <Reveal variant="right">
                  <article className="h-full rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
                    <h2 className="text-lg font-bold text-molina-deep">
                      Misión
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-molina-muted">
                      {category.mission}
                    </p>
                  </article>
                </Reveal>
              )}
              {category.vision && (
                <Reveal variant="left">
                  <article className="h-full rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <h2 className="text-lg font-bold text-molina-deep">
                      Visión
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-molina-muted">
                      {category.vision}
                    </p>
                  </article>
                </Reveal>
              )}
            </div>
          </section>
        )}

        <section className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <nav
              aria-label="Servicios de la categoría"
              className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch]"
            >
              {category.services.map((service) => {
                const active = service.slug === activeService?.slug;
                return (
                  <button
                    key={service.slug}
                    type="button"
                    onClick={() => selectService(service.slug)}
                    className={`flex min-w-[7.5rem] max-w-[9.5rem] shrink-0 flex-col items-center rounded-xl px-2 py-2 text-center transition ${
                      active
                        ? "bg-emerald-50"
                        : "hover:bg-slate-50"
                    }`}
                    aria-current={active ? "true" : undefined}
                  >
                    <ServiceTabIcon service={service} active={active} />
                    <span
                      className={`text-[10px] font-bold leading-tight tracking-wide ${
                        active ? "text-molina-teal" : "text-slate-600"
                      }`}
                    >
                      {shortTabLabel(service.title)}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </section>

        <section className="bg-slate-50/70 py-10 lg:py-14">
          <div className="mx-auto max-w-6xl px-4">
            <nav
              aria-label="Migas de pan"
              className="mb-6 text-sm text-molina-muted"
            >
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link
                    href="/muniservicios"
                    className="font-semibold text-molina-teal hover:underline"
                  >
                    Muniservicios
                  </Link>
                </li>
                <li aria-hidden className="text-slate-300">
                  ›
                </li>
                <li>
                  <Link
                    href={`/muniservicios/${category.slug}`}
                    className="font-semibold text-molina-teal hover:underline"
                  >
                    {category.shortTitle}
                  </Link>
                </li>
                {activeService && (
                  <>
                    <li aria-hidden className="text-slate-300">
                      ›
                    </li>
                    <li className="font-medium text-molina-deep">
                      {activeService.title}
                    </li>
                  </>
                )}
              </ol>
            </nav>

            <div id="servicio-contenido" className="scroll-mt-36">
              {activeService ? (
                <Reveal variant="up" key={activeService.slug}>
                  <ServiceContent service={activeService} />
                </Reveal>
              ) : (
                <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-molina-muted">
                  No hay servicios disponibles en esta categoría.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
