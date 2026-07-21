import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TALLERES_SLUGS, type TallerCategory } from "@/data/talleres-data";
import { getTalleresCmsContent } from "@/lib/cms/portal-content";
import { TallerCategoryClient } from "../taller-category-client";

type Props = {
  params: Promise<{ slug: string }>;
};

async function findCategory(slug: string): Promise<TallerCategory | null> {
  const cms = await getTalleresCmsContent();
  const categories = cms.categories ?? [];
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function generateStaticParams() {
  try {
    const cms = await getTalleresCmsContent();
    const slugs = (cms.categories ?? []).map((c) => c.slug);
    if (slugs.length) return slugs.map((slug) => ({ slug }));
  } catch {
    /* fallback estático */
  }
  return TALLERES_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await findCategory(slug);
  if (!category) return { title: "Talleres" };
  return {
    title: `${category.title} | Talleres | Municipalidad de La Molina`,
    description: `Información oficial de talleres ${category.title} de la Municipalidad Distrital de La Molina.`,
  };
}

export default async function TallerCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await findCategory(slug);
  if (!category) notFound();
  return <TallerCategoryClient category={category} />;
}
