import gestionJson from "./gestion-municipal-data.json";

export type GestionImage = {
  url: string;
  sourceUrl: string;
  bytes: number;
};

export type GestionDocument = {
  url: string;
  sourceUrl: string;
  label: string;
};

export type GestionTable = {
  headers: string[];
  rows: string[][];
};

export type GestionPerson = {
  role: string;
  name: string;
  email: string;
  photo?: string;
};

export type GestionCommission = {
  title: string;
  presidente?: string;
  vicepresidente?: string;
  miembros: string[];
};

export type GestionOrgSection = {
  title: string;
  items: string[];
};

export type GestionRecognition = {
  title: string;
  paragraphs: string[];
  images: string[];
};

export type GestionProfile = {
  name: string;
  role: string;
  email: string;
  photo: string | null;
};

export type GestionSection = {
  slug: string;
  title: string;
  summary: string;
  sourceUrl: string;
  headings: string[];
  paragraphs: string[];
  images: GestionImage[];
  documents: GestionDocument[];
  tables: GestionTable[];
  people: GestionPerson[];
  commissions: GestionCommission[];
  orgStructure: GestionOrgSection[];
  recognitionBlocks: GestionRecognition[];
  profile: GestionProfile | null;
  missing?: boolean;
};

export type GestionMunicipalData = {
  scrapedAt: string;
  title: string;
  sourceUrl: string;
  images: GestionImage[];
  sections: GestionSection[];
};

export const GESTION_MUNICIPAL_DATA =
  gestionJson as GestionMunicipalData;

export const GESTION_MUNICIPAL_SOURCE_URL =
  GESTION_MUNICIPAL_DATA.sourceUrl;

export function getGestionSection(
  slug: string,
): GestionSection | undefined {
  return GESTION_MUNICIPAL_DATA.sections.find(
    (section) => section.slug === slug,
  );
}

export const GESTION_MUNICIPAL_SLUGS =
  GESTION_MUNICIPAL_DATA.sections.map((s) => s.slug);
