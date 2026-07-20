export const CMS_SECTIONS = [
  {
    id: "home",
    label: "Inicio (hero, ticker, accesos)",
    description: "Portada del portal: slides, avisos y accesos rápidos",
    href: "/",
  },
  {
    id: "noticias",
    label: "Noticias",
    description: "Sala de prensa y listado de noticias",
    href: "/noticias",
  },
  {
    id: "contacto",
    label: "Contáctanos",
    description: "Sede, teléfonos y redes",
    href: "/contacto",
  },
  {
    id: "tramites",
    label: "Trámites Municipales",
    description: "Catálogo de trámites y TUPA",
    href: "/tramites-municipales",
  },
  {
    id: "talleres",
    label: "Talleres",
    description: "Categorías e imágenes de talleres",
    href: "/talleres",
  },
  {
    id: "muniservicios",
    label: "Muniservicios",
    description: "Áreas y programas municipales",
    href: "/muniservicios",
  },
  {
    id: "gestion-municipal",
    label: "Gestión Municipal",
    description: "Alcalde, concejo, estructura y funcionarios",
    href: "/gestion-municipal",
  },
  {
    id: "integridad",
    label: "Integridad Institucional",
    description: "Contenidos de integridad y documentos",
    href: "/integridad-institucional",
  },
  {
    id: "normas-legales",
    label: "Normas Legales y Publicaciones",
    description: "Normas y publicaciones oficiales",
    href: "/normas-legales-y-publicaciones",
  },
  {
    id: "molina-tv",
    label: "La Molina TV",
    description: "En vivo, sesiones, noticias y podcast",
    href: "/molina-tv",
  },
  {
    id: "gobierno-digital",
    label: "Gobierno Digital",
    description: "Servicios y aplicaciones digitales",
    href: "/gobierno-digital",
  },
  {
    id: "control-interno",
    label: "Sistema de Control Interno",
    description: "Planes y reportes de control interno",
    href: "/sistema-control-interno",
  },
  {
    id: "nav-global",
    label: "Navegación y enlaces globales",
    description: "Menú principal, redes y enlaces externos",
    href: "/",
  },
] as const;

export type CmsSectionId = (typeof CMS_SECTIONS)[number]["id"];

export type CmsRole = "admin" | "editor";

export type CmsUser = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: CmsRole;
  /** Secciones que puede editar (vacío = ninguna si es editor; admin ignora esto) */
  sections: CmsSectionId[];
  passwordHash: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CmsSessionUser = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: CmsRole;
  sections: CmsSectionId[];
};

export function canEditSection(
  user: Pick<CmsSessionUser, "role" | "sections">,
  sectionId: string,
): boolean {
  if (user.role === "admin") return true;
  return user.sections.includes(sectionId as CmsSectionId);
}

export function listEditableSections(
  user: Pick<CmsSessionUser, "role" | "sections">,
) {
  if (user.role === "admin") return [...CMS_SECTIONS];
  return CMS_SECTIONS.filter((section) => user.sections.includes(section.id));
}

export function isCmsSectionId(value: string): value is CmsSectionId {
  return CMS_SECTIONS.some((section) => section.id === value);
}
