const NORMS_REPOSITORY_URL =
  "https://portal.munimolina.gob.pe/nor_legales/otros/normas_legales/index.php";

function normCategoryUrl(type: string) {
  return `${NORMS_REPOSITORY_URL}?limit=10&modal_asunto=modal&tipo=${encodeURIComponent(type)}&anio=&estado=&asunto=&nro_documento=&free_search=`;
}

export const LEGAL_NORM_CATEGORIES = [
  {
    id: "decretos-alcaldia",
    title: "Decretos de Alcaldía",
    description:
      "Disposiciones emitidas por la Alcaldía sobre asuntos de orden general y de interés para el distrito.",
    href: normCategoryUrl("Decreto de Alcaldía"),
  },
  {
    id: "acuerdos-concejo",
    title: "Acuerdos de Concejo",
    description:
      "Decisiones adoptadas por el Concejo Municipal sobre asuntos específicos de interés público.",
    href: normCategoryUrl("Acuerdo de Concejo"),
  },
  {
    id: "resoluciones-alcaldia",
    title: "Resoluciones de Alcaldía",
    description:
      "Actos administrativos emitidos por el alcalde en ejercicio de sus competencias.",
    // El repositorio histórico registra este tipo con la grafía “Alcadía”.
    href: normCategoryUrl("Resolución de Alcadía"),
  },
  {
    id: "resoluciones-gerencia-municipal",
    title: "Resoluciones de Gerencia Municipal",
    description:
      "Resoluciones emitidas por la Gerencia Municipal para la gestión administrativa institucional.",
    href: normCategoryUrl("Resolución de Gerencia Municipal"),
  },
  {
    id: "ordenanzas-municipales",
    title: "Ordenanzas Municipales",
    description:
      "Normas de carácter general con mayor jerarquía dentro de la estructura normativa municipal.",
    href: normCategoryUrl("Ordenanza Municipal"),
  },
  {
    id: "directivas-municipales",
    title: "Directivas Municipales",
    description:
      "Lineamientos que regulan procedimientos y actuaciones internas de la Municipalidad.",
    href: normCategoryUrl("Directiva Municipal"),
  },
  {
    id: "convenios-interinstitucionales",
    title: "Convenios Interinstitucionales",
    description:
      "Acuerdos de cooperación suscritos con entidades públicas, privadas y organizaciones.",
    href: normCategoryUrl("Convenios Interinstitucionales"),
  },
  {
    id: "resoluciones-desarrollo-urbano",
    title: "Resoluciones de Gerencia de Desarrollo Urbano",
    description:
      "Actos administrativos relacionados con el desarrollo urbano y la gestión territorial.",
    href: normCategoryUrl("Resolución de Gerencia de Desarrollo Urbano"),
  },
  {
    id: "resoluciones-administracion-finanzas",
    title: "Resoluciones de Administración y Finanzas",
    description:
      "Resoluciones de la Oficina General de Administración y Finanzas.",
    href: normCategoryUrl(
      "Resolución de la Oficina General de Administración y Finanzas",
    ),
  },
  {
    id: "sesiones-concejo",
    title: "Sesiones de Concejo",
    description:
      "Documentos y registros correspondientes a las sesiones del Concejo Municipal.",
    href: normCategoryUrl("Sesion de Concejo"),
  },
  {
    id: "historico-sesiones",
    title: "Histórico de Sesiones de Concejo",
    description:
      "Consulta el archivo histórico de sesiones del Concejo Municipal.",
    href: "https://portal.munimolina.gob.pe/nor_legales/HISTORICOSC/sesiones_concejo/sesion_concejo_2024",
  },
] as const;

export const OTHER_PUBLICATIONS = [
  {
    title: "Convocatorias C.A.S",
    date: "16 julio, 2026",
    href: "https://portal.munimolina.gob.pe/convocatorias-c-a-s/",
    description:
      "Convocatorias vigentes y anteriores para la contratación administrativa de servicios.",
  },
  {
    title: "Informe de Evaluación Institucional PEI-POI",
    date: "16 julio, 2026",
    href: "https://portal.munimolina.gob.pe/informe-de-evaluacion-institucional-pei-poi-anual-semestral/",
    description:
      "Informes de evaluación institucional anual y semestral del PEI y POI.",
  },
  {
    title: "Relación de Penalidades Aplicadas",
    date: "15 julio, 2026",
    href: "https://portal.munimolina.gob.pe/relacion-penalidades-aplicadas/",
    description: "Información institucional sobre penalidades aplicadas.",
  },
  {
    title: "Convocatoria de Practicantes",
    date: "2 julio, 2026",
    href: "https://portal.munimolina.gob.pe/practicantes-mdlm/",
    description:
      "Bases y convocatorias de prácticas profesionales de la Municipalidad.",
  },
  {
    title: "Audiencias Públicas",
    date: "30 junio, 2026",
    href: "https://portal.munimolina.gob.pe/audiencias-publicas/",
    description:
      "Periodos, documentos y material de las audiencias públicas municipales.",
  },
  {
    title: "Matriz de compromisos PEI-POI",
    date: "4 junio, 2026",
    href: "https://portal.munimolina.gob.pe/matriz-de-compromisos-pei-poi/",
    description:
      "Matrices de seguimiento de compromisos del planeamiento institucional.",
  },
  {
    title: "POI — Plan Operativo Institucional",
    date: "4 junio, 2026",
    href: "https://portal.munimolina.gob.pe/poi-plan-operativo-institucional/",
    description:
      "Dispositivos legales, títulos, archivos y fechas de emisión del POI.",
  },
  {
    title: "Presupuesto Público",
    date: "2 junio, 2026",
    href: "https://portal.munimolina.gob.pe/presupuesto-publico/",
    description:
      "Presupuesto Institucional de Apertura, modificado y documentación presupuestal.",
  },
  {
    title: "Presupuesto Participativo",
    date: "2 junio, 2026",
    href: "https://portal.munimolina.gob.pe/presupuesto-participativo/",
    description:
      "Información y documentos del proceso de presupuesto participativo por periodo.",
  },
  {
    title: "Evaluación del CMN",
    date: "28 mayo, 2026",
    href: "https://portal.munimolina.gob.pe/evaluacion-del-cmn/",
    description: "Bases y evaluación del CMN para el periodo 2025–2027.",
  },
  {
    title: "Reporte del Plan de Acción y Evaluación Anual",
    date: "13 abril, 2026",
    href: "/sistema-control-interno",
    description:
      "Reportes del Plan de Acción Anual y sus evaluaciones institucionales.",
  },
  {
    title: "Programa de Integridad",
    date: "1 abril, 2026",
    href: "/integridad-institucional#documentos",
    description:
      "Programa de Integridad 2026 de la Municipalidad Distrital de La Molina.",
  },
] as const;

export const LEGAL_PUBLICATIONS_SOURCE_URL =
  "https://portal.munimolina.gob.pe/normas-legales-y-publicaciones/";
