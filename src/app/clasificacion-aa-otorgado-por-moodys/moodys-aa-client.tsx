"use client";

import Link from "next/link";
import { ArrowLeft, Award, Building2, CircleHelp, Users } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

const SECTIONS = [
  {
    id: "que-es",
    icon: Building2,
    title: "¿Qué es Moody's?",
    body: [
      "Moody's Local es una agencia de calificación de riesgo que evalúa la capacidad de pago y la solidez financiera de entidades públicas y privadas.",
      "En el ámbito municipal, analiza la gestión fiscal, el endeudamiento, la recaudación, la transparencia y la sostenibilidad de las finanzas del gobierno local.",
      "Sus calificaciones son una referencia reconocida para vecinos, inversionistas y entidades del Estado sobre la salud financiera de la municipalidad.",
    ],
  },
  {
    id: "significa",
    icon: CircleHelp,
    title: "¿Qué significa obtener esta clasificación?",
    body: [
      "La calificación AA− indica una capacidad de pago muy alta y un perfil crediticio sólido, con bajo riesgo de incumplimiento en el corto y mediano plazo.",
      "Moody's ha confirmado que la calificación de la Municipalidad de La Molina continúa estable, reconociendo una gestión fiscal prudente y sostenible.",
      "Esta nota refleja disciplina en el gasto, capacidad de generar ingresos propios y un marco institucional que respalda el cumplimiento de obligaciones.",
    ],
  },
  {
    id: "beneficios",
    icon: Users,
    title: "¿Cómo nos beneficiamos los vecinos?",
    body: [
      "Una buena calificación facilita mejores condiciones de financiamiento para obras y proyectos de interés público, sin sobrecargar indebidamente al vecino.",
      "Refuerza la confianza en la gestión municipal: transparencia, control interno y uso responsable de los recursos públicos.",
      "Contribuye a sostener servicios esenciales —seguridad, limpieza, espacios públicos, trámites digitales— con mayor previsibilidad presupuestal.",
    ],
  },
] as const;

export function MoodysAaClient() {
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
                Gestión financiera
              </Badge>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Award className="h-8 w-8 text-molina-teal" aria-hidden />
                <h1 className="portal-page-title">
                  Clasificación AA− otorgado por Moody&apos;s
                </h1>
              </div>
              <p className="portal-page-lead">
                Moody&apos;s confirma que la calificación de la Municipalidad
                de La Molina continúa estable. Conoce qué implica esta nota y
                cómo beneficia a las vecinas y vecinos del distrito.
              </p>
              <a
                href="https://portal.munimolina.gob.pe/clasificacion-aa-otorgado-por-moodys/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex text-sm font-semibold text-molina-teal hover:underline"
              >
                Ver publicación en el portal oficial →
              </a>
            </Reveal>
          </div>
        </section>

        <section className="py-10 lg:py-14">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-3">
            {SECTIONS.map((section, index) => {
              const Icon = section.icon;
              return (
                <Reveal
                  key={section.id}
                  variant="up"
                  delayMs={80 + index * 80}
                >
                  <article
                    id={section.id}
                    className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-molina-teal">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h2 className="mt-4 text-lg font-bold text-molina-deep">
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-molina-muted">
                    {section.body.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                  </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
