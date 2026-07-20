"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
} from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import type {
  GestionSection,
  GestionTable,
} from "@/data/gestion-municipal-data";

type Props = {
  section: GestionSection;
};

function DataTable({ table }: { table: GestionTable }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-emerald-50/80">
          <tr>
            {table.headers.map((header, index) => (
              <th
                key={`${header}-${index}`}
                scope="col"
                className="border-b border-emerald-100 px-4 py-3 font-semibold text-molina-deep"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className="border-b border-slate-100 px-4 py-3 align-top text-molina-ink"
                >
                  {cellIndex === row.length - 1 && cell.includes("@") ? (
                    <a
                      href={`mailto:${cell}`}
                      className="font-medium text-molina-teal hover:underline"
                    >
                      {cell}
                    </a>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GestionSectionClient({ section }: Props) {
  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <section className="portal-page-hero">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Link
                href="/gestion-municipal"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-molina-teal hover:text-molina-mint"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Gestión Municipal
              </Link>
              <Badge variant="mint" className="mt-5">
                Gestión Municipal
              </Badge>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-molina-deep sm:text-4xl">
                {section.title}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-molina-muted">
                {section.summary}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            {/* Alcalde profile */}
            {section.profile ? (
              <Reveal
                variant="up"
                className="mb-12 grid items-start gap-8 lg:grid-cols-[280px_1fr]"
              >
                {section.profile.photo ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                    <div className="relative aspect-square">
                      <Image
                        src={section.profile.photo}
                        alt={section.profile.name}
                        fill
                        className="object-cover"
                        sizes="280px"
                        priority
                      />
                    </div>
                  </div>
                ) : null}
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-molina-teal">
                    {section.profile.role}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-molina-deep sm:text-3xl">
                    {section.profile.name}
                  </h2>
                  <a
                    href={`mailto:${section.profile.email}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-molina-teal hover:underline"
                  >
                    <Mail className="h-4 w-4" aria-hidden />
                    {section.profile.email}
                  </a>
                  <div className="mt-6 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 40)}
                        className="text-base leading-7 text-molina-muted"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ) : null}

            {/* Vision / generic paragraphs + image */}
            {!section.profile &&
            section.paragraphs.length > 0 &&
            section.slug !== "comisiones" &&
            section.slug !== "funcionarios" &&
            section.recognitionBlocks.length === 0 &&
            section.people.length === 0 &&
            section.orgStructure.length === 0 ? (
              <div className="grid items-start gap-10 lg:grid-cols-2">
                <Reveal variant="up">
                  <div className="space-y-5">
                    {section.headings
                      .filter((h) => h !== section.title)
                      .slice(0, 6)
                      .map((heading) => (
                        <div key={heading}>
                          <h2 className="text-xl font-bold text-molina-deep">
                            {heading}
                          </h2>
                        </div>
                      ))}
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 48)}
                        className="text-base leading-7 text-molina-muted"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </Reveal>
                {section.images[0] ? (
                  <Reveal variant="up" delayMs={80}>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="relative aspect-[16/9]">
                        <Image
                          src={section.images[0].url}
                          alt={section.title}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  </Reveal>
                ) : null}
              </div>
            ) : null}

            {/* Concejo people grid */}
            {section.people.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.people.map((person, index) => (
                  <Reveal
                    key={person.email}
                    variant="up"
                    delayMs={(index % 8) * 40}
                  >
                    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      {person.photo ? (
                        <div className="relative aspect-[3/4] bg-slate-100">
                          <Image
                            src={person.photo}
                            alt={person.name}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 640px) 100vw, 25vw"
                          />
                        </div>
                      ) : null}
                      <div className="p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-molina-teal">
                          {person.role}
                        </p>
                        <h2 className="mt-1 text-base font-bold leading-snug text-molina-deep">
                          {person.name}
                        </h2>
                        <a
                          href={`mailto:${person.email}`}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-molina-teal hover:underline"
                        >
                          <Mail className="h-3.5 w-3.5" aria-hidden />
                          {person.email}
                        </a>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            ) : null}

            {/* Org structure */}
            {section.orgStructure.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {section.orgStructure.map((group, index) => (
                  <Reveal
                    key={group.title}
                    variant="up"
                    delayMs={(index % 6) * 40}
                  >
                    <article className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h2 className="text-lg font-bold text-molina-deep">
                        {group.title}
                      </h2>
                      <ul className="mt-4 space-y-2">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 text-sm leading-6 text-molina-muted"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-molina-mint" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                ))}
              </div>
            ) : null}

            {/* Commissions */}
            {section.commissions.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {section.commissions.map((commission, index) => (
                  <Reveal
                    key={commission.title}
                    variant="up"
                    delayMs={(index % 6) * 40}
                  >
                    <article className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h2 className="text-lg font-bold text-molina-deep">
                        {commission.title}
                      </h2>
                      <dl className="mt-4 space-y-2 text-sm">
                        {commission.presidente ? (
                          <div>
                            <dt className="font-semibold text-molina-teal">
                              Presidente
                            </dt>
                            <dd className="text-molina-muted">
                              {commission.presidente}
                            </dd>
                          </div>
                        ) : null}
                        {commission.vicepresidente ? (
                          <div>
                            <dt className="font-semibold text-molina-teal">
                              Vicepresidente
                            </dt>
                            <dd className="text-molina-muted">
                              {commission.vicepresidente}
                            </dd>
                          </div>
                        ) : null}
                        {commission.miembros.length > 0 ? (
                          <div>
                            <dt className="font-semibold text-molina-teal">
                              {commission.miembros.length > 1
                                ? "Miembros"
                                : "Miembro"}
                            </dt>
                            <dd className="text-molina-muted">
                              <ul className="mt-1 space-y-1">
                                {commission.miembros.map((m) => (
                                  <li key={m}>{m}</li>
                                ))}
                              </ul>
                            </dd>
                          </div>
                        ) : null}
                      </dl>
                    </article>
                  </Reveal>
                ))}
              </div>
            ) : null}

            {/* Recognition blocks */}
            {section.recognitionBlocks.length > 0 ? (
              <div className="space-y-12">
                {section.recognitionBlocks.map((block, index) => (
                  <Reveal
                    key={block.title}
                    variant="up"
                    as="article"
                    className="grid items-start gap-8 border-b border-slate-100 pb-12 last:border-b-0 lg:grid-cols-2"
                  >
                    <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                      <h2 className="text-2xl font-bold text-molina-deep">
                        {block.title}
                      </h2>
                      <div className="mt-4 space-y-3">
                        {block.paragraphs.map((paragraph) => (
                          <p
                            key={paragraph.slice(0, 40)}
                            className="text-base leading-7 text-molina-muted"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                    {block.images[0] ? (
                      <div
                        className={
                          index % 2 === 1
                            ? "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:order-1"
                            : "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        }
                      >
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={block.images[0]}
                            alt={block.title}
                            fill
                            className="object-contain p-3"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                      </div>
                    ) : null}
                  </Reveal>
                ))}
              </div>
            ) : null}

            {/* Tables (funcionarios, objetivos) */}
            {section.tables.map((table, index) => (
              <Reveal key={`table-${index}`} variant="up" className="mt-8">
                {section.slug === "funcionarios" ? (
                  <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-molina-muted">
                    <Phone className="h-4 w-4" aria-hidden />
                    Central Telefónica: (01) 754 4000
                  </p>
                ) : null}
                {section.slug === "vision-y-objetivos" ? (
                  <h2 className="text-2xl font-bold text-molina-deep">
                    Objetivos Estratégicos Institucionales
                  </h2>
                ) : null}
                <DataTable table={table} />
              </Reveal>
            ))}

            {/* Documents */}
            {section.documents.length > 0 ? (
              <Reveal variant="up" className="mt-10">
                <h2 className="text-xl font-bold text-molina-deep">
                  Documentos
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {section.documents.map((doc) => (
                    <li key={doc.url}>
                      <a
                        href={doc.url}
                        download
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-molina-deep transition hover:border-molina-mint/40 hover:bg-emerald-50/50"
                      >
                        <Download
                          className="h-4 w-4 shrink-0 text-molina-teal"
                          aria-hidden
                        />
                        {doc.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {/* Fallback gallery for leftover images (e.g. comisiones) */}
            {section.slug === "comisiones" && section.images[0] ? (
              <Reveal variant="up" className="mt-10">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={section.images[0].url}
                      alt="Comisiones del Concejo Municipal"
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                </div>
              </Reveal>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
