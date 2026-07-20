import type {
  Authority,
  CitizenApplication,
  HeroSlide,
  MainNavItem,
  NavSection,
  Procedure,
  QuickAccessItem,
  TickerItem,
  TransparencyLink,
  UtilityLine,
} from "@/types/portal";
import { PLATAFORMA_DIGITAL_PATH } from "@/lib/routes";

/** Enlaces oficiales externos del portal municipal */
export const EXTERNAL_LINKS = {
  tupa: "/tramites-municipales/tupa",
  sugerencias: "https://facilita.gob.pe/t/52054",
  accesoInfo:
    "https://www.gob.pe/20399-solicitar-acceso-a-la-informacion-publica?child=112738",
  transparencia:
    "https://www.transparencia.gob.pe/enlaces/pte_transparencia_enlaces.aspx?id_entidad=10062&id_tema=1&ver=D",
  pagos:
    "https://molipagos.munimolina.gob.pe:444/MOLINA.PAGOS/public/index.php/oauth/login",
  denuncias: "https://denuncias.servicios.gob.pe/",
  gobPe: "https://www.gob.pe/munilamolina",
  molicard: "https://molicard.munimolina.gob.pe/",
  reclamos: "https://reclamos.servicios.gob.pe/?institution_id=124",
  /** Formulario oficial de Mesa de Partes Virtual de La Molina (24/7) */
  mesaPartes: "https://facilita.gob.pe/t/51855",
  mesaPartesInfo:
    "https://www.gob.pe/20416-acceder-a-mesa-de-partes?child=113028",
  consultaTramite:
    "https://gesvirtual.munimolina.gob.pe/presentacion/externo/consulta/consulta_tramite.php",
  gobiernoDigital: "/gobierno-digital",
  talleres: "/talleres",
  molinaTv: "/molina-tv",
  gestionMunicipal: "/gestion-municipal",
} as const;

/** Portal oficial de la Municipalidad de La Molina */
/** Base del portal actual (sin dependencia del WordPress anterior) */
export const OFFICIAL_PORTAL_URL = "";

/** Contacto institucional */
export const MUNICIPAL_CONTACT = {
  address: "Av. Ricardo Elías Aparicio 740, La Molina",
  phone: "(01) 754 4000",
  hoursWeekdays: "Lunes a viernes de 8:00 a.m. a 5:00 p.m.",
  hoursSaturday: "Sábados de 8:30 a.m. a 1:00 p.m.",
  hours:
    "Lunes a viernes de 8:00 a.m. a 5:00 p.m. · Sábados de 8:30 a.m. a 1:00 p.m.",
  hoursNote:
    "Proyectos y anexos foliados de Obras Privadas, Obras Públicas, Inversiones, y Desarrollo Sostenible y Servicios a la Ciudad se reciben hasta las 5:00 p.m. Los sábados solo trámite de liquidación de pagos y caja.",
  portalUsuarioUrl: "/plataforma-digital",
  sobreNosotrosUrl: "/gestion-municipal",
  /** Sede central — Municipalidad de La Molina (OSM townhall) */
  map: {
    lat: -12.078498,
    lng: -76.917167,
    zoom: 17,
  },
} as const;

/** Teléfonos de atención al vecino — portal oficial Contáctanos */
export const ATTENTION_PHONES = [
  { label: "Central Telefónica", number: "(01) 754 4000" },
  { label: "AlóRentas (Anexos)", number: "360 | 361 | 323" },
  { label: "Riesgo de Desastres", number: "974 592 111" },
  { label: "Veterinaria Municipal (Anexo)", number: "312" },
  { label: "Remolque – Grúa", number: "994-799-604" },
  {
    label: "Centro de Operaciones de Emergencias Distrital",
    number: "974-592-111 / 974-486-557",
  },
  {
    label: "Canal de Denuncias por Actos de Corrupción",
    number: "968-793-625",
  },
  {
    label: "EcoRecicla – Operaciones Ambientales",
    number: "970-219-498",
  },
  {
    label: "Nueva Central de Seguridad Ciudadana",
    number: "(01) 6805400",
  },
  { label: "Serenazgo", number: "989-296008" },
] as const;

/** Redes sociales oficiales de la Municipalidad */
export const SOCIAL_LINKS = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/MunicipalidadDeLaMolina",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/munilamolina/",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@munidelamolina",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@munilamolina",
  },
  {
    id: "x",
    label: "X (Twitter)",
    href: "https://x.com/munilamolina",
  },
] as const;

/** Navegación principal — barra verde con desplegables */
export const MAIN_NAV_BAR: MainNavItem[] = [
  { label: "CONTÁCTANOS", href: "/contacto" },
  {
    label: "TRÁMITES",
    href: "/tramites-municipales",
    children: [
      {
        label: "Trámites Municipales",
        href: "/tramites-municipales",
        description: "Requisitos, modalidades, costos y plazos",
      },
      {
        label: "Talleres",
        href: "/talleres",
        description: "Talleres y actividades del distrito",
      },
    ],
  },
  {
    label: "MUNISERVICIOS",
    href: "/muniservicios",
  },
  {
    label: "INSTITUCIONAL",
    href: "/gestion-municipal",
    children: [
      {
        label: "Gestión Municipal",
        href: "/gestion-municipal",
        description: "Alcalde, concejo, estructura y funcionarios",
      },
      {
        label: "Integridad Institucional",
        href: "/integridad-institucional",
        description: "Transparencia y lucha contra la corrupción",
      },
      {
        label: "Normas Legales y Publicaciones",
        href: "/normas-legales-y-publicaciones",
        description: "Ordenanzas, acuerdos, resoluciones y documentos",
      },
    ],
  },
  { label: "TV", href: "/molina-tv" },
  {
    label: "GOBIERNO DIGITAL",
    href: "/gobierno-digital",
    children: [
      {
        label: "gob.pe",
        href: EXTERNAL_LINKS.gobPe,
        description: "Portal del Estado Peruano",
      },
      {
        label: "Transparencia",
        href: EXTERNAL_LINKS.transparencia,
        description: "Portal de Transparencia Estándar",
      },
      {
        label: "Reclamaciones",
        href: EXTERNAL_LINKS.reclamos,
        description: "Libro de reclamaciones",
      },
      {
        label: "Servicios al ciudadano",
        href: "/gobierno-digital#servicios",
        description: "Trámites, pagos, consultas y más",
      },
      {
        label: "Aplicaciones",
        href: "/gobierno-digital#aplicaciones",
        description: "Sistemas y herramientas institucionales",
      },
    ],
  },
];

/** @deprecated consolidado en MAIN_NAV_BAR con desplegables */
export const SECONDARY_NAV_BAR: MainNavItem[] = [];

export const CREDIT_RATING = {
  label: "Clasificación AA− otorgado por Moody's",
  shortLabel: "AA− · Moody's",
} as const;

export const EMERGENCY_LINES = [
  { label: "Emergencias", number: "116" },
  { label: "Central Telefónica La Molina", number: MUNICIPAL_CONTACT.phone },
];

export const UTILITY_LINES: UtilityLine[] = [
  { label: "Central Telefónica", number: MUNICIPAL_CONTACT.phone },
];

/**
 * Accesos del portal — se muestran una sola vez en el dock interactivo
 * @see https://portal.munimolina.gob.pe/
 */
export const QUICK_ACCESS: QuickAccessItem[] = [
  {
    id: "tupa",
    label: "Plataforma TUPA Digital",
    shortLabel: "TUPA Digital",
    href: "/tramites-municipales/tupa",
    icon: "FileText",
    color: "deep",
    category: "digital",
    featured: true,
  },
  {
    id: "control-interno",
    label: "Sistema de Control Interno",
    shortLabel: "Control Interno",
    href: "/sistema-control-interno",
    icon: "Network",
    color: "slate",
    category: "transparencia",
  },
  {
    id: "sugerencias",
    label: "Buzón de Sugerencias",
    shortLabel: "Sugerencias",
    href: EXTERNAL_LINKS.sugerencias,
    icon: "MessageSquare",
    color: "deep",
    category: "ciudadano",
    openInNewTab: true,
    external: true,
  },
  {
    id: "acceso-info",
    label: "Acceso a la Información Pública",
    shortLabel: "Info Pública",
    href: EXTERNAL_LINKS.accesoInfo,
    icon: "Laptop",
    color: "slate",
    category: "transparencia",
    openInNewTab: true,
    external: true,
  },
  {
    id: "transparencia",
    label: "Portal de Transparencia",
    shortLabel: "Transparencia",
    href: EXTERNAL_LINKS.transparencia,
    icon: "Search",
    color: "deep",
    category: "transparencia",
    featured: true,
    openInNewTab: true,
    external: true,
  },
  {
    id: "pagos",
    label: "Pagos Tributarios En Línea",
    shortLabel: "Pagos en Línea",
    href: EXTERNAL_LINKS.pagos,
    icon: "Smartphone",
    color: "green",
    category: "digital",
    featured: true,
    openInNewTab: true,
    external: true,
  },
  {
    id: "denuncias",
    label: "Denuncias por Actos de Corrupción",
    shortLabel: "Denuncias",
    href: EXTERNAL_LINKS.denuncias,
    icon: "ShieldAlert",
    color: "green",
    category: "transparencia",
    openInNewTab: true,
    external: true,
  },
  {
    id: "mesa-partes",
    label: "Mesa de Partes Virtual",
    shortLabel: "Mesa de Partes",
    href: EXTERNAL_LINKS.mesaPartes,
    icon: "FolderPlus",
    color: "deep",
    category: "digital",
    featured: true,
    external: true,
    openInNewTab: true,
  },
  {
    id: "reclamaciones",
    label: "Libro de Reclamaciones",
    shortLabel: "Reclamaciones",
    href: EXTERNAL_LINKS.reclamos,
    icon: "BookOpen",
    color: "slate",
    category: "ciudadano",
    external: true,
    openInNewTab: true,
  },
  {
    id: "gob-pe",
    label: "gob.pe",
    shortLabel: "gob.pe",
    href: EXTERNAL_LINKS.gobPe,
    icon: "Globe",
    color: "deep",
    category: "ciudadano",
    external: true,
    openInNewTab: true,
  },
  {
    id: "molicard",
    label: "MOLICARD",
    shortLabel: "MOLICARD",
    href: EXTERNAL_LINKS.molicard,
    icon: "CreditCard",
    color: "green",
    category: "digital",
    external: true,
    openInNewTab: true,
  },
];

export const QUICK_ACCESS_CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "digital", label: "Digital" },
  { id: "transparencia", label: "Transparencia" },
  { id: "ciudadano", label: "Ciudadano" },
] as const;

export const TICKER_ITEMS: TickerItem[] = [
  {
    id: "1",
    text: "Más de 500 cámaras y 378 serenos resguardarán La Molina en Fiestas Patrias",
    href: "/noticias/mas-de-500-camaras-y-378-serenos-resguardaran-la-molina-durante-fiestas-patrias",
  },
  {
    id: "2",
    text: "La Molina renovará medio millón de m² en pistas y veredas al finalizar 2026",
    href: "/noticias/la-molina-renovara-medio-millon-de-metros-cuadrados-en-pistas-y-veredas-al-finalizar-2026",
  },
  {
    id: "3",
    text: `Central telefónica: ${MUNICIPAL_CONTACT.phone}`,
    href: "/contacto",
  },
  {
    id: "4",
    text: "Ver todas las noticias del distrito",
    href: "/noticias",
  },
];

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "tramites",
    label: "Trámites",
    href: "/tramites-municipales",
    children: [
      {
        label: "Trámites Municipales",
        href: "/tramites-municipales",
        description: "Vecinos, negocios y registro civil",
      },
      {
        label: "Pagos Tributarios En Línea",
        href: EXTERNAL_LINKS.pagos,
        description: "Consulta y pago de tributos municipales",
      },
      {
        label: "TUPA",
        href: "/tramites-municipales/tupa",
        description: "Texto Único de Procedimientos Administrativos",
      },
      {
        label: "Licencias de Edificación",
        href: "/tramites-municipales/licencia-edificacion",
        description: "Construcción y habilitaciones urbanas",
      },
      {
        label: "Registro Civil",
        href: "/tramites-municipales/matrimonio-civil",
        description: "Matrimonio civil y divorcios",
      },
    ],
  },
  {
    id: "muniservicios",
    label: "Muniservicios",
    href: "/muniservicios",
    children: [
      {
        label: "Servicios para vecinos",
        href: "/muniservicios",
        description: "Programas, atención municipal y servicios del distrito",
      },
    ],
  },
  {
    id: "institucional",
    label: "Institucional",
    href: "/gestion-municipal",
    children: [
      {
        label: "Gestión Municipal",
        href: "/gestion-municipal",
        description: "Alcalde, concejo, estructura y funcionarios",
      },
      {
        label: "Integridad Institucional",
        href: "/integridad-institucional",
        description: "Transparencia y lucha contra la corrupción",
      },
      {
        label: "Normas Legales y Publicaciones",
        href: "/normas-legales-y-publicaciones",
        description: "Ordenanzas, acuerdos, resoluciones y documentos",
      },
      {
        label: "Contáctanos",
        href: "/contacto",
        description: MUNICIPAL_CONTACT.address,
      },
    ],
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "1",
    title: "La Molina, distrito verde",
    subtitle: "Trámites digitales, transparencia y servicios al ciudadano en un solo portal.",
    imageUrl: "/images/hero/distrito-verde.png",
    ctaLabel: "Iniciar trámite",
    ctaHref: "/tramites-municipales",
    ctaOpenInNewTab: false,
  },
  {
    id: "2",
    title: "Ventanilla Única Digital",
    subtitle: "Paga tributos, envía documentos y solicita licencias sin salir de casa.",
    imageUrl: "/images/hero/ventanilla-unica.png",
    ctaLabel: "Ver trámites",
    ctaHref: "/tramites-municipales",
    ctaOpenInNewTab: false,
  },
  {
    id: "3",
    title: "Gobierno Digital La Molina",
    subtitle:
      "Accede a trámites municipales, pagos tributarios y servicios para el ciudadano.",
    imageUrl: "/images/hero/gobierno-digital.png",
    ctaLabel: "Ir a trámites",
    ctaHref: "/tramites-municipales",
    ctaOpenInNewTab: false,
  },
];

/**
 * Aplicaciones para el ciudadano — servicios digitales del portal oficial
 * @see https://portal.munimolina.gob.pe/
 */
export const CITIZEN_APPLICATIONS: CitizenApplication[] = [
  {
    id: "pagos-tributarios",
    title: "Pagos Tributarios En Línea",
    description:
      "Consulta y pago de tributos municipales como arbitrios e impuesto predial.",
    icon: "Receipt",
    requiresAuth: false,
    appUrl: EXTERNAL_LINKS.pagos,
  },
  {
    id: "estado-cuenta",
    title: "Estado de Cuenta y Recibos de Pago",
    description:
      "Consulta requisitos, modalidades y canales para obtener el estado integral de tus predios.",
    icon: "Wallet",
    requiresAuth: false,
    panel: "estado-cuenta",
  },
  {
    id: "licencia-funcionamiento",
    title: "Licencias de Funcionamiento",
    description:
      "Solicita la autorización de funcionamiento de tu establecimiento comercial.",
    icon: "Store",
    requiresAuth: true,
    panel: "licencias",
    appUrl: "/apps/licencias-funcionamiento",
  },
  {
    id: "licencia-edificacion",
    title: "Licencia de Edificación",
    description:
      "Autorización para efectuar construcciones y obras en predios privados.",
    icon: "HardHat",
    requiresAuth: true,
    appUrl: "/apps/licencia-edificacion",
  },
  {
    id: "matrimonio-civil",
    title: "Matrimonio Civil",
    description:
      "Trámite de matrimonio civil ante el Registro Civil de la municipalidad.",
    icon: "Heart",
    requiresAuth: true,
    appUrl: "/apps/matrimonio-civil",
  },
  {
    id: "plataforma-tupa",
    title: "TUPA",
    description:
      "Consulta el Texto Único de Procedimientos Administrativos del distrito.",
    icon: "FileText",
    requiresAuth: false,
    appUrl: EXTERNAL_LINKS.tupa,
  },
  {
    id: "denuncias-corrupcion",
    title: "Canal de Denuncias por Corrupción",
    description:
      "Presenta denuncias por actos de corrupción de funcionarios municipales.",
    icon: "ShieldAlert",
    requiresAuth: false,
    appUrl: EXTERNAL_LINKS.denuncias,
  },
  {
    id: "mesa-partes",
    title: "Mesa de Partes Virtual",
    description:
      "Envía documentos PDF de hasta 10 MB. Disponible las 24 horas, los 7 días de la semana.",
    icon: "FileUp",
    requiresAuth: false,
    appUrl: EXTERNAL_LINKS.mesaPartes,
  },
  {
    id: "consulta-mesa-partes",
    title: "Seguimiento de Mesa de Partes",
    description:
      "Consulta el estado de tu trámite con el número de expediente recibido por correo.",
    icon: "Search",
    requiresAuth: false,
    appUrl: EXTERNAL_LINKS.consultaTramite,
  },
];

export const PROCEDURES: Procedure[] = [
  // —— Vecinos (portal.munimolina.gob.pe/tramites-municipales) ——
  {
    id: "fiscalizacion-tributaria",
    title: "Registro y Fiscalización Tributaria",
    description:
      "Registro de contribuyentes y predios, beneficios, inafectaciones y declaraciones juradas.",
    category: "Vecinos",
    icon: "Receipt",
    href: "/tramites-municipales/fiscalizacion-tributaria",
    
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 15,
    tags: ["tributos", "fiscalización", "vecinos"],
  },
  {
    id: "solicitudes-simples",
    title: "Registro de Solicitudes Simples (Trámite Documentario)",
    description:
      "Presenta solicitudes o comunicaciones sobre asuntos de competencia municipal.",
    category: "Vecinos",
    icon: "FileText",
    href: "/tramites-municipales/solicitudes-simples",
    
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 10,
    tags: ["documentos", "solicitud", "vecinos"],
  },
  {
    id: "declaracion-compra-venta",
    title: "Declaración Jurada de Compra y Venta",
    description:
      "Registra la adquisición o transferencia de un predio y actualiza sus titulares.",
    category: "Vecinos",
    icon: "FileSignature",
    href: "/tramites-municipales/declaracion-compra-venta",
    
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 45,
    tags: ["predio", "compra", "venta", "declaración jurada", "vecinos"],
  },
  {
    id: "descargos-papeletas",
    title: "Descargos de Papeletas de Infracción",
    description:
      "Presenta oposición o aceptación frente a una sanción administrativa municipal.",
    category: "Vecinos",
    icon: "FileCheck",
    href: "/tramites-municipales/descargos-papeletas",
    
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 20,
    tags: ["papeletas", "infracción", "vecinos"],
  },
  {
    id: "estado-cuenta",
    title: "Emisión de Estado de Cuenta y Recibos de Pago",
    description:
      "Obtén el estado integral de deuda de tus predios y la liquidación para realizar el pago.",
    category: "Vecinos",
    icon: "Wallet",
    href: "/tramites-municipales/estado-cuenta",
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 5,
    tags: ["pago", "deuda", "vecinos"],
  },

  // —— Negocios ——
  {
    id: "licencia-funcionamiento",
    title: "Licencias de Funcionamiento",
    description:
      "Proceso en el cual se autoriza el funcionamiento de un local comercial.",
    category: "Negocios",
    icon: "Store",
    href: "/tramites-municipales/licencia-funcionamiento",
    
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 25,
    tags: ["comercio", "licencia", "negocios"],
  },
  {
    id: "certificado-defensa-civil",
    title: "Certificado de Defensa Civil",
    description:
      "Autorización de cumplimiento de medidas de seguridad en locales comerciales.",
    category: "Negocios",
    icon: "ShieldAlert",
    href: "/tramites-municipales/certificado-defensa-civil",
    
    requiresAuth: false,
    isOnline: false,
    estimatedMinutes: 20,
    tags: ["seguridad", "defensa civil", "negocios"],
  },
  {
    id: "redes-subterraneas",
    title: "Autorización para Ampliación de Redes Subterráneas",
    description:
      "Comunicación de trabajo de energía y agua a nivel Sedapal o Luz del Sur.",
    category: "Negocios",
    icon: "HardHat",
    href: "/tramites-municipales/redes-subterraneas",
    
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 15,
    tags: ["obras", "servicios", "negocios"],
  },
  {
    id: "publicidad-exterior",
    title: "Autorización para la Instalación o Ubicación de Publicidad Exterior",
    description:
      "Autorización para la colocación de publicidad en los locales comerciales.",
    category: "Negocios",
    icon: "FileUp",
    href: "/tramites-municipales/publicidad-exterior",
    
    requiresAuth: false,
    isOnline: false,
    estimatedMinutes: 15,
    tags: ["publicidad", "anuncios", "negocios"],
  },
  {
    id: "infraestructura-telecom",
    title: "Autorización para la Instalación de Infraestructura de Telecomunicaciones",
    description: "Autorización para la instalación de antenas de telecomunicación.",
    category: "Negocios",
    icon: "Network",
    href: "/tramites-municipales/infraestructura-telecom",
    
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 20,
    tags: ["telecomunicaciones", "antenas", "negocios"],
  },
  {
    id: "cese-actividades",
    title: "Cese de Actividades Económicas",
    description:
      "Comunicación de fin de las actividades comerciales en un determinado local.",
    category: "Negocios",
    icon: "Users",
    href: "/tramites-municipales/cese-actividades",
    
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 10,
    tags: ["cierre", "comercio", "negocios"],
  },

  // —— Registro Civil ——
  {
    id: "matrimonio-civil",
    title: "Matrimonio Civil",
    description:
      "El matrimonio es la unión voluntariamente concertada por un varón y una mujer legalmente.",
    category: "Registro Civil",
    icon: "Heart",
    href: "/tramites-municipales/matrimonio-civil",
    
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 30,
    tags: ["matrimonio", "registro civil"],
  },
  {
    id: "divorcios",
    title: "Divorcios",
    description:
      "Procedimiento que disuelve el vínculo del matrimonio y deja a los cónyuges en aptitud de contraer matrimonio.",
    category: "Registro Civil",
    icon: "FileBadge",
    href: "/tramites-municipales/divorcios",
    
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 30,
    tags: ["divorcio", "registro civil"],
  },

  // —— Licencias de Edificación ——
  {
    id: "certificado-parametros",
    title: "Certificado de Parámetros Urbanísticos",
    description:
      "Descripción de alturas y tipos de edificaciones referidas a un predio.",
    category: "Licencias de Edificación",
    tabs: ["Vecinos"],
    icon: "Landmark",
    href: "/tramites-municipales/certificado-parametros",
    
    requiresAuth: false,
    isOnline: false,
    estimatedMinutes: 15,
    tags: ["urbanismo", "parámetros", "edificación", "vecinos"],
  },
  {
    id: "licencia-edificacion",
    title: "Licencia de Edificación en sus diversas modalidades",
    description: "Autorización para efectuar construcciones en predios privados.",
    category: "Licencias de Edificación",
    tabs: ["Vecinos"],
    icon: "HardHat",
    href: "/tramites-municipales/licencia-edificacion",
    
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 30,
    tags: ["construcción", "edificación", "obras", "vecinos"],
  },
  {
    id: "habilitaciones-urbanas",
    title: "Licencias de Habilitaciones Urbanas",
    description:
      "Trámites de habilitación urbana y acondicionamiento de predios en el distrito.",
    category: "Licencias de Edificación",
    icon: "Landmark",
    href: "/tramites-municipales/habilitaciones-urbanas",
    
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 25,
    tags: ["habilitación", "urbanas", "edificación"],
  },

  // —— TUPA y servicios digitales destacados en el portal oficial ——
  {
    id: "plataforma-tupa",
    title: "TUPA",
    description:
      "Texto Único de Procedimientos Administrativos de la Municipalidad de La Molina.",
    category: "TUPA",
    icon: "FileText",
    href: EXTERNAL_LINKS.tupa,
    appUrl: EXTERNAL_LINKS.tupa,
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 5,
    tags: ["tupa", "procedimientos"],
  },
  {
    id: "pagos-tributarios",
    title: "Pagos Tributarios En Línea",
    description: "Consulta y pago de tributos municipales en línea.",
    category: "TUPA",
    icon: "Receipt",
    href: EXTERNAL_LINKS.pagos,
    appUrl: EXTERNAL_LINKS.pagos,
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 5,
    tags: ["pago", "tributos"],
  },
  {
    id: "denuncias-corrupcion",
    title: "Canal de Denuncias por Actos de Corrupción",
    description:
      "Presenta denuncias por actos de corrupción de funcionarios municipales.",
    category: "TUPA",
    icon: "ShieldAlert",
    href: EXTERNAL_LINKS.denuncias,
    appUrl: EXTERNAL_LINKS.denuncias,
    requiresAuth: false,
    isOnline: true,
    estimatedMinutes: 10,
    tags: ["denuncia", "integridad"],
  },
];

/** Enlaces de Gobierno Digital — portal.munimolina.gob.pe/contenido-gobierno-digital */
export type GobiernoDigitalLink = {
  id: string;
  label: string;
  href: string;
};

export const GOBIERNO_DIGITAL_SERVICIOS: GobiernoDigitalLink[] = [
  {
    id: "consulta-tramite",
    label: "Consulta trámite",
    href: EXTERNAL_LINKS.consultaTramite,
  },
  {
    id: "mesa-partes-virtual",
    label: "Mesa de partes virtual",
    href: EXTERNAL_LINKS.mesaPartes,
  },
  {
    id: "pagos-online",
    label: "Pagos online",
    href: EXTERNAL_LINKS.pagos,
  },
  {
    id: "libro-reclamaciones",
    label: "Libro de reclamaciones",
    href: EXTERNAL_LINKS.reclamos,
  },
  {
    id: "denuncias-corrupcion",
    label: "Denuncias por actos de corrupción",
    href: EXTERNAL_LINKS.denuncias,
  },
  {
    id: "buzon-sugerencias",
    label: "Buzón de sugerencias",
    href: EXTERNAL_LINKS.sugerencias,
  },
  {
    id: "acceso-info",
    label: "Acceso a la información pública virtual",
    href: EXTERNAL_LINKS.accesoInfo,
  },
  {
    id: "molicard-gd",
    label: "MOLICARD",
    href: EXTERNAL_LINKS.molicard,
  },
  {
    id: "consultas-tributarias",
    label: "Consultas tributarias",
    href: "https://api.whatsapp.com/send?phone=51989595583",
  },
  {
    id: "tupa-buscador",
    label: "Buscador de trámites TUPA",
    href: "/tramites-municipales/tupa",
  },
  {
    id: "normas-legales",
    label: "Normas legales",
    href: "/normas-legales-y-publicaciones",
  },
  {
    id: "bolsa-trabajo",
    label: "Bolsa de trabajo",
    href: "https://bolsatrabajo.munimolina.gob.pe/",
  },
];

export const GOBIERNO_DIGITAL_APLICACIONES: GobiernoDigitalLink[] = [
  {
    id: "correo",
    label: "Correo",
    href: "https://mail.munimolina.gob.pe/",
  },
  {
    id: "gestrad",
    label: "Gestión de trámites de documentos digitales (GESTRAD)",
    href: "https://gestrad.munimolina.gob.pe/index.php",
  },
  {
    id: "gesafor",
    label: "Gestión de accesos y aforos (GESAFOR)",
    href: "https://accesos.munimolina.gob.pe/asistencia/",
  },
  {
    id: "reclamos-pcm",
    label: "Administración del Libro de Reclamaciones – PCM",
    href: "https://reclamos.servicios.gob.pe/users/sign_in",
  },
  {
    id: "sistema-territorial",
    label: "Sistema territorial",
    href: "https://sil.munimolina.gob.pe/public/index.php",
  },
  {
    id: "landing-mef",
    label: "Landing MEF",
    href: "https://apps.mef.gob.pe/weblanding/#/landing",
  },
  {
    id: "siaf-madaf",
    label: "SIAF – MADAF",
    href: "https://apps.mineco.gob.pe/siafresponsablejws/",
  },
  {
    id: "siaf-operaciones",
    label: "SIAF – Operaciones en línea",
    href: "https://apps4.mineco.gob.pe/siafadmapp/",
  },
  {
    id: "georeferencial",
    label: "Software georeferencial y toma de decisiones",
    href: "http://tomadecisiones.munimolina.gob.pe:8075/webroot/decision/login",
  },
];

export { NEWS_ITEMS } from "@/data/news-items";

export const AUTHORITIES: Authority[] = [
  {
    id: "alcalde",
    name: "Esteban Diego Uceda Guerra-Garcia",
    role: "Alcalde",
    department: "Despacho de Alcaldía",
    imageUrl: "/images/alcalde.png",
    bio: "Comprometido con la gestión transparente, el desarrollo sostenible y la calidad de vida en el distrito.",
  },
];

export const TRANSPARENCY_LINKS: TransparencyLink[] = [
  {
    id: "pte",
    label: "Portal de Transparencia Estándar",
    description: "Acceso al PTE conforme a la Ley N° 27806",
    href: EXTERNAL_LINKS.transparencia,
  },
  {
    id: "finanzas",
    label: "Ejecución Presupuestal",
    description: "Ingresos, gastos y ejecución financiera",
    href: "/transparencia/ejecucion",
  },
  {
    id: "resoluciones",
    label: "Resoluciones de Alcaldía",
    description: "Normas y disposiciones oficiales",
    href: "/transparencia/resoluciones",
  },
  {
    id: "planillas",
    label: "Planillas del Personal",
    description: "Remuneraciones del sector público municipal",
    href: "/transparencia/planillas",
  },
];
