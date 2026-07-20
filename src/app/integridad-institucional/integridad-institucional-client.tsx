"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  FileDown,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  INTEGRITY_COMPONENTS,
  INTEGRITY_DOCUMENTS,
  INTEGRITY_SOURCE_URL,
  INTEGRITY_TOPICS,
  type IntegrityTopic,
} from "@/data/integrity-data";

const CONTENT_LINKS = [
  { id: "conceptos", label: "Conceptos" },
  { id: "componentes", label: "Componentes" },
  { id: "denuncias", label: "Denuncias" },
  { id: "implementacion", label: "Implementación" },
  { id: "etica", label: "Ética" },
  { id: "anticorrupcion", label: "9 de diciembre" },
  { id: "documentos", label: "Documentos 2026" },
] as const;

function TopicSection({
  topic,
  index,
}: {
  topic: IntegrityTopic;
  index: number;
}) {
  const imageFirst = index % 2 === 1;

  return (
    <Reveal
      variant="up"
      as="article"
      className="grid items-center gap-8 border-b border-slate-100 py-10 last:border-b-0 lg:grid-cols-2 lg:py-14"
    >
      <div className={imageFirst ? "lg:order-2" : undefined}>
        <Badge variant="mint">Integridad pública</Badge>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-molina-deep sm:text-3xl">
          {topic.title}
        </h2>
        <p className="mt-4 text-base leading-7 text-molina-muted">
          {topic.description}
        </p>
      </div>
      <div
        className={
          imageFirst
            ? "overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 lg:order-1"
            : "overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
        }
      >
        <Image
          src={topic.image}
          alt={topic.imageAlt}
          width={950}
          height={950}
          className="h-auto w-full object-contain"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
    </Reveal>
  );
}

export function IntegridadInstitucionalClient() {
  const conceptualTopics = INTEGRITY_TOPICS.slice(0, 6);
  const ethicsTopic = INTEGRITY_TOPICS[6];

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <section className="border-b border-emerald-900/10 bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-10 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-molina-teal hover:text-molina-mint"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Link>
              <Badge variant="mint" className="mt-5">
                Institucional
              </Badge>
              <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-molina-deep sm:text-4xl lg:text-5xl">
                Integridad Institucional
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-molina-muted sm:text-lg">
                Conoce los principios, políticas y mecanismos que orientan la
                conducta ética, la transparencia y la prevención de la
                corrupción en la Municipalidad Distrital de La Molina.
              </p>
              <a
                href={INTEGRITY_SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-molina-teal hover:underline"
              >
                Consultar fuente institucional
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </Reveal>
          </div>
        </section>

        <nav
          aria-label="Contenido de Integridad Institucional"
          className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"
        >
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3">
            {CONTENT_LINKS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-molina-deep transition-colors hover:border-molina-mint/40 hover:bg-emerald-50"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <section
          id="conceptos"
          className="scroll-mt-20 bg-white"
          aria-label="Conceptos de integridad pública"
        >
          <div className="mx-auto max-w-7xl px-4">
            {conceptualTopics.map((topic, index) => (
              <TopicSection key={topic.id} topic={topic} index={index} />
            ))}
          </div>
        </section>

        <section
          id="componentes"
          className="scroll-mt-20 border-y border-slate-100 bg-slate-50/70 py-12 lg:py-16"
          aria-labelledby="components-heading"
        >
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Badge variant="mint">Modelo de Integridad</Badge>
              <h2
                id="components-heading"
                className="mt-3 text-3xl font-bold text-molina-deep"
              >
                Los nueve componentes
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-molina-muted">
                La implementación del Modelo de Integridad articula estos
                componentes en todas las áreas de la Municipalidad.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {INTEGRITY_COMPONENTS.map((component, index) => (
                <Reveal
                  key={component.title}
                  variant="up"
                  delayMs={60 + index * 60}
                >
                  <article className="h-full rounded-2xl border border-slate-200 bg-white p-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-molina-deep">
                      {index + 1}
                    </span>
                    <h3 className="mt-4 font-bold text-molina-deep">
                      {component.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-molina-muted">
                      {component.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal
              variant="up"
              className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
            >
              <Image
                src="/images/integridad/componentes-modelo.jpeg"
                alt="Infografía oficial con la descripción de los nueve componentes del Modelo de Integridad"
                width={724}
                height={1024}
                className="h-auto w-full"
                sizes="(min-width: 768px) 768px, 100vw"
              />
            </Reveal>
          </div>
        </section>

        <section
          id="denuncias"
          className="scroll-mt-20 py-12 lg:py-16"
          aria-labelledby="complaints-heading"
        >
          <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal variant="right">
              <Badge variant="mint">Canal seguro</Badge>
              <h2
                id="complaints-heading"
                className="mt-3 text-3xl font-bold text-molina-deep"
              >
                Denuncias por presuntos actos de corrupción
              </h2>
              <p className="mt-4 leading-7 text-molina-muted">
                Si eres víctima o testigo de un acto de corrupción cometido por
                un funcionario o servidor municipal, puedes presentar tu
                denuncia ante la Oficina General de Integridad Institucional.
              </p>

              <ul className="mt-6 space-y-4">
                <li className="flex gap-3 rounded-xl bg-emerald-50 p-4">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-molina-teal" />
                  <div>
                    <p className="text-sm font-bold text-molina-deep">
                      Línea telefónica directa
                    </p>
                    <a
                      href="tel:968793625"
                      className="mt-1 block text-sm text-molina-teal hover:underline"
                    >
                      968 793 625
                    </a>
                    <a
                      href="tel:017544000"
                      className="block text-sm text-molina-teal hover:underline"
                    >
                      (01) 754 4000 — Anexo 457
                    </a>
                  </div>
                </li>
                <li className="flex gap-3 rounded-xl bg-emerald-50 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-molina-teal" />
                  <div>
                    <p className="text-sm font-bold text-molina-deep">
                      Plataforma Digital Única de Denuncias
                    </p>
                    <a
                      href="https://denuncias.servicios.gob.pe/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm text-molina-teal hover:underline"
                    >
                      Presentar denuncia
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </div>
                </li>
                <li className="flex gap-3 rounded-xl bg-emerald-50 p-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-molina-teal" />
                  <div>
                    <p className="text-sm font-bold text-molina-deep">
                      Atención presencial
                    </p>
                    <p className="mt-1 text-sm leading-6 text-molina-muted">
                      Av. Ricardo Elías Aparicio 740, La Molina — Sede Central,
                      al costado de la Oficina de Abastecimiento.
                      <br />
                      Lunes a viernes de 8:00 a.m. a 5:30 p.m.
                    </p>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal
              variant="left"
              delayMs={120}
              className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
            >
              <Image
                src="/images/integridad/canal-denuncias.jpeg"
                alt="Canales oficiales para denunciar presuntos actos de corrupción"
                width={1024}
                height={1024}
                className="h-auto w-full"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </Reveal>
          </div>
        </section>

        <section
          id="implementacion"
          className="scroll-mt-20 border-y border-slate-100 bg-slate-50/70 py-12 lg:py-16"
          aria-labelledby="implementation-heading"
        >
          <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2 lg:items-center">
            <Reveal variant="right">
              <Badge variant="mint">Gestión institucional</Badge>
              <h2
                id="implementation-heading"
                className="mt-3 text-3xl font-bold text-molina-deep"
              >
                Implementación del Modelo de Integridad
              </h2>
              <p className="mt-4 leading-7 text-molina-muted">
                En la Municipalidad Distrital de La Molina, la Oficina General
                de Integridad Institucional es la encargada de implementar el
                Modelo de Integridad. Sus funciones se encuentran en el
                Reglamento de Organización y Funciones vigente, aprobado por
                Ordenanza N.° 0464/MDLM del 28 de febrero de 2025.
              </p>
            </Reveal>
            <Reveal
              variant="left"
              delayMs={120}
              className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
            >
              <Image
                src="/images/integridad/implementacion-modelo.png"
                alt="Infografía sobre la implementación del Modelo de Integridad en La Molina"
                width={1024}
                height={575}
                className="h-auto w-full"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>
          </div>
        </section>

        <section
          id="etica"
          className="scroll-mt-20 bg-white"
          aria-label="Ética en la función pública"
        >
          <div className="mx-auto max-w-7xl px-4">
            <TopicSection topic={ethicsTopic} index={0} />
          </div>
        </section>

        <section
          id="anticorrupcion"
          className="scroll-mt-20 border-y border-slate-100 bg-slate-50/70 py-12 lg:py-16"
          aria-labelledby="anti-corruption-heading"
        >
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Badge variant="mint">Concientización</Badge>
              <h2
                id="anti-corruption-heading"
                className="mt-3 text-3xl font-bold text-molina-deep"
              >
                9 de diciembre: Día Internacional contra la Corrupción
              </h2>
              <p className="mt-4 max-w-4xl leading-7 text-molina-muted">
                La Asamblea General de las Naciones Unidas designó el 9 de
                diciembre como Día Internacional contra la Corrupción para
                promover la conciencia frente a este problema. La corrupción
                afecta el desarrollo social y económico, las instituciones
                democráticas y el Estado de derecho.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {[
                {
                  src: "/images/integridad/dia-anticorrupcion-1.png",
                  alt: "Definición y prevención de la corrupción",
                },
                {
                  src: "/images/integridad/dia-anticorrupcion-2.png",
                  alt: "Consecuencias sociales de la corrupción",
                },
              ].map((image, index) => (
                <Reveal
                  key={image.src}
                  variant="up"
                  delayMs={80 + index * 100}
                  className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1024}
                    height={576}
                    className="h-auto w-full"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="documentos"
          className="scroll-mt-20 py-12 lg:py-16"
          aria-labelledby="documents-heading"
        >
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Badge variant="mint">Documentos oficiales</Badge>
              <h2
                id="documents-heading"
                className="mt-3 text-3xl font-bold text-molina-deep"
              >
                Compromisos y Programa de Integridad 2026
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-molina-muted">
                Los documentos han sido incorporados al portal nuevo para
                conservar su disponibilidad institucional.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {INTEGRITY_DOCUMENTS.map((document, index) => (
                <Reveal
                  key={document.href}
                  variant="up"
                  delayMs={80 + index * 100}
                >
                  <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-molina-teal">
                      <CalendarDays className="h-4 w-4" aria-hidden />
                      {document.date}
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-molina-deep">
                      {document.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-molina-muted">
                      {document.description}
                    </p>
                    <a
                      href={document.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 self-start rounded-xl bg-molina-deep px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-molina-teal"
                    >
                      <FileDown className="h-4 w-4" aria-hidden />
                      Ver documento PDF
                    </a>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
