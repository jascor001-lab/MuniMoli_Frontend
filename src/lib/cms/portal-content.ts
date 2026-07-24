import { readSectionContent } from "@/lib/cms/content-store";
import { CMS_SECTIONS, type CmsSectionId } from "@/lib/cms/permissions";
import type {
  Authority,
  HeroSlide,
  HomePromoPopupItem,
  HomeServiceGroup,
  MainNavItem,
  NewsItem,
  QuickAccessItem,
  TickerItem,
  UtilityLine,
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

export type HomeCmsContent = {
  heroSlides: HeroSlide[];
  tickerItems: TickerItem[];
  quickAccess: QuickAccessItem[];
  authorities: Authority[];
  /** Popup promocional al abrir el portal (rail + carrusel grande) */
  promoPopupsEnabled: boolean;
  promoPopups: HomePromoPopupItem[];
  /** MoliTramites / Transparencia / Atención al ciudadano */
  serviceGroups: HomeServiceGroup[];
  /** Números de utilidad (central telefónica, etc.) */
  utilityLines: UtilityLine[];
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

function asSection<T>(sectionId: CmsSectionId): T {
  return readSectionContent(sectionId) as T;
}

export function getHomeCmsContent() {
  return asSection<HomeCmsContent>("home");
}

export function getNoticiasCmsContent() {
  return asSection<NoticiasCmsContent>("noticias");
}

export function getContactoCmsContent() {
  return asSection<ContactoCmsContent>("contacto");
}

export function getNavGlobalCmsContent() {
  return asSection<NavGlobalCmsContent>("nav-global");
}

export function getGobiernoDigitalCmsContent() {
  return asSection<GobiernoDigitalCmsContent>("gobierno-digital");
}

export function getTalleresCmsContent() {
  return asSection<TalleresData>("talleres");
}

export function getMolinaTvCmsContent() {
  return asSection<MolinaTvData>("molina-tv");
}

export function getGestionMunicipalCmsContent() {
  return asSection<GestionMunicipalData>("gestion-municipal");
}

export function getIntegridadCmsContent() {
  return asSection<{
    topics: unknown[];
    documents: unknown[];
    components: unknown[];
  }>("integridad");
}

export function getNormasCmsContent() {
  return asSection<{
    categories: unknown[];
    publications: unknown[];
  }>("normas-legales");
}

export function getTramitesCmsContent() {
  return asSection<TramitesCmsContent>("tramites");
}

export function getMuniserviciosCmsContent() {
  return asSection<MuniserviciosCmsContent>("muniservicios");
}

export function getControlInternoCmsContent() {
  return asSection<ControlInternoCmsContent>("control-interno");
}

/** Bundle used by the public layout provider */
export function getPortalCmsBundle() {
  return {
    nav: getNavGlobalCmsContent(),
    home: getHomeCmsContent(),
    noticias: getNoticiasCmsContent(),
    contacto: getContactoCmsContent(),
    gobiernoDigital: getGobiernoDigitalCmsContent(),
    talleres: getTalleresCmsContent(),
    molinaTv: getMolinaTvCmsContent(),
    gestionMunicipal: getGestionMunicipalCmsContent(),
    integridad: getIntegridadCmsContent(),
    normas: getNormasCmsContent(),
    tramites: getTramitesCmsContent(),
    muniservicios: getMuniserviciosCmsContent(),
    controlInterno: getControlInternoCmsContent(),
  };
}

export type PortalCmsBundle = ReturnType<typeof getPortalCmsBundle>;

/** Paths to revalidate when a section is saved */
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
  return [...paths];
}
