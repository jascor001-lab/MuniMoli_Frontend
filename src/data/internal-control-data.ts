export type InternalControlDocument = {
  title: string;
  href: string;
  kind: "Plan de acción" | "Evaluación" | "Seguimiento";
};

export type InternalControlPeriod = {
  year: number;
  documents: readonly InternalControlDocument[];
};

export const INTERNAL_CONTROL_PERIODS: readonly InternalControlPeriod[] = [
  {
    year: 2026,
    documents: [
      {
        title: "Plan de Acción Anual — Medidas de Remediación 2026",
        href: "/documents/control-interno/plan-accion-medidas-remediacion-2026.pdf",
        kind: "Plan de acción",
      },
      {
        title: "Plan de Acción Anual — Sección Medidas de Control 2026",
        href: "/documents/control-interno/plan-accion-medidas-control-2026.pdf",
        kind: "Plan de acción",
      },
    ],
  },
  {
    year: 2024,
    documents: [
      {
        title: "Evaluación Anual de la Implementación del SCI — Enero 2024",
        href: "/documents/control-interno/evaluacion-anual-implementacion-sci-2024.pdf",
        kind: "Evaluación",
      },
      {
        title: "Plan de Acción Anual — Medidas de Remediación",
        href: "/documents/control-interno/plan-accion-medidas-remediacion-2024.pdf",
        kind: "Plan de acción",
      },
      {
        title: "Plan de Acción Anual — Sección Medidas de Control",
        href: "/documents/control-interno/plan-accion-medidas-control-2024.pdf",
        kind: "Plan de acción",
      },
      {
        title: "Primer Reporte de Seguimiento del Plan de Acción Semestral 2024",
        href: "/documents/control-interno/primer-seguimiento-plan-accion-2024.pdf",
        kind: "Seguimiento",
      },
      {
        title:
          "Reporte Semestral de Evaluación de la Implementación del Sistema de Control Interno",
        href: "/documents/control-interno/evaluacion-semestral-sci-2024.pdf",
        kind: "Evaluación",
      },
      {
        title: "Segundo Reporte de Seguimiento del Plan de Acción Anual 2024",
        href: "/documents/control-interno/segundo-seguimiento-plan-accion-2024.pdf",
        kind: "Seguimiento",
      },
    ],
  },
] as const;

export const INTERNAL_CONTROL_SOURCE_URL =
  "https://portal.munimolina.gob.pe/reporte-plan-de-accion-anual-y-evaluacion-anual/";
