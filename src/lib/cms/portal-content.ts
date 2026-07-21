import { readSectionContent } from "@/lib/cms/content-store";
import { CMS_SECTIONS, type CmsSectionId } from "@/lib/cms/permissions";
import type {
  Authority,
  HeroSlide,
  MainNavItem,
  NewsItem,
  QuickAccessItem,
  TickerItem,
} from "@/types/portal";
import type { GobiernoDigitalLink } from "@/data/portal-data";
import {
  ATTENTION_PHONES,
  EXTERNAL_LINKS,
  MUNICIPAL_CONTACT,
  SOCIAL_LINKS,
} from "@/data/portal-data";
import type { TalleresData } from "@/data/talleres-data";
import type { MolinaTvData } from "@/data/molina-tv-data";
import type { GestionMunicipalData } from "@/data/gestion-municipal-data";
import type { MunicipalProcedureDetail } from "@/data/municipal-procedures";
import type { MunicipalServiceCategory } from "@/data/municipal-services";
import type { InternalControlPeriod } from "@/data/internal-control-data";
import { fetchCmsSectionFromNest } from "@/lib/api/cms-nest-sync";

export type HomeCmsContent = {
  heroSlides: HeroSlide[];
  tickerItems: TickerItem[];
  quickAccess: QuickAccessItem[];
  authorities: Authority[];
};

export type NoticiasCmsContent = {
  items: NewsItem[];
};

export type ContactoCmsContent = {
  contact: typeof MUNICIPAL_CONTACT;
  phones: typeof ATTENTION_PHONES | { label: string; number: string }[];
  socialLinks:
    | typeof SOCIAL_LINKS
    | { id: string; label: string; href: string }[];
};

export type NavGlobalCmsContent = {
  mainNav: MainNavItem[];
  socialLinks:
    | typeof SOCIAL_LINKS
    | { id: string; label: string; href: string }[];
  externalLinks: typeof EXTERNAL_LINKS | Record<string, string>;
};

export type GobiernoDigitalCmsContent = {
  servicios: GobiernoDigitalLink[];
  aplicaciones: GobiernoDigitalLink[];
  gobiernoDigitalUrl: string;
};

export type TramitesCmsContent = {
  procedures: MunicipalProcedureDetail[];
};

export type MuniserviciosCmsContent = {
  categories: MunicipalServiceCategory[];
};

export type ControlInternoCmsContent = {
  periods: InternalControlPeriod[];
};

function asSectionLocal<T>(sectionId: CmsSectionId): T {
  return readSectionContent(sectionId) as T;
}

function hasUsableData(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  for (const v of Object.values(data as Record<string, unknown>)) {
    if (Array.isArray(v) && v.length > 0) return true;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      if (Object.keys(v as object).length > 0) return true;
    }
    if (typeof v === "string" && v.trim()) return true;
  }
  return false;
}

async function fromNestOrLocal<T>(sectionId: CmsSectionId): Promise<T> {
  const nest = await fetchCmsSectionFromNest(sectionId);
  if (hasUsableData(nest)) return nest as T;
  return asSectionLocal<T>(sectionId);
}

export async function getHomeCmsContent(): Promise<HomeCmsContent> {
  return fromNestOrLocal<HomeCmsContent>("home");
}

export async function getNoticiasCmsContent(): Promise<NoticiasCmsContent> {
  return fromNestOrLocal<NoticiasCmsContent>("noticias");
}

export async function getContactoCmsContent(): Promise<ContactoCmsContent> {
  return fromNestOrLocal<ContactoCmsContent>("contacto");
}

export async function getNavGlobalCmsContent(): Promise<NavGlobalCmsContent> {
  return fromNestOrLocal<NavGlobalCmsContent>("nav-global");
}

export async function getGobiernoDigitalCmsContent(): Promise<GobiernoDigitalCmsContent> {
  return fromNestOrLocal<GobiernoDigitalCmsContent>("gobierno-digital");
}

export async function getTalleresCmsContent(): Promise<TalleresData> {
  return fromNestOrLocal<TalleresData>("talleres");
}

export async function getMolinaTvCmsContent(): Promise<MolinaTvData> {
  return fromNestOrLocal<MolinaTvData>("molina-tv");
}

export async function getGestionMunicipalCmsContent(): Promise<GestionMunicipalData> {
  return fromNestOrLocal<GestionMunicipalData>("gestion-municipal");
}

export async function getIntegridadCmsContent(): Promise<{
  topics: unknown[];
  documents: unknown[];
  components: unknown[];
}> {
  return fromNestOrLocal("integridad");
}

export async function getNormasCmsContent(): Promise<{
  categories: unknown[];
  publications: unknown[];
}> {
  return fromNestOrLocal("normas-legales");
}

export async function getTramitesCmsContent(): Promise<TramitesCmsContent> {
  return fromNestOrLocal<TramitesCmsContent>("tramites");
}

export async function getMuniserviciosCmsContent(): Promise<MuniserviciosCmsContent> {
  return fromNestOrLocal<MuniserviciosCmsContent>("muniservicios");
}

export async function getControlInternoCmsContent(): Promise<ControlInternoCmsContent> {
  return fromNestOrLocal<ControlInternoCmsContent>("control-interno");
}

/** Bundle used by the public layout provider — prioriza Postgres vía Nest */
export async function getPortalCmsBundle() {
  const [
    nav,
    home,
    noticias,
    contacto,
    gobiernoDigital,
    talleres,
    molinaTv,
    gestionMunicipal,
    integridad,
    normas,
    tramites,
    muniservicios,
    controlInterno,
  ] = await Promise.all([
    getNavGlobalCmsContent(),
    getHomeCmsContent(),
    getNoticiasCmsContent(),
    getContactoCmsContent(),
    getGobiernoDigitalCmsContent(),
    getTalleresCmsContent(),
    getMolinaTvCmsContent(),
    getGestionMunicipalCmsContent(),
    getIntegridadCmsContent(),
    getNormasCmsContent(),
    getTramitesCmsContent(),
    getMuniserviciosCmsContent(),
    getControlInternoCmsContent(),
  ]);

  return {
    nav,
    home,
    noticias,
    contacto,
    gobiernoDigital,
    talleres,
    molinaTv,
    gestionMunicipal,
    integridad,
    normas,
    tramites,
    muniservicios,
    controlInterno,
  };
}

export type PortalCmsBundle = Awaited<ReturnType<typeof getPortalCmsBundle>>;

export function pathsForSection(sectionId: CmsSectionId): string[] {
  const meta = CMS_SECTIONS.find((s) => s.id === sectionId);
  const href = meta?.href ?? "/";
  const paths = new Set<string>(["/", href]);
  if (sectionId === "home" || sectionId === "noticias") {
    paths.add("/noticias");
  }
  if (sectionId === "talleres") paths.add("/talleres");
  if (sectionId === "molina-tv") paths.add("/molina-tv");
  if (sectionId === "gestion-municipal") paths.add("/gestion-municipal");
  if (sectionId === "muniservicios") paths.add("/muniservicios");
  if (sectionId === "tramites") paths.add("/tramites-municipales");
  if (sectionId === "contacto") paths.add("/contacto");
  if (sectionId === "gobierno-digital") paths.add("/gobierno-digital");
  if (sectionId === "integridad") paths.add("/integridad-institucional");
  if (sectionId === "normas-legales") {
    paths.add("/normas-legales-y-publicaciones");
  }
  if (sectionId === "control-interno") paths.add("/sistema-control-interno");
  return [...paths];
}
