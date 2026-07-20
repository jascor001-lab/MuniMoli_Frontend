import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTallerCategory,
  TALLERES_SLUGS,
} from "@/data/talleres-data";
import { TallerCategoryClient } from "../taller-category-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return TALLERES_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getTallerCategory(slug);
  if (!category) return { title: "Talleres" };
  return {
    title: `${category.title} | Talleres | Municipalidad de La Molina`,
    description: `Información oficial de talleres ${category.title} de la Municipalidad Distrital de La Molina.`,
  };
}

export default async function TallerCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getTallerCategory(slug);
  if (!category) notFound();
  return <TallerCategoryClient category={category} />;
}
