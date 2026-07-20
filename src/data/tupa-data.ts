export type TupaDocument = {
  order: number;
  title: string;
  description: string;
  href?: string;
  fileType?: "PDF" | "JPEG";
  sourceIssue?: string;
};

export type TupaPeriod = {
  year: string;
  documents: TupaDocument[];
};

export const TUPA_CURRENT: TupaDocument = {
  order: 1,
  title: "TUPA — Ordenanza N.° 470/MDLM y Acuerdo de Concejo N.° 267",
  description:
    "Texto Único de Procedimientos Administrativos vigente de la Municipalidad Distrital de La Molina.",
  href: "/documents/tramites-municipales/tupa-097.pdf",
  fileType: "PDF",
};

export const TUPA_TIMELINE: TupaDocument = {
  order: 1,
  title: "Línea del tiempo del TUPA histórico",
  description:
    "Resumen gráfico de las normas y actualizaciones del TUPA municipal.",
  href: "/documents/tramites-municipales/tupa-098.jpeg",
  fileType: "JPEG",
};

export const TUPA_HISTORICAL_PERIODS: TupaPeriod[] = [
  {
    year: "2023",
    documents: [
      {
        order: 1,
        title: "Decreto de Alcaldía N.° 001-2023",
        description:
          "Actualiza la denominación de las unidades de organización titulares de procedimientos administrativos y servicios prestados en exclusividad contenidos en el TUPA vigente, en concordancia con la Ordenanza N.° 411/MDLM, que modifica la estructura orgánica y el Reglamento de Organización y Funciones de la Municipalidad Distrital de La Molina, modificado previamente por las Ordenanzas N.° 388/MDLM, N.° 395/MDLM y N.° 397/MDLM.",
        href: "/documents/tramites-municipales/tupa-099.pdf",
        fileType: "PDF",
      },
      {
        order: 2,
        title: "Decreto de Alcaldía N.° 005-2023",
        description:
          "Aprueba la actualización de ocho (08) procedimientos administrativos y un (01) servicio prestado en exclusividad estandarizados de Inspecciones Técnicas de Seguridad en Edificaciones, en el marco del Decreto Supremo N.° 043-2021-PCM y su fe de erratas, conforme al cuadro y los formatos del Anexo N.° 1 del decreto.",
        href: "/documents/tramites-municipales/tupa-100.pdf",
        fileType: "PDF",
      },
    ],
  },
  {
    year: "2021",
    documents: [
      {
        order: 1,
        title: "Decreto de Alcaldía N.° 001-2021",
        description:
          "Aprueba la actualización de once procedimientos administrativos estandarizados de licencias de funcionamiento.",
        href: "/documents/tramites-municipales/licencia-funcionamiento-027.pdf",
        fileType: "PDF",
      },
      {
        order: 2,
        title: "Ordenanza N.° 413/MDLM",
        description:
          "Aprueba el procedimiento administrativo estandarizado de licencia provisional de funcionamiento para bodegas para incorporarlo al TUPA municipal.",
        href: "/documents/tramites-municipales/tupa-101.pdf",
        fileType: "PDF",
      },
      {
        order: 3,
        title: "Decreto de Alcaldía N.° 003-2021/MDLM",
        description:
          "Aprueba la actualización del procedimiento administrativo estandarizado de acceso a la información pública creada u obtenida por la entidad, que se encuentre en su posesión o bajo su control, conforme al Anexo N.° 01 que forma parte integrante del decreto.",
        href: "/documents/tramites-municipales/tupa-102.pdf",
        fileType: "PDF",
      },
      {
        order: 4,
        title: "Decreto de Alcaldía N.° 004-2021/MDLM",
        description:
          "Actualiza ocho procedimientos administrativos y un servicio prestado en exclusividad de Inspecciones Técnicas de Seguridad en Edificaciones conforme al D.S. N.° 043-2021-PCM.",
        sourceIssue:
          "El enlace de descarga publicado por el portal institucional devuelve una página HTML y no un PDF válido.",
      },
    ],
  },
  {
    year: "2019",
    documents: [
      {
        order: 1,
        title: "Ordenanza N.° 379-2019",
        description:
          "Aprueba procedimientos administrativos y servicios prestados en exclusividad de licencias de edificaciones y habilitaciones urbanas para incorporarlos al TUPA. Fue ratificada por el Acuerdo de Concejo N.° 054 de la Municipalidad Metropolitana de Lima.",
        href: "/documents/tramites-municipales/licencia-edificacion-084.pdf",
        fileType: "PDF",
      },
      {
        order: 2,
        title: "Anexo de la Ordenanza N.° 379-2019",
        description:
          "Anexo técnico de procedimientos de edificaciones y habilitaciones urbanas.",
        href: "/documents/tramites-municipales/licencia-edificacion-085.pdf",
        fileType: "PDF",
      },
    ],
  },
  {
    year: "2018",
    documents: [
      {
        order: 1,
        title: "Ordenanza N.° 371-2018",
        description:
          "Norma que aprobó procedimientos, servicios, requisitos y derechos de tramitación del TUPA correspondiente al periodo 2018.",
        sourceIssue:
          "La fila del portal institucional enlaza por error al anexo de la Ordenanza N.° 379-2019.",
      },
      {
        order: 2,
        title: "Anexo de la Ordenanza N.° 371-2018",
        description:
          "Anexo de procedimientos administrativos de la Ordenanza N.° 371-2018.",
        href: "/documents/tramites-municipales/tupa-105.pdf",
        fileType: "PDF",
      },
      {
        order: 3,
        title: "Anexo TUPA 2018",
        description:
          "Documento consolidado de procedimientos administrativos correspondiente al TUPA 2018.",
        href: "/documents/tramites-municipales/tupa-106.pdf",
        fileType: "PDF",
      },
    ],
  },
  {
    year: "2017",
    documents: [
      {
        order: 1,
        title: "Decreto de Alcaldía N.° 006-2017",
        description:
          "Adecuó el TUPA aprobado mediante Ordenanza N.° 321 y ratificado por la Municipalidad Metropolitana de Lima mediante Acuerdo de Concejo N.° 337 del 7 de octubre de 2016.",
        sourceIssue:
          "El archivo publicado usa un dominio institucional antiguo que ya no resuelve.",
      },
      {
        order: 2,
        title: "Anexo del Decreto de Alcaldía N.° 006-2017",
        description:
          "Anexo con las adecuaciones aplicadas al TUPA municipal.",
        href: "/documents/tramites-municipales/tupa-108.pdf",
        fileType: "PDF",
      },
    ],
  },
  {
    year: "2016",
    documents: [
      {
        order: 1,
        title: "Decreto de Alcaldía N.° 016-2016",
        description:
          "Deja sin efecto derechos de tramitación de procedimientos administrativos establecidos en el TUPA aprobado por Ordenanza N.° 321.",
        href: "/documents/tramites-municipales/tupa-109.pdf",
        fileType: "PDF",
      },
      {
        order: 2,
        title: "Ordenanza N.° 321-2016",
        description:
          "Aprueba procedimientos administrativos, servicios prestados en exclusividad, requisitos y derechos de tramitación del TUPA. Fue ratificada por el Acuerdo de Concejo N.° 337-2016.",
        href: "/documents/tramites-municipales/tupa-110.pdf",
        fileType: "PDF",
      },
    ],
  },
];

export const TUPA_DOCUMENT_COUNT =
  2 +
  TUPA_HISTORICAL_PERIODS.reduce(
    (total, period) => total + period.documents.length,
    0,
  );
