export type NewsCategory = "Obras" | "Cultura" | "Seguridad" | "Deportes" | "General";

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  publishedAt: string;
  imageUrl: string;
  slug: string;
  /** Enlace a la nota en el portal oficial (si aplica) */
  href?: string;
}

export type ProcedureCategory =
  | "Vecinos"
  | "Negocios"
  | "Registro Civil"
  | "Licencias de Edificación"
  | "TUPA"
  | "Todos";

/** Aplicación ciudadana destacada en la Plataforma Digital */
export interface CitizenApplication {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiresAuth: boolean;
  /** Panel informativo o transaccional integrado */
  panel?: "tributos" | "mesa-partes" | "licencias" | "estado-cuenta";
  appUrl?: string;
}

export interface Procedure {
  id: string;
  title: string;
  description: string;
  category: Exclude<ProcedureCategory, "Todos">;
  /** Pestañas adicionales donde aparece (p. ej. Vecinos + Licencias de Edificación) */
  tabs?: Exclude<ProcedureCategory, "Todos">[];
  icon: string;
  href: string;
  /** URL de la aplicación externa tras autenticación SSO */
  appUrl?: string;
  requiresAuth: boolean;
  isOnline: boolean;
  estimatedMinutes: number;
  tags: string[];
}

export interface QuickAccessItem {
  id: string;
  label: string;
  /** Etiqueta corta para layouts compactos */
  shortLabel?: string;
  href: string;
  icon: string;
  /** deep = institucional, green = trámites digitales, slate = control/info */
  color: "deep" | "green" | "slate";
  /** Agrupa el dock interactivo */
  category: "digital" | "transparencia" | "ciudadano";
  /** Destaca en el mosaic bento */
  featured?: boolean;
  openInNewTab?: boolean;
  /** Enlace externo (gob.pe, etc.) */
  external?: boolean;
}

export interface MainNavItem {
  label: string;
  href: string;
  openInNewTab?: boolean;
  external?: boolean;
  children?: NavChild[];
}

export interface UtilityLine {
  label: string;
  number: string;
}

export interface Authority {
  id: string;
  name: string;
  role: string;
  department: string;
  imageUrl: string;
  bio: string;
}

export interface NavChild {
  label: string;
  href: string;
  description?: string;
}

export interface NavSection {
  id: string;
  label: string;
  href: string;
  children?: NavChild[];
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
  /** Abre el enlace en una pestaña nueva (p. ej. Plataforma Digital) */
  ctaOpenInNewTab?: boolean;
}

export interface TickerItem {
  id: string;
  text: string;
  href: string;
}

export interface TransparencyLink {
  id: string;
  label: string;
  description: string;
  href: string;
}

export interface TaxSimulationInput {
  documentType: "DNI" | "RUC";
  documentNumber: string;
  year: number;
}

export interface TaxSimulationResult {
  totalDue: number;
  status: "al_dia" | "pendiente" | "vencido";
  items: { concept: string; amount: number }[];
}

export interface MesaPartesForm {
  documentType: "DNI" | "RUC";
  documentNumber: string;
  subject: string;
  folios: number;
  files: File[];
}

export interface LicenseWizardStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}
