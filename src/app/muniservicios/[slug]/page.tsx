import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  MUNICIPAL_SERVICE_CATEGORIES,
  getMunicipalServiceCategory,
  mergeMunicipalServiceContent,
} from "@/data/municipal-services";
import { MuniserviciosCategoryClient } from "../muniservicios-category-client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return MUNICIPAL_SERVICE_CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getMunicipalServiceCategory(slug);
  if (!category) return {};

  return {
    title: `${category.title} | Muniservicios La Molina`,
    description: category.summary,
  };
}

export default async function MunicipalServiceCategoryPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const base = getMunicipalServiceCategory(slug);
  if (!base) notFound();

  const [category] = mergeMunicipalServiceContent([base]);

  return <MuniserviciosCategoryClient category={category} />;
}
