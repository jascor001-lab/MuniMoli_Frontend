import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOLINA_TV_SLUGS } from "@/data/molina-tv-data";
import { getMolinaTvCmsContent } from "@/lib/cms/portal-content";
import { MolinaTvCategoryClient } from "../molina-tv-category-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return MOLINA_TV_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getMolinaTvCmsContent().categories.find((c) => c.slug === slug);
  if (!category) return { title: "La Molina TV" };
  return {
    title: `${category.title} | La Molina TV | Municipalidad de La Molina`,
    description: `Contenidos oficiales de ${category.title} en La Molina TV.`,
  };
}

export default async function MolinaTvCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getMolinaTvCmsContent().categories.find((c) => c.slug === slug);
  if (!category) notFound();
  return <MolinaTvCategoryClient category={category} />;
}
