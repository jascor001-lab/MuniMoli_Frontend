import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOLINA_TV_SLUGS, type MolinaTvCategory } from "@/data/molina-tv-data";
import { getMolinaTvCmsContent } from "@/lib/cms/portal-content";
import { MolinaTvCategoryClient } from "../molina-tv-category-client";

type Props = {
  params: Promise<{ slug: string }>;
};

async function findCategory(slug: string): Promise<MolinaTvCategory | null> {
  const cms = await getMolinaTvCmsContent();
  const categories = cms.categories ?? [];
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function generateStaticParams() {
  try {
    const cms = await getMolinaTvCmsContent();
    const slugs = (cms.categories ?? []).map((c) => c.slug);
    if (slugs.length) return slugs.map((slug) => ({ slug }));
  } catch {
    /* fallback estático */
  }
  return MOLINA_TV_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await findCategory(slug);
  if (!category) return { title: "La Molina TV" };
  return {
    title: `${category.title} | La Molina TV | Municipalidad de La Molina`,
    description: `Contenidos oficiales de ${category.title} en La Molina TV.`,
  };
}

export default async function MolinaTvCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await findCategory(slug);
  if (!category) notFound();
  return <MolinaTvCategoryClient category={category} />;
}
