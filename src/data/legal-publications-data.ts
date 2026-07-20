export type LegalDocument = {
  title: string;
  href: string;
  date?: string;
};

export type LegalNormCategory = {
  id: string;
  title: string;
  description: string;
  /** Ruta interna del portal */
  href: string;
  documents: LegalDocument[];
};

export type OtherPublication = {
  id: string;
  title: string;
  date: string;
  description: string;
  /** Ruta interna del portal */
  href: string;
  documents: LegalDocument[];
};

/** Categorías de normas — contenido alojado en este portal (editable vía CMS) */
export const LEGAL_NORM_CATEGORIES: LegalNormCategory[] = [
  {
    id: "decretos-alcaldia",
    title: "Decretos de Alcaldía",
    description:
      "Disposiciones emitidas por la Alcaldía sobre asuntos de orden general y de interés para el distrito.",
    href: "/normas-legales-y-publicaciones/c/decretos-alcaldia",
    documents: [],
  },
  {
    id: "acuerdos-concejo",
    title: "Acuerdos de Concejo",
    description:
      "Decisiones adoptadas por el Concejo Municipal sobre asuntos específicos de interés público.",
    href: "/normas-legales-y-publicaciones/c/acuerdos-concejo",
    documents: [],
  },
  {
    id: "resoluciones-alcaldia",
    title: "Resoluciones de Alcaldía",
    description:
      "Actos administrativos emitidos por el alcalde en ejercicio de sus competencias.",
    href: "/normas-legales-y-publicaciones/c/resoluciones-alcaldia",
    documents: [],
  },
  {
    id: "resoluciones-gerencia-municipal",
    title: "Resoluciones de Gerencia Municipal",
    description:
      "Resoluciones emitidas por la Gerencia Municipal para la gestión administrativa institucional.",
    href: "/normas-legales-y-publicaciones/c/resoluciones-gerencia-municipal",
    documents: [],
  },
  {
    id: "ordenanzas-municipales",
    title: "Ordenanzas Municipales",
    description:
      "Normas de carácter general con mayor jerarquía dentro de la estructura normativa municipal.",
    href: "/normas-legales-y-publicaciones/c/ordenanzas-municipales",
    documents: [],
  },
  {
    id: "directivas-municipales",
    title: "Directivas Municipales",
    description:
      "Lineamientos que regulan procedimientos y actuaciones internas de la Municipalidad.",
    href: "/normas-legales-y-publicaciones/c/directivas-municipales",
    documents: [],
  },
  {
    id: "convenios-interinstitucionales",
    title: "Convenios Interinstitucionales",
    description:
      "Acuerdos de cooperación suscritos con entidades públicas, privadas y organizaciones.",
    href: "/normas-legales-y-publicaciones/c/convenios-interinstitucionales",
    documents: [],
  },
  {
    id: "resoluciones-desarrollo-urbano",
    title: "Resoluciones de Gerencia de Desarrollo Urbano",
    description:
      "Actos administrativos relacionados con el desarrollo urbano y la gestión territorial.",
    href: "/normas-legales-y-publicaciones/c/resoluciones-desarrollo-urbano",
    documents: [],
  },
  {
    id: "resoluciones-administracion-finanzas",
    title: "Resoluciones de Administración y Finanzas",
    description:
      "Resoluciones de la Oficina General de Administración y Finanzas.",
    href: "/normas-legales-y-publicaciones/c/resoluciones-administracion-finanzas",
    documents: [],
  },
  {
    id: "sesiones-concejo",
    title: "Sesiones de Concejo",
    description:
      "Documentos y registros correspondientes a las sesiones del Concejo Municipal.",
    href: "/normas-legales-y-publicaciones/c/sesiones-concejo",
    documents: [],
  },
  {
    id: "historico-sesiones",
    title: "Histórico de Sesiones de Concejo",
    description:
      "Archivo histórico de sesiones del Concejo Municipal.",
    href: "/normas-legales-y-publicaciones/c/historico-sesiones",
    documents: [],
  },
];

export const OTHER_PUBLICATIONS: OtherPublication[] = [
  {
    id: "convocatorias-cas",
    title: "Convocatorias C.A.S",
    date: "16 julio, 2026",
    href: "/normas-legales-y-publicaciones/p/convocatorias-cas",
    description:
      "Convocatorias vigentes y anteriores para la contratación administrativa de servicios.",
    documents: [],
  },
  {
    id: "informe-pei-poi",
    title: "Informe de Evaluación Institucional PEI-POI",
    date: "16 julio, 2026",
    href: "/normas-legales-y-publicaciones/p/informe-pei-poi",
    description:
      "Informes de evaluación institucional anual y semestral del PEI y POI.",
    documents: [],
  },
  {
    id: "penalidades",
    title: "Relación de Penalidades Aplicadas",
    date: "15 julio, 2026",
    href: "/normas-legales-y-publicaciones/p/penalidades",
    description: "Información institucional sobre penalidades aplicadas.",
    documents: [],
  },
  {
    id: "practicantes",
    title: "Convocatoria de Practicantes",
    date: "2 julio, 2026",
    href: "/normas-legales-y-publicaciones/p/practicantes",
    description:
      "Bases y convocatorias de prácticas profesionales de la Municipalidad.",
    documents: [],
  },
  {
    id: "audiencias-publicas",
    title: "Audiencias Públicas",
    date: "30 junio, 2026",
    href: "/normas-legales-y-publicaciones/p/audiencias-publicas",
    description:
      "Periodos, documentos y material de las audiencias públicas municipales.",
    documents: [],
  },
  {
    id: "matriz-compromisos",
    title: "Matriz de compromisos PEI-POI",
    date: "4 junio, 2026",
    href: "/normas-legales-y-publicaciones/p/matriz-compromisos",
    description:
      "Matrices de seguimiento de compromisos del planeamiento institucional.",
    documents: [],
  },
  {
    id: "poi",
    title: "POI — Plan Operativo Institucional",
    date: "4 junio, 2026",
    href: "/normas-legales-y-publicaciones/p/poi",
    description:
      "Dispositivos legales, títulos, archivos y fechas de emisión del POI.",
    documents: [],
  },
  {
    id: "presupuesto-publico",
    title: "Presupuesto Público",
    date: "2 junio, 2026",
    href: "/normas-legales-y-publicaciones/p/presupuesto-publico",
    description:
      "Presupuesto Institucional de Apertura, modificado y documentación presupuestal.",
    documents: [],
  },
  {
    id: "presupuesto-participativo",
    title: "Presupuesto Participativo",
    date: "2 junio, 2026",
    href: "/normas-legales-y-publicaciones/p/presupuesto-participativo",
    description:
      "Información y documentos del proceso de presupuesto participativo por periodo.",
    documents: [],
  },
  {
    id: "evaluacion-cmn",
    title: "Evaluación del CMN",
    date: "28 mayo, 2026",
    href: "/normas-legales-y-publicaciones/p/evaluacion-cmn",
    description: "Bases y evaluación del CMN para el periodo 2025–2027.",
    documents: [],
  },
  {
    id: "control-interno",
    title: "Reporte del Plan de Acción y Evaluación Anual",
    date: "13 abril, 2026",
    href: "/sistema-control-interno",
    description:
      "Reportes del Plan de Acción Anual y sus evaluaciones institucionales.",
    documents: [],
  },
  {
    id: "integridad",
    title: "Programa de Integridad",
    date: "1 abril, 2026",
    href: "/integridad-institucional#documentos",
    description:
      "Programa de Integridad 2026 de la Municipalidad Distrital de La Molina.",
    documents: [],
  },
];

export function getLegalNormCategory(id: string) {
  return LEGAL_NORM_CATEGORIES.find((c) => c.id === id);
}

export function getOtherPublication(id: string) {
  return OTHER_PUBLICATIONS.find((p) => p.id === id);
}
