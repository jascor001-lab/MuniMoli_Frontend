import molinaTvJson from "./molina-tv-data.json";

export type MolinaTvVideo = {
  title: string;
  url: string;
  youtubeId?: string;
  provider: "youtube" | "facebook" | "live";
  embedUrl: string;
};

export type MolinaTvCategory = {
  slug: string;
  title: string;
  breadcrumb: string;
  sourceUrl: string;
  headings: string[];
  videos: MolinaTvVideo[];
};

export type MolinaTvData = {
  scrapedAt: string;
  sourceUrl: string;
  title: string;
  categories: MolinaTvCategory[];
};

export const MOLINA_TV_DATA = molinaTvJson as MolinaTvData;

export const MOLINA_TV_SOURCE_URL = MOLINA_TV_DATA.sourceUrl;

export function getMolinaTvCategory(
  slug: string,
): MolinaTvCategory | undefined {
  return MOLINA_TV_DATA.categories.find((category) => category.slug === slug);
}

export const MOLINA_TV_SLUGS = MOLINA_TV_DATA.categories.map((c) => c.slug);
