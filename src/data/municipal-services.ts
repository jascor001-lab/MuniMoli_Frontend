import scrapedContent from "./muniservicios-content.json";

export type MunicipalServiceAction = {
  label: string;
  href: string;
  external?: boolean;
};

export type MunicipalServiceTable = {
  headers?: string[];
  rows: string[][];
};

export type MunicipalServiceSection = {
  title: string;
  paragraphs: string[];
  lists?: string[][];
  tables?: MunicipalServiceTable[];
};

export type MunicipalServiceDocument = {
  label: string;
  href: string;
};

export type MunicipalServiceItem = {
  slug: string;
  title: string;
  summary: string;
  details?: string[];
  audience?: string;
  availability?: string;
  contact?: string;
  action?: MunicipalServiceAction;
  iconUrl?: string;
  body?: string[];
  sections?: MunicipalServiceSection[];
  images?: string[];
  documents?: MunicipalServiceDocument[];
  tables?: MunicipalServiceTable[];
};

export type MunicipalServiceCategory = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  /** Foto oficial migrada desde portal.munimolina.gob.pe/servicios-para-el-vecino */
  imageUrl: string;
  mission?: string;
  vision?: string;
  services: MunicipalServiceItem[];
};

type ScrapedImage = {
  url: string;
  sourceUrl?: string;
  bytes?: number;
  kind?: "icon" | "graphic" | "photo";
};

type ScrapedService = {
  serviceSlug: string;
  pageSlug?: string;
  title?: string;
  missing?: boolean;
  paragraphs?: string[];
  sections?: MunicipalServiceSection[];
  tables?: MunicipalServiceTable[];
  images?: ScrapedImage[];
  documents?: { url: string; sourceUrl?: string; label: string }[];
};

type ScrapedCategory = {
  hub?: {
    tabs?: { pageSlug: string; label: string; iconUrl?: string | null }[];
  } | null;
  services?: ScrapedService[];
};

type ScrapedContentFile = {
  scrapedAt: string | null;
  source: string;
  categories: Record<string, ScrapedCategory>;
};

const participationContact =
  "Gerencia de Participación Vecinal · (01) 754-4000, anexos 367 y 251 · participacionvecinal@munimolina.gob.pe";

export const MUNICIPAL_SERVICE_CATEGORIES: MunicipalServiceCategory[] = [
  {
    slug: "participacion-vecinal",
    title: "Participación Vecinal",
    shortTitle: "Participación",
    summary:
      "Convertimos cada opinión e inquietud de los vecinos en una oportunidad para crecer y brindar un servicio más cercano y eficiente.",
    imageUrl: "/images/muniservicios/participacion-vecinal.jpg",
    mission:
      "Promover la participación activa en el planeamiento concertado, el presupuesto participativo y las audiencias públicas, fortaleciendo el diálogo y la colaboración.",
    vision:
      "Articular una ciudadanía activa y corresponsable que contribuya al desarrollo sostenible y democrático de La Molina.",
    services: [
      {
        slug: "participacion-vecinal",
        title: "Gerencia de Participación Vecinal",
        summary:
          "Orienta y articula iniciativas de participación ciudadana y organización vecinal.",
        contact: participationContact,
        iconUrl: "/images/muniservicios/tabs/participacion-vecinal.png",
      },
      {
        slug: "audiencias-vecinales",
        title: "Audiencias Vecinales",
        summary:
          "Espacio presencial o virtual donde vecinos presentan asuntos de interés local ante las áreas municipales competentes.",
        details: [
          "Permite plantear reclamos, observaciones, recomendaciones y propuestas.",
          "Facilita el diálogo directo y la coordinación de soluciones para casos específicos.",
        ],
        contact: participationContact,
        iconUrl: "/images/muniservicios/tabs/audiencias-vecinales.png",
      },
      {
        slug: "talleres-capacitacion",
        title: "Talleres de Capacitación",
        summary:
          "Actividades presenciales y virtuales que fortalecen las capacidades ciudadanas y el conocimiento de los servicios municipales.",
        contact: participationContact,
        iconUrl: "/images/muniservicios/tabs/talleres-capacitacion.png",
      },
      {
        slug: "ruos",
        title: "Registro Único de Organizaciones Sociales (RUOS)",
        summary:
          "Reconoce formalmente a las organizaciones sociales y a sus representantes para que ejerzan sus derechos de participación.",
        details: [
          "Comprende el registro inicial de la organización social.",
          "Permite actualizar la inscripción y renovar la junta directiva.",
          "Requiere solicitud, actas, padrón de asociados, nómina directiva y documentos de la organización, según corresponda.",
        ],
        contact: participationContact,
        iconUrl: "/images/muniservicios/tabs/ruos.png",
      },
      {
        slug: "mesas-concertacion",
        title: "Mesas de Concertación Municipal",
        summary:
          "Espacios de coordinación entre ciudadanía, organizaciones y municipalidad sobre asuntos de interés distrital.",
        contact: participationContact,
        iconUrl: "/images/muniservicios/tabs/mesas-concertacion.png",
      },
      {
        slug: "voluntariado",
        title: "Gestión de Voluntariado",
        summary:
          "Canal de participación para vecinos que desean colaborar en actividades y acciones comunitarias.",
        contact: participationContact,
        iconUrl: "/images/muniservicios/tabs/voluntariado.png",
      },
    ],
  },
  {
    slug: "desarrollo-social-educacion-cultura",
    title: "Desarrollo Social, Educación y Cultura",
    shortTitle: "Educación y cultura",
    summary:
      "Contamos con programas y talleres que promueven la educación de la comunidad.",
    imageUrl: "/images/muniservicios/desarrollo-social-educacion-cultura.jpg",
    services: [
      {
        slug: "educacion",
        title: "Educación",
        summary:
          "Programas y acciones municipales que complementan la formación y el aprendizaje de la comunidad.",
      },
      {
        slug: "cetpro",
        title: "CETPRO",
        summary:
          "Formación técnico-productiva orientada al desarrollo de capacidades para el empleo y el emprendimiento.",
      },
      {
        slug: "ie-descubriendo",
        title: "I.E. Municipal Descubriendo",
        summary:
          "Servicio educativo municipal dirigido a la formación integral de niñas y niños.",
      },
      {
        slug: "promocion-cultural",
        title: "Promoción Cultural",
        summary:
          "Actividades que acercan expresiones artísticas, culturales y patrimoniales a los vecinos.",
      },
      {
        slug: "molicasa-molitalleres",
        title: "MoliCasa y MoliTalleres",
        summary:
          "Espacios y talleres municipales para el aprendizaje, la creatividad y la integración comunitaria.",
      },
      {
        slug: "plaza-bicentenario",
        title: "Plaza Bicentenario",
        summary:
          "Espacio público de encuentro ciudadano y difusión de actividades culturales.",
      },
      {
        slug: "moliturismo",
        title: "Turismo",
        summary:
          "Información y promoción de los atractivos, recorridos y actividades turísticas de La Molina.",
      },
      {
        slug: "biblioteca-municipal",
        title: "Biblioteca Municipal",
        summary:
          "Espacio de lectura, consulta y promoción cultural con acceso a material bibliográfico para la comunidad.",
      },
    ],
  },
  {
    slug: "desarrollo-sostenible",
    title: "Desarrollo Sostenible",
    shortTitle: "Molina verde",
    summary:
      "Incentivamos programas que buscan enseñar y mantener una vida ecológica para los vecinos.",
    imageUrl: "/images/muniservicios/desarrollo-sostenible.jpg",
    services: [
      {
        slug: "areas-verdes",
        title: "Áreas Verdes",
        summary:
          "Conservación, mantenimiento y mejora de parques, jardines y espacios verdes del distrito.",
      },
      {
        slug: "calidad-aire-ruido",
        title: "Calidad del Aire y Ruido",
        summary:
          "Información y acciones de monitoreo para prevenir la contaminación atmosférica y acústica.",
      },
      {
        slug: "ecorecicla",
        title: "EcoRecicla",
        summary:
          "Programa municipal de segregación y valorización de residuos aprovechables.",
        contact: "Central EcoRecicla: (01) 754-4000",
      },
      {
        slug: "instrumento-ambiental",
        title: "Instrumentos Ambientales",
        summary:
          "Normas, planes y herramientas de gestión ambiental aplicables al distrito.",
      },
      {
        slug: "limpieza-publica",
        title: "Limpieza Pública",
        summary:
          "Información sobre barrido, recolección y mantenimiento de la limpieza de los espacios públicos.",
      },
      {
        slug: "molihuertos",
        title: "MoliHuertos y Fono Árbol",
        summary:
          "Orientación para huertos urbanos y atención de consultas relacionadas con el arbolado.",
      },
      {
        slug: "operativos-integrales",
        title: "Operativos Integrales",
        summary:
          "Intervenciones coordinadas para recuperar, ordenar y mantener espacios públicos.",
      },
      {
        slug: "programa-educca",
        title: "Programa EDUCCA",
        summary:
          "Educación, cultura y ciudadanía ambiental para promover hábitos sostenibles.",
      },
      {
        slug: "recoleccion-maleza",
        title: "Recolección de Maleza",
        summary:
          "Servicio de recojo de restos vegetales conforme a la programación y condiciones municipales.",
      },
      {
        slug: "valorizacion-residuos-organicos",
        title: "Valorización de Residuos Orgánicos",
        summary:
          "Aprovechamiento de residuos orgánicos para reducir su disposición final y producir material valorizado.",
      },
    ],
  },
  {
    slug: "movilidad-sostenible",
    title: "Movilidad Sostenible y Transitabilidad",
    shortTitle: "Movilidad",
    summary:
      "Buscamos promover una movilidad integrada, interconectada y ecoamigable.",
    imageUrl: "/images/muniservicios/movilidad-sostenible.jpg",
    mission:
      "Dar preferencia al transporte de mayor capacidad y proteger al peatón, ciclista, pasajero y conductor.",
    vision:
      "Impulsar el ordenamiento de la movilidad y mejorar la vialidad y accesibilidad del distrito.",
    services: [
      {
        slug: "molibike",
        title: "MoliBike",
        summary:
          "Sistema municipal de préstamo de bicicletas para vecinos y residentes de La Molina.",
        details: [
          "Promueve la bicicleta como medio de transporte no contaminante y actividad saludable.",
          "El préstamo publicado permite usar la bicicleta hasta dos horas al día, sujeto a disponibilidad y condiciones vigentes.",
        ],
      },
      {
        slug: "molitaxi",
        title: "MoliTaxi",
        summary:
          "Programa orientado al ordenamiento y mejora del servicio de taxi en el distrito.",
      },
      {
        slug: "control-transporte",
        title: "Control del Transporte",
        summary:
          "Acciones de fiscalización y control del transporte de pasajeros y carga.",
      },
      {
        slug: "seguridad-educacion-vial",
        title: "Seguridad y Educación Vial",
        summary:
          "Campañas y actividades para prevenir siniestros y promover una convivencia vial responsable.",
      },
      {
        slug: "proyectos-movilidad",
        title: "Proyectos de Movilidad",
        summary:
          "Iniciativas para mejorar la circulación, accesibilidad y prioridad peatonal y ciclista.",
        details: [
          "Incluye proyectos de tránsito calmado y recuperación del espacio público.",
          "La Supermanzana Monterrico prioriza peatones y ciclistas, reduce velocidades e incorpora áreas verdes y recreativas.",
        ],
      },
    ],
  },
  {
    slug: "seguridad-ciudadana",
    title: "Seguridad",
    shortTitle: "Seguridad",
    summary:
      "Realizamos estrategias de seguridad para resguardar el bienestar y mantener el orden del distrito.",
    imageUrl: "/images/muniservicios/seguridad-ciudadana.jpg",
    services: [
      {
        slug: "alerta-la-molina",
        title: "Alerta La Molina",
        summary:
          "Canal municipal para reportar emergencias e incidencias de seguridad.",
        contact: "Serenazgo y emergencias: (01) 313-4444",
      },
      {
        slug: "codisec",
        title: "CODISEC",
        summary:
          "Comité Distrital de Seguridad Ciudadana y acceso a sus planes, acuerdos y actividades.",
      },
      {
        slug: "equipamiento-seguridad",
        title: "Equipamiento",
        summary:
          "Información sobre recursos tecnológicos, vehiculares y operativos destinados a seguridad ciudadana.",
      },
      {
        slug: "patrullaje-integrado",
        title: "Patrullaje Integrado",
        summary:
          "Acciones coordinadas de patrullaje municipal y policial en el distrito.",
      },
      {
        slug: "vigilancia-integral",
        title: "Sistema de Vigilancia Integral",
        summary:
          "Monitoreo preventivo mediante cámaras y recursos municipales de seguridad.",
      },
      {
        slug: "tips-seguridad",
        title: "Consejos de Seguridad",
        summary:
          "Recomendaciones preventivas para el hogar, la vía pública y situaciones de emergencia.",
      },
    ],
  },
  {
    slug: "programas-sociales",
    title: "Programas Sociales",
    shortTitle: "Programas sociales",
    summary:
      "Dirigidos para la población vulnerable y sensibiliza a la comunidad para mejorar la calidad de vida de los vecinos.",
    imageUrl: "/images/muniservicios/programas-sociales.jpg",
    services: [
      {
        slug: "consultorios-virtuales",
        title: "Consultorios Virtuales",
        summary:
          "Orientación remota en nutrición y otros temas de promoción de la salud.",
      },
      {
        slug: "demuna",
        title: "DEMUNA",
        summary:
          "Defensoría Municipal de la Niña, Niño y Adolescente para proteger y promover sus derechos.",
      },
      {
        slug: "ciam",
        title: "CIAM",
        summary:
          "Centro Integral de Atención al Adulto Mayor con actividades de integración, orientación y bienestar.",
      },
      {
        slug: "acompanamiento-pamar-pcds",
        title: "Acompañamiento a PAMAR y PcDS",
        summary:
          "Acompañamiento social dirigido a personas adultas mayores en riesgo y personas con discapacidad severa.",
      },
      {
        slug: "omaped",
        title: "OMAPED",
        summary:
          "Oficina Municipal de Atención a las Personas con Discapacidad: orientación, registro y acceso a programas.",
      },
      {
        slug: "unidad-local-empadronamiento",
        title: "Unidad Local de Empadronamiento",
        summary:
          "Atención relacionada con la clasificación socioeconómica de los hogares en el sistema de focalización.",
      },
      {
        slug: "asesoria-legal-social",
        title: "Asesoría Legal",
        summary:
          "Orientación legal para vecinos dentro del ámbito de atención municipal.",
      },
      {
        slug: "promocion-prevencion-salud",
        title: "Promoción y Prevención de la Salud",
        summary:
          "Campañas, orientación y actividades destinadas a mejorar hábitos y prevenir enfermedades.",
      },
      {
        slug: "vaso-leche",
        title: "Programa Vaso de Leche",
        summary:
          "Apoyo alimentario dirigido a la población beneficiaria conforme a las reglas del programa.",
      },
      {
        slug: "pantbc",
        title: "PANTBC",
        summary:
          "Apoyo alimentario y acompañamiento para personas afectadas por tuberculosis y sus familias.",
      },
    ],
  },
  {
    slug: "emprendimientos-negocios",
    title: "Emprendimientos y Negocios",
    shortTitle: "Molina Emprende",
    summary:
      "Brindamos herramientas, capacitaciones y el apoyo que necesitas para alcanzar tus metas y expandir tu negocio o idea.",
    imageUrl: "/images/muniservicios/emprendimientos-negocios.jpg",
    services: [
      {
        slug: "molina-emprende",
        title: "Molina Emprende",
        summary:
          "Programa integral para fortalecer capacidades, actualizar el registro de emprendedores y promover sus productos.",
        details: [
          "Fortalece el ecosistema emprendedor local.",
          "Promueve innovación, creatividad, empleo y desarrollo económico.",
          "Acompaña desde la idea de negocio hasta su consolidación.",
        ],
      },
      {
        slug: "capacitaciones-emprendedores",
        title: "Capacitaciones",
        summary:
          "Cursos y talleres sobre marketing, finanzas, desarrollo de productos, liderazgo y gestión de negocios.",
      },
      {
        slug: "networking",
        title: "Networking",
        summary:
          "Eventos y espacios de conexión para compartir experiencias, encontrar aliados y generar oportunidades.",
      },
      {
        slug: "exposiciones",
        title: "Exposiciones",
        summary:
          "Espacios itinerantes para exhibir y comercializar productos de emprendimientos locales.",
      },
      {
        slug: "directorio-emprendedores",
        title: "Directorio de Emprendedores",
        summary:
          "Vitrina pública para identificar y contactar emprendimientos del distrito.",
      },
      {
        slug: "bolsas-trabajo-servicios",
        title: "Bolsa de Trabajo",
        summary:
          "Canal para acercar oportunidades laborales a la comunidad y a los emprendimientos locales.",
      },
      {
        slug: "bolsa-servicios",
        title: "Bolsa de Servicios",
        summary:
          "Directorio de oferta de servicios de emprendedores y vecinos para facilitar el intercambio comercial local.",
      },
    ],
  },
  {
    slug: "gobierno-digital",
    title: "Gobierno Digital",
    shortTitle: "Servicios digitales",
    summary:
      "Brindamos canales digitales en beneficio de los habitantes, fomentando el uso de nuevas tecnologías.",
    imageUrl: "/images/muniservicios/gobierno-digital.jpg",
    services: [
      {
        slug: "buscador-tupa",
        title: "Buscador de Trámites TUPA",
        summary:
          "Consulta de procedimientos, requisitos, plazos y derechos de tramitación.",
        action: { label: "Consultar trámites", href: "/tramites-municipales" },
      },
      {
        slug: "mesa-partes",
        title: "Mesa de Partes Digital",
        summary:
          "Canal oficial para presentar documentos dirigidos a la Municipalidad de La Molina.",
        action: {
          label: "Presentar documento",
          href: "https://facilita.gob.pe/t/51855",
          external: true,
        },
      },
      {
        slug: "pagos-tributarios",
        title: "Pagos Tributarios en Línea",
        summary:
          "Consulta y pago en línea de obligaciones tributarias municipales.",
        action: {
          label: "Ir a pagos",
          href: "https://molipagos.munimolina.gob.pe:444/MOLINA.PAGOS/public/index.php/oauth/login",
          external: true,
        },
      },
      {
        slug: "reclamaciones",
        title: "Libro de Reclamaciones",
        summary:
          "Canal digital para registrar reclamos relacionados con la atención municipal.",
        action: {
          label: "Registrar reclamo",
          href: "https://reclamos.servicios.gob.pe/?institution_id=124",
          external: true,
        },
      },
      {
        slug: "buzon-sugerencias",
        title: "Buzón de Sugerencias",
        summary:
          "Formulario para enviar recomendaciones y propuestas de mejora.",
        action: {
          label: "Enviar sugerencia",
          href: "https://facilita.gob.pe/t/52054",
          external: true,
        },
      },
      {
        slug: "normas-legales",
        title: "Normas Legales",
        summary:
          "Consulta centralizada de ordenanzas, acuerdos, resoluciones y publicaciones municipales.",
        action: {
          label: "Consultar normas",
          href: "/normas-legales-y-publicaciones",
        },
      },
    ],
  },
  {
    slug: "recreacion",
    title: "Recreación",
    shortTitle: "Recreación",
    summary:
      "Realizamos actividades a través de programas relacionados con la recreación y bienestar.",
    imageUrl: "/images/muniservicios/recreacion.jpg",
    mission:
      "Fomentar la actividad física, deportiva y recreativa para mejorar la salud y el bienestar de los participantes.",
    vision:
      "Integrar a toda la comunidad en la práctica de actividad física y deporte para mejorar su calidad de vida.",
    services: [
      {
        slug: "molistreetfit",
        title: "MoliStreetFit",
        summary:
          "Actividad física y entrenamiento funcional en espacios públicos.",
      },
      {
        slug: "talleres-integracion",
        title: "Talleres de Integración",
        summary:
          "Actividades recreativas que fortalecen la convivencia y el bienestar comunitario.",
      },
      {
        slug: "moliactivate",
        title: "MoliActívate",
        summary:
          "Programa de activación física abierto a la participación de los vecinos.",
      },
      {
        slug: "molientrevistas",
        title: "MoliEntrevistas",
        summary:
          "Contenido informativo y educativo relacionado con deporte, recreación y bienestar.",
      },
      {
        slug: "escuelas-deportivas",
        title: "Escuelas Deportivas",
        summary:
          "Formación y práctica de disciplinas deportivas para distintas edades.",
      },
      {
        slug: "molifitness",
        title: "MoliFitness",
        summary:
          "Sesiones y actividades dirigidas al acondicionamiento físico y una vida saludable.",
      },
    ],
  },
  {
    slug: "obras",
    title: "Obras",
    shortTitle: "Obras",
    summary:
      "Ejecutamos obras que brinden comodidad y mejoren la calidad de vida de los vecinos.",
    imageUrl: "/images/muniservicios/obras.jpg",
    services: [
      {
        slug: "mantenimiento-periodico-rutinario",
        title: "Mantenimiento Periódico y Rutinario",
        summary:
          "Intervenciones de conservación y mantenimiento de infraestructura y espacios públicos.",
      },
      {
        slug: "obras-realizadas",
        title: "Obras Realizadas",
        summary:
          "Consulta de proyectos e intervenciones municipales concluidas.",
      },
      {
        slug: "obras-proyecto",
        title: "Obras en Proyecto",
        summary:
          "Información sobre proyectos previstos, formulados o en proceso de ejecución.",
      },
    ],
  },
  {
    slug: "gestion-riesgo-desastres",
    title: "Gestión del Riesgo de Desastres",
    shortTitle: "Riesgo de desastres",
    summary:
      "Contamos con un continuo monitoreo de peligros, emergencias y desastres en el distrito.",
    imageUrl: "/images/muniservicios/gestion-riesgo-desastres.jpg",
    services: [
      {
        slug: "gerencia-riesgo-defensa-civil",
        title: "Gestión del Riesgo y Defensa Civil",
        summary:
          "Marco normativo, organización, planes y acciones municipales en gestión del riesgo de desastres.",
      },
      {
        slug: "gestion-coel",
        title: "Centro de Operaciones de Emergencia Local (COEL)",
        summary:
          "Monitorea continuamente peligros, emergencias y desastres e intercambia información para la toma de decisiones.",
        details: [
          "Elabora reportes de situación, informes de emergencia, avisos, alertas, bitácoras y resúmenes ejecutivos.",
          "Administra información sobre daños, acciones de respuesta y recursos disponibles.",
        ],
      },
      {
        slug: "gestion-prospectiva",
        title: "Gestión Prospectiva",
        summary:
          "Acciones destinadas a evitar la generación de nuevos riesgos en el desarrollo del distrito.",
      },
      {
        slug: "gestion-correctiva",
        title: "Gestión Correctiva",
        summary:
          "Medidas para reducir o mitigar riesgos existentes en la población y la infraestructura.",
      },
      {
        slug: "gestion-reactiva",
        title: "Gestión Reactiva",
        summary:
          "Preparación, respuesta y rehabilitación ante emergencias y desastres.",
      },
      {
        slug: "gestion-riesgos-molina",
        title: "Gestión de Riesgos y Desastres de La Molina",
        summary:
          "Información institucional sobre la gestión integral del riesgo de desastres en el distrito.",
      },
    ],
  },
  {
    slug: "parametros-urbanisticos",
    title: "Certificado de Parámetros Urbanísticos y Edificatorios",
    shortTitle: "Parámetros urbanos",
    summary:
      "Documento emitido por la Municipalidad en cuya jurisdicción se ubica el predio y tiene una vigencia de 36 meses.",
    imageUrl: "/images/muniservicios/parametros-urbanisticos.jpg",
    services: [
      {
        slug: "certificado-parametros",
        title: "Certificado de Parámetros Urbanísticos y Edificatorios",
        summary:
          "Documento municipal con vigencia de 36 meses que certifica las disposiciones aplicables al diseño y edificación de un predio.",
        action: {
          label: "Ver requisitos del trámite",
          href: "/tramites-municipales/certificado-parametros",
        },
      },
      {
        slug: "requisitos-parametros",
        title: "Requisitos del Certificado de Parámetros",
        summary:
          "Documentación y condiciones exigidas para solicitar el certificado de parámetros urbanísticos y edificatorios.",
      },
      {
        slug: "recomendaciones-parametros",
        title: "Recomendaciones del Certificado de Parámetros",
        summary:
          "Orientaciones prácticas para preparar y presentar la solicitud del certificado de parámetros.",
      },
    ],
  },
  {
    slug: "seguridad-salud-trabajo",
    title: "Seguridad y Salud en el Trabajo",
    shortTitle: "SG-SST",
    summary: "Acceso público a la información del SGSST",
    imageUrl: "/images/muniservicios/seguridad-salud-trabajo.jpg",
    services: [
      {
        slug: "organizacion-sgsst",
        title: "Seguridad y Salud en el Trabajo",
        summary:
          "Información institucional sobre la estructura, responsabilidades y documentos del sistema de seguridad y salud en el trabajo.",
        details: [
          "El sistema se enmarca en la Ley N.º 29783, Ley de Seguridad y Salud en el Trabajo.",
          "Su finalidad es prevenir lesiones, enfermedades ocupacionales e incidentes en las actividades municipales.",
        ],
      },
      {
        slug: "organizacion-del-sg-sst",
        title: "Organización del SG-SST",
        summary:
          "Detalle de la organización del Sistema de Gestión de Seguridad y Salud en el Trabajo de la Municipalidad.",
      },
    ],
  },
];

function cloneCategories(
  categories: MunicipalServiceCategory[],
): MunicipalServiceCategory[] {
  return categories.map((category) => ({
    ...category,
    services: category.services.map((service) => ({ ...service })),
  }));
}

function resolveHubIcon(
  hub: ScrapedCategory["hub"],
  scraped: ScrapedService,
): string | undefined {
  if (!hub?.tabs?.length) return undefined;
  const match = hub.tabs.find(
    (tab) =>
      tab.pageSlug === scraped.pageSlug ||
      tab.pageSlug === scraped.serviceSlug ||
      tab.iconUrl?.includes(scraped.serviceSlug),
  );
  return match?.iconUrl ?? undefined;
}

/**
 * Merges scraped portal content (paragraphs, sections, images, docs, tables, icons)
 * into catalog categories by matching `serviceSlug`. Safe when JSON is a stub.
 */
export function mergeMunicipalServiceContent(
  categories: MunicipalServiceCategory[] = MUNICIPAL_SERVICE_CATEGORIES,
): MunicipalServiceCategory[] {
  const content = scrapedContent as ScrapedContentFile;
  const scrapedCategories = content.categories ?? {};
  if (Object.keys(scrapedCategories).length === 0) {
    return cloneCategories(categories);
  }

  return cloneCategories(categories).map((category) => {
    const scrapedCategory = scrapedCategories[category.slug];
    if (!scrapedCategory?.services?.length) return category;

    const bySlug = new Map(
      scrapedCategory.services.map((service) => [service.serviceSlug, service]),
    );

    return {
      ...category,
      services: category.services.map((service) => {
        const scraped = bySlug.get(service.slug);
        if (!scraped || scraped.missing) return service;

        const iconFromImages =
          scraped.images?.find((image) => image.kind === "icon")?.url ??
          scraped.images?.find((image) => image.kind === "graphic")?.url;

        const galleryImages =
          scraped.images
            ?.filter((image) => image.kind !== "icon")
            .map((image) => image.url) ?? [];

        const hubIcon = resolveHubIcon(scrapedCategory.hub, scraped);
        const photoGallery = galleryImages.filter(
          (url) => !url.includes("/tabs/") && !/icon/i.test(url),
        );

        return {
          ...service,
          title:
            scraped.title && scraped.title.length > 3
              ? scraped.title
              : service.title,
          iconUrl: service.iconUrl ?? hubIcon ?? iconFromImages,
          body:
            scraped.paragraphs && scraped.paragraphs.length > 0
              ? scraped.paragraphs
              : service.body,
          sections:
            scraped.sections && scraped.sections.length > 0
              ? scraped.sections
              : service.sections,
          images:
            photoGallery.length > 0 ? photoGallery : service.images,
          documents:
            scraped.documents && scraped.documents.length > 0
              ? scraped.documents.map((doc) => ({
                  label: doc.label,
                  href: doc.url,
                }))
              : service.documents,
          tables:
            scraped.tables && scraped.tables.length > 0
              ? scraped.tables
              : service.tables,
        };
      }),
    };
  });
}

export function getMunicipalServiceCategory(slug: string) {
  return MUNICIPAL_SERVICE_CATEGORIES.find((category) => category.slug === slug);
}

export const MUNICIPAL_SERVICE_COUNT = MUNICIPAL_SERVICE_CATEGORIES.reduce(
  (total, category) => total + category.services.length,
  0,
);
