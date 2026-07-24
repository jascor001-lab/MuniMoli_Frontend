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
  HOME_PROMO_POPUPS,
  HOME_SERVICE_GROUPS,
  MAIN_NAV_BAR,
  MUNICIPAL_CONTACT,
  QUICK_ACCESS,
  SOCIAL_LINKS,
  TICKER_ITEMS,
  UTILITY_LINES,
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
        promoPopupsEnabled: true,
        promoPopups: HOME_PROMO_POPUPS,
        serviceGroups: HOME_SERVICE_GROUPS,
        utilityLines: UTILITY_LINES,
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
  const defaults = getDefaultSectionContent(sectionId);
  const file = sectionPath(sectionId);
  if (!fs.existsSync(file)) {
    return defaults;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as unknown;
    if (sectionId === "home") {
      return mergeHomeContent(parsed);
    }
    return parsed;
  } catch {
    return defaults;
  }
}

/** Completa campos faltantes del home (popups, teléfonos, imágenes de accesos). */
export function mergeHomeContent(raw: unknown): Record<string, unknown> {
  const defaults = getDefaultSectionContent("home") as Record<string, unknown>;
  const data =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  const pickList = (key: string) => {
    const current = data[key];
    const fallback = defaults[key];
    if (Array.isArray(current) && current.length > 0) return current;
    return Array.isArray(fallback) ? fallback : [];
  };

  const defaultAccess = Array.isArray(defaults.quickAccess)
    ? (defaults.quickAccess as {
        id?: string;
        label?: string;
        href?: string;
        imageUrl?: string;
        collageImages?: { src: string; alt: string }[];
        category?: string;
      }[])
    : [];
  const access = pickList("quickAccess") as Record<string, unknown>[];
  const quickAccess = access.map((item, index) => {
    const id = String(item.id || "");
    const label = String(item.label || "").toLowerCase();
    const href = String(item.href || "");
    const match =
      defaultAccess.find((d) => d.id && d.id === id) ||
      defaultAccess.find(
        (d) => d.label && d.label.toLowerCase() === label,
      ) ||
      defaultAccess.find((d) => d.href && d.href === href) ||
      defaultAccess[index];

    const currentCollage = Array.isArray(item.collageImages)
      ? (item.collageImages as { src?: string }[])
      : [];
    const hasCollage = currentCollage.some((img) => Boolean(img?.src));

    return {
      ...item,
      imageUrl: item.imageUrl || match?.imageUrl || "",
      collageImages: hasCollage
        ? item.collageImages
        : match?.collageImages || [],
    };
  });

  const defaultGroups = Array.isArray(defaults.serviceGroups)
    ? (defaults.serviceGroups as {
        id?: string;
        collageImages?: { src: string; alt: string }[];
      }[])
    : [];
  const groups = pickList("serviceGroups") as Record<string, unknown>[];
  const serviceGroups = groups.map((group, index) => {
    const current = Array.isArray(group.collageImages)
      ? (group.collageImages as { src?: string }[])
      : [];
    const hasImages = current.some((img) => Boolean(img?.src));
    if (hasImages) return group;
    const match =
      defaultGroups.find((d) => d.id && d.id === group.id) ||
      defaultGroups[index];
    return match?.collageImages
      ? { ...group, collageImages: match.collageImages }
      : group;
  });

  return {
    ...defaults,
    ...data,
    heroSlides: pickList("heroSlides"),
    tickerItems: pickList("tickerItems"),
    quickAccess,
    authorities: pickList("authorities"),
    promoPopupsEnabled: data.promoPopupsEnabled !== false,
    promoPopups: pickList("promoPopups"),
    serviceGroups:
      serviceGroups.length > 0 ? serviceGroups : pickList("serviceGroups"),
    utilityLines: pickList("utilityLines"),
  };
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
