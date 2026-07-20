import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileDown } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  getLegalNormCategory,
  LEGAL_NORM_CATEGORIES,
} from "@/data/legal-publications-data";
import { getNormasCmsContent } from "@/lib/cms/portal-content";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return LEGAL_NORM_CATEGORIES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cms = getNormasCmsContent();
  const categories = (cms.categories as typeof LEGAL_NORM_CATEGORIES) || LEGAL_NORM_CATEGORIES;
  const category = categories.find((c) => c.id === id) || getLegalNormCategory(id);
  if (!category) return { title: "Normas legales" };
  return {
    title: `${category.title} | Normas Legales | Municipalidad de La Molina`,
    description: category.description,
  };
}

export default async function NormaCategoryPage({ params }: Props) {
  const { id } = await params;
  const cms = getNormasCmsContent();
  const categories =
    (cms.categories as typeof LEGAL_NORM_CATEGORIES) || LEGAL_NORM_CATEGORIES;
  const category =
    categories.find((c) => c.id === id) || getLegalNormCategory(id);
  if (!category) notFound();

  const documents = category.documents || [];

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <section className="portal-page-hero">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <Link
                href="/normas-legales-y-publicaciones"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-molina-teal hover:text-molina-mint"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Normas Legales
              </Link>
              <Badge variant="mint" className="mt-4">
                Normas
              </Badge>
              <h1 className="portal-page-title mt-3">{category.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-molina-muted sm:text-base">
                {category.description}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            {documents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <p className="text-sm font-semibold text-molina-deep">
                  Aún no hay documentos cargados en esta categoría
                </p>
                <p className="mt-2 text-sm text-molina-muted">
                  Los PDF y archivos se agregan desde el panel interno
                  (Normas Legales) y quedan disponibles aquí para consulta.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {documents.map((doc, index) => (
                  <li key={`${doc.href}-${index}`}>
                    <a
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition hover:border-molina-mint/40 hover:bg-emerald-50/50"
                    >
                      <FileDown className="mt-0.5 h-5 w-5 shrink-0 text-molina-teal" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-molina-deep">
                          {doc.title}
                        </span>
                        {doc.date ? (
                          <span className="mt-1 block text-xs text-molina-muted">
                            {doc.date}
                          </span>
                        ) : null}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
