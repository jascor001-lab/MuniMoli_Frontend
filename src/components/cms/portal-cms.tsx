"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PortalCmsBundle } from "@/lib/cms/portal-content";
import {
  ATTENTION_PHONES,
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
} from "@/data/portal-data";
import { NEWS_ITEMS } from "@/data/news-items";
import { TALLERES_DATA } from "@/data/talleres-data";
import { MOLINA_TV_DATA } from "@/data/molina-tv-data";
import { GESTION_MUNICIPAL_DATA } from "@/data/gestion-municipal-data";
import {
  INTEGRITY_COMPONENTS,
  INTEGRITY_DOCUMENTS,
  INTEGRITY_TOPICS,
} from "@/data/integrity-data";
import {
  LEGAL_NORM_CATEGORIES,
  OTHER_PUBLICATIONS,
} from "@/data/legal-publications-data";
import { MUNICIPAL_PROCEDURES } from "@/data/municipal-procedures";
import { MUNICIPAL_SERVICE_CATEGORIES } from "@/data/municipal-services";
import { INTERNAL_CONTROL_PERIODS } from "@/data/internal-control-data";

const fallback: PortalCmsBundle = {
  nav: {
    mainNav: MAIN_NAV_BAR,
    socialLinks: SOCIAL_LINKS,
    externalLinks: EXTERNAL_LINKS,
  },
  home: {
    heroSlides: HERO_SLIDES,
    tickerItems: TICKER_ITEMS,
    quickAccess: QUICK_ACCESS,
    authorities: AUTHORITIES,
  },
  noticias: { items: NEWS_ITEMS },
  contacto: {
    contact: MUNICIPAL_CONTACT,
    phones: ATTENTION_PHONES,
    socialLinks: SOCIAL_LINKS,
  },
  gobiernoDigital: {
    servicios: GOBIERNO_DIGITAL_SERVICIOS,
    aplicaciones: GOBIERNO_DIGITAL_APLICACIONES,
    gobiernoDigitalUrl: "/gobierno-digital",
  },
  talleres: TALLERES_DATA,
  molinaTv: MOLINA_TV_DATA,
  gestionMunicipal: GESTION_MUNICIPAL_DATA,
  integridad: {
    topics: [...INTEGRITY_TOPICS],
    documents: [...INTEGRITY_DOCUMENTS],
    components: [...INTEGRITY_COMPONENTS],
  },
  normas: {
    categories: [...LEGAL_NORM_CATEGORIES],
    publications: [...OTHER_PUBLICATIONS],
  },
  tramites: { procedures: [...MUNICIPAL_PROCEDURES] },
  muniservicios: { categories: [...MUNICIPAL_SERVICE_CATEGORIES] },
  controlInterno: { periods: [...INTERNAL_CONTROL_PERIODS] },
};

const PortalCmsContext = createContext<PortalCmsBundle>(fallback);

export function PortalCmsProvider({
  value,
  children,
}: {
  value?: PortalCmsBundle | null;
  children: ReactNode;
}) {
  return (
    <PortalCmsContext.Provider value={value ?? fallback}>
      {children}
    </PortalCmsContext.Provider>
  );
}

export function usePortalCms() {
  return useContext(PortalCmsContext);
}
