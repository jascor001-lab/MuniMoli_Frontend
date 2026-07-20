import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GESTION_MUNICIPAL_SLUGS } from "@/data/gestion-municipal-data";
import { getGestionMunicipalCmsContent } from "@/lib/cms/portal-content";
import { GestionSectionClient } from "../gestion-section-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return GESTION_MUNICIPAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = getGestionMunicipalCmsContent().sections.find(
    (s) => s.slug === slug,
  );
  if (!section) return { title: "Gestión Municipal" };
  return {
    title: `${section.title} | Gestión Municipal | Municipalidad de La Molina`,
    description: section.summary,
  };
}

export default async function GestionSectionPage({ params }: Props) {
  const { slug } = await params;
  const section = getGestionMunicipalCmsContent().sections.find(
    (s) => s.slug === slug,
  );
  if (!section) notFound();
  return <GestionSectionClient section={section} />;
}
