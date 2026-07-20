import talleresJson from "./talleres-data.json";

export type TallerImage = {
  url: string;
  sourceUrl: string;
  alt: string;
  title: string;
  bytes: number;
};

export type TallerIcon =
  | { type: "svg"; url: string }
  | { type: "fa"; name: string };

export type TallerCategory = {
  slug: string;
  title: string;
  pageTitle: string;
  breadcrumb: string;
  sourceUrl: string;
  icon: TallerIcon;
  notice: string | null;
  headings: string[];
  images: TallerImage[];
};

export type TalleresData = {
  scrapedAt: string;
  sourceUrl: string;
  title: string;
  categories: TallerCategory[];
};

export const TALLERES_DATA = talleresJson as TalleresData;

export const TALLERES_SOURCE_URL = TALLERES_DATA.sourceUrl;

export function getTallerCategory(slug: string): TallerCategory | undefined {
  return TALLERES_DATA.categories.find((category) => category.slug === slug);
}

export const TALLERES_SLUGS = TALLERES_DATA.categories.map((c) => c.slug);
