import fs from "fs";
import path from "path";
import type { CmsSectionId } from "@/lib/cms/permissions";
import { NEWS_ITEMS } from "@/data/news-items";
import {
  AUTHORITIES,
  EXTERNAL_LINKS,
  GOBIERNO_DIGITAL_APLICACIONES,
  GOBIERNO_DIGITAL_SERVICIOS,
  HERO_SLIDES,
  MAIN_NAV_BAR,
  MUNICIPAL_CONTACT,
  QUICK_ACCESS,
  SOCIAL_LINKS,
  TICKER_ITEMS,
  ATTENTION_PHONES,
} from "@/data/portal-data";
import { TALLERES_DATA } from "@/data/talleres-data";
import { MOLINA_TV_DATA } from "@/data/molina-tv-data";
import { GESTION_MUNICIPAL_DATA } from "@/data/gestion-municipal-data";
import { INTEGRITY_TOPICS, INTEGRITY_DOCUMENTS, INTEGRITY_COMPONENTS } from "@/data/integrity-data";
import { INTERNAL_CONTROL_PERIODS } from "@/data/internal-control-data";
import { LEGAL_NORM_CATEGORIES, OTHER_PUBLICATIONS } from "@/data/legal-publications-data";
import { MUNICIPAL_SERVICE_CATEGORIES } from "@/data/municipal-services";
import { MUNICIPAL_PROCEDURES } from "@/data/municipal-procedures";

const ROOT = process.cwd();
const CMS_DIR = path.join(ROOT, "content", "cms", "sections");

function ensureDir() {
  fs.mkdirSync(CMS_DIR, { recursive: true });
}

function sectionPath(sectionId: CmsSectionId) {
  return path.join(CMS_DIR, `${sectionId}.json`);
}

/** Defaults taken from the current static portal data */
export function getDefaultSectionContent(sectionId: CmsSectionId): unknown {
  switch (sectionId) {
    case "home":
      return {
        heroSlides: HERO_SLIDES,
        tickerItems: TICKER_ITEMS,
        quickAccess: QUICK_ACCESS,
        authorities: AUTHORITIES,
      };
    case "noticias":
      return { items: NEWS_ITEMS };
    case "contacto":
      return {
        contact: MUNICIPAL_CONTACT,
        phones: ATTENTION_PHONES,
        socialLinks: SOCIAL_LINKS,
      };
    case "tramites":
      return { procedures: MUNICIPAL_PROCEDURES };
    case "talleres":
      return TALLERES_DATA;
    case "muniservicios":
      return { categories: MUNICIPAL_SERVICE_CATEGORIES };
    case "gestion-municipal":
      return GESTION_MUNICIPAL_DATA;
    case "integridad":
      return {
        topics: INTEGRITY_TOPICS,
        documents: INTEGRITY_DOCUMENTS,
        components: INTEGRITY_COMPONENTS,
      };
    case "normas-legales":
      return {
        categories: LEGAL_NORM_CATEGORIES,
        publications: OTHER_PUBLICATIONS,
      };
    case "molina-tv":
      return MOLINA_TV_DATA;
      case "gobierno-digital":
      return {
        servicios: GOBIERNO_DIGITAL_SERVICIOS,
        aplicaciones: GOBIERNO_DIGITAL_APLICACIONES,
        gobiernoDigitalUrl: "/gobierno-digital",
      };
    case "control-interno":
      return { periods: INTERNAL_CONTROL_PERIODS };
    case "nav-global":
      return {
        mainNav: MAIN_NAV_BAR,
        socialLinks: SOCIAL_LINKS,
        externalLinks: EXTERNAL_LINKS,
      };
    default:
      return {};
  }
}

export function readSectionContent(sectionId: CmsSectionId): unknown {
  ensureDir();
  const file = sectionPath(sectionId);
  if (!fs.existsSync(file)) {
    return getDefaultSectionContent(sectionId);
  }
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return getDefaultSectionContent(sectionId);
  }
}

export function writeSectionContent(sectionId: CmsSectionId, data: unknown) {
  ensureDir();
  fs.writeFileSync(sectionPath(sectionId), JSON.stringify(data, null, 2), "utf8");
}

export function resetSectionContent(sectionId: CmsSectionId) {
  const file = sectionPath(sectionId);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  return getDefaultSectionContent(sectionId);
}

export function sectionHasOverride(sectionId: CmsSectionId): boolean {
  return fs.existsSync(sectionPath(sectionId));
}
