import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  GESTION_MUNICIPAL_SLUGS,
  type GestionSection,
} from "@/data/gestion-municipal-data";
import { getGestionMunicipalCmsContent } from "@/lib/cms/portal-content";
import { GestionSectionClient } from "../gestion-section-client";

type Props = {
  params: Promise<{ slug: string }>;
};

async function findSection(slug: string): Promise<GestionSection | null> {
  const cms = await getGestionMunicipalCmsContent();
  const sections = cms.sections ?? [];
  return sections.find((s) => s.slug === slug) ?? null;
}

export async function generateStaticParams() {
  try {
    const cms = await getGestionMunicipalCmsContent();
    const slugs = (cms.sections ?? []).map((s) => s.slug);
    if (slugs.length) return slugs.map((slug) => ({ slug }));
  } catch {
    /* fallback estático */
  }
  return GESTION_MUNICIPAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = await findSection(slug);
  if (!section) return { title: "Gestión Municipal" };
  return {
    title: `${section.title} | Gestión Municipal | Municipalidad de La Molina`,
    description: section.summary,
  };
}

export default async function GestionSectionPage({ params }: Props) {
  const { slug } = await params;
  const section = await findSection(slug);
  if (!section) notFound();
  return <GestionSectionClient section={section} />;
}
