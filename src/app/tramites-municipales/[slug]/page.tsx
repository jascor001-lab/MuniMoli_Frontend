import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Coins,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
  MapPin,
  UserRound,
} from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { TupaPageClient } from "@/app/tramites-municipales/tupa-client";
import {
  MUNICIPAL_PROCEDURE_ALIASES,
  MUNICIPAL_PROCEDURES,
  getMunicipalProcedure,
} from "@/data/municipal-procedures";
import procedureDownloads from "@/data/municipal-procedure-downloads.json";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [
    ...MUNICIPAL_PROCEDURES.map((procedure) => procedure.slug),
    ...Object.keys(MUNICIPAL_PROCEDURE_ALIASES),
  ].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const procedure = getMunicipalProcedure(slug);
  if (!procedure) return {};
  return {
    title: `${procedure.title} | Municipalidad de La Molina`,
    description: procedure.summary,
  };
}

export default async function MunicipalProcedurePage({ params }: PageProps) {
  const { slug } = await params;
  const canonicalSlug = MUNICIPAL_PROCEDURE_ALIASES[slug];
  if (canonicalSlug) redirect(`/tramites-municipales/${canonicalSlug}`);
  const procedure = getMunicipalProcedure(slug);
  if (!procedure) notFound();
  if (procedure.slug === "tupa") return <TupaPageClient />;
  const downloads = procedureDownloads.filter(
    (document) => document.procedureSlug === procedure.slug,
  );

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-10 lg:py-14">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal variant="up">
              <Link
                href="/tramites-municipales"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-molina-teal hover:underline"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Volver a Trámites Municipales
              </Link>
              <div className="mt-5 flex flex-wrap gap-2">
                {procedure.categories.map((category) => (
                  <Badge key={category} variant="mint">
                    {category}
                  </Badge>
                ))}
              </div>
              <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-molina-deep sm:text-4xl lg:text-5xl">
                {procedure.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-molina-muted sm:text-lg">
                {procedure.summary}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-white py-10">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-2 lg:grid-cols-4">
            <Reveal variant="up">
              <article className="h-full rounded-2xl border border-slate-200 p-5">
                <UserRound className="h-6 w-6 text-molina-teal" aria-hidden />
                <h2 className="mt-3 text-sm font-bold text-molina-deep">
                  Dirigido a
                </h2>
                <p className="mt-2 text-sm leading-6 text-molina-muted">
                  {procedure.directedTo}
                </p>
              </article>
            </Reveal>
            <Reveal variant="up" delayMs={70}>
              <article className="h-full rounded-2xl border border-slate-200 p-5">
                <Clock3 className="h-6 w-6 text-molina-teal" aria-hidden />
                <h2 className="mt-3 text-sm font-bold text-molina-deep">
                  Duración
                </h2>
                <p className="mt-2 text-sm leading-6 text-molina-muted">
                  {procedure.duration}
                </p>
              </article>
            </Reveal>
            <Reveal variant="up" delayMs={140}>
              <article className="h-full rounded-2xl border border-slate-200 p-5">
                <Coins className="h-6 w-6 text-molina-teal" aria-hidden />
                <h2 className="mt-3 text-sm font-bold text-molina-deep">
                  Costo
                </h2>
                <p className="mt-2 text-sm leading-6 text-molina-muted">
                  {procedure.cost}
                </p>
              </article>
            </Reveal>
            <Reveal variant="up" delayMs={210}>
              <article className="h-full rounded-2xl border border-slate-200 p-5">
                <CheckCircle2
                  className="h-6 w-6 text-molina-teal"
                  aria-hidden
                />
                <h2 className="mt-3 text-sm font-bold text-molina-deep">
                  Resultado
                </h2>
                <p className="mt-2 text-sm leading-6 text-molina-muted">
                  {procedure.result}
                </p>
              </article>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-slate-100 bg-slate-50/70 py-12 lg:py-16">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <Reveal variant="right">
                <article className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-xl font-bold text-molina-deep">
                    ¿Cuándo realizarlo?
                  </h2>
                  <p className="mt-3 leading-7 text-molina-muted">
                    {procedure.when}
                  </p>
                  {procedure.validity && (
                    <div className="mt-4 rounded-xl bg-amber-50 p-4">
                      <p className="text-sm font-bold text-amber-800">
                        Vigencia o plazo
                      </p>
                      <p className="mt-1 text-sm leading-6 text-amber-900/80">
                        {procedure.validity}
                      </p>
                    </div>
                  )}
                </article>
              </Reveal>

              <Reveal variant="right" delayMs={80}>
                <article className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-xl font-bold text-molina-deep">
                    Requisitos
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {procedure.requirements.map((requirement) => (
                      <li
                        key={requirement}
                        className="flex gap-3 text-sm leading-6 text-molina-muted"
                      >
                        <CheckCircle2
                          className="mt-0.5 h-5 w-5 shrink-0 text-molina-mint"
                          aria-hidden
                        />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>

              <Reveal variant="right" delayMs={120}>
                <article className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-xl font-bold text-molina-deep">
                    Documentación necesaria
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {procedure.documents.map((document) => (
                      <li
                        key={document}
                        className="flex gap-3 text-sm leading-6 text-molina-muted"
                      >
                        <FileText
                          className="mt-0.5 h-5 w-5 shrink-0 text-molina-teal"
                          aria-hidden
                        />
                        {document}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>

              {procedure.fees && procedure.fees.length > 0 && (
                <Reveal variant="right" delayMs={140}>
                  <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 p-6">
                      <h2 className="text-xl font-bold text-molina-deep">
                        Tarifas publicadas
                      </h2>
                      <p className="mt-1 text-sm text-molina-muted">
                        Importes del cuadro informativo institucional.
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-emerald-50 text-molina-deep">
                          <tr>
                            <th className="px-5 py-3 font-bold">Concepto</th>
                            <th className="whitespace-nowrap px-5 py-3 text-right font-bold">
                              Importe
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {procedure.fees.map((fee) => (
                            <tr key={`${fee.concept}-${fee.amount}`}>
                              <td className="px-5 py-3 leading-6 text-molina-muted">
                                {fee.concept}
                              </td>
                              <td className="whitespace-nowrap px-5 py-3 text-right font-bold text-molina-deep">
                                {fee.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                </Reveal>
              )}

              {procedure.legalBasis && procedure.legalBasis.length > 0 && (
                <Reveal variant="right" delayMs={150}>
                  <article className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h2 className="text-xl font-bold text-molina-deep">
                      Base legal
                    </h2>
                    <ul className="mt-4 space-y-3">
                      {procedure.legalBasis.map((rule) => (
                        <li
                          key={rule}
                          className="flex gap-3 text-sm leading-6 text-molina-muted"
                        >
                          <FileText
                            className="mt-0.5 h-5 w-5 shrink-0 text-molina-teal"
                            aria-hidden
                          />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              )}

              {downloads.length > 0 && (
                <Reveal variant="right" delayMs={160}>
                  <article className="rounded-2xl border border-emerald-200 bg-white p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-molina-deep">
                          Formularios y descargas oficiales
                        </h2>
                        <p className="mt-1 text-sm text-molina-muted">
                          {downloads.length}{" "}
                          {downloads.length === 1
                            ? "archivo disponible"
                            : "archivos disponibles"}{" "}
                          en el portal nuevo.
                        </p>
                      </div>
                      <Download
                        className="h-7 w-7 text-molina-teal"
                        aria-hidden
                      />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {downloads.map((document) => (
                        <a
                          key={document.href}
                          href={document.href}
                          download
                          className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-molina-mint hover:bg-emerald-50"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-molina-teal">
                            {document.fileType}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-2 text-sm font-semibold text-molina-deep">
                              {document.label}
                            </span>
                            <span className="mt-1 block text-xs text-molina-muted group-hover:text-molina-teal">
                              Descargar archivo
                            </span>
                          </span>
                          <Download
                            className="h-4 w-4 shrink-0 text-molina-muted group-hover:text-molina-teal"
                            aria-hidden
                          />
                        </a>
                      ))}
                    </div>
                  </article>
                </Reveal>
              )}
            </div>

            <aside className="space-y-6">
              <Reveal variant="left">
                <article className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-xl font-bold text-molina-deep">
                    Canales de atención
                  </h2>
                  <div className="mt-4 space-y-4">
                    {procedure.channels.map((channel, index) => (
                      <div
                        key={`${channel.type}-${index}`}
                        className="rounded-xl bg-emerald-50 p-4"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin
                            className="h-5 w-5 text-molina-teal"
                            aria-hidden
                          />
                          <h3 className="text-sm font-bold text-molina-deep">
                            {channel.type}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-molina-muted">
                          {channel.description}
                        </p>
                        {channel.schedule && (
                          <p className="mt-2 text-xs font-semibold text-molina-teal">
                            {channel.schedule}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  {procedure.action &&
                    (procedure.action.href.startsWith("/") ? (
                      <Link
                        href={procedure.action.href}
                        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-molina-deep px-4 text-sm font-semibold text-white transition-colors hover:bg-molina-teal"
                      >
                        {procedure.action.label}
                      </Link>
                    ) : (
                      <a
                        href={procedure.action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-molina-deep px-4 text-sm font-semibold text-white transition-colors hover:bg-molina-teal"
                      >
                        {procedure.action.label}
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </a>
                    ))}
                </article>
              </Reveal>

              {procedure.faqs && procedure.faqs.length > 0 && (
                <Reveal variant="left" delayMs={100}>
                  <article className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center gap-2">
                      <HelpCircle
                        className="h-5 w-5 text-molina-teal"
                        aria-hidden
                      />
                      <h2 className="text-xl font-bold text-molina-deep">
                        Preguntas frecuentes
                      </h2>
                    </div>
                    <div className="mt-4 space-y-5">
                      {procedure.faqs.map((faq) => (
                        <div key={faq.question}>
                          <h3 className="text-sm font-bold text-molina-ink">
                            {faq.question}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-molina-muted">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                </Reveal>
              )}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
