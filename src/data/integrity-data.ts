export type IntegrityTopic = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const INTEGRITY_TOPICS: IntegrityTopic[] = [
  {
    id: "integridad-publica",
    title: "¿Qué es la Integridad Pública?",
    description:
      "Es la actuación coherente con valores, principios y normas que promueve y protege el desempeño ético de la función pública. Busca que los poderes y recursos confiados al Estado se destinen a sus fines, orientando el servicio público al interés general y a la generación de valor público.",
    image: "/images/integridad/integridad-publica.png",
    imageAlt:
      "Infografía oficial de la Municipalidad de La Molina sobre integridad pública",
  },
  {
    id: "cultura-integridad",
    title: "Cultura de Integridad Pública",
    description:
      "Es un entorno en el que funcionarios e instituciones actúan de manera transparente, ética y responsable. Promueve la honestidad, la imparcialidad, la rendición de cuentas y el cumplimiento de las normas para asegurar el interés general y combatir la corrupción.",
    image: "/images/integridad/cultura-integridad.png",
    imageAlt:
      "Infografía oficial sobre cultura de integridad en la gestión pública",
  },
  {
    id: "enfoque-integridad",
    title: "Enfoque de Integridad Pública",
    description:
      "Es un enfoque transversal de gestión que evalúa y fortalece el desempeño ético de servidores y funcionarios, mitigando riesgos que puedan facilitar prácticas contrarias a la ética o actos de corrupción. Promueve la prevención, la debida diligencia y la actuación oportuna.",
    image: "/images/integridad/enfoque-integridad.png",
    imageAlt: "Infografía oficial sobre el enfoque de integridad pública",
  },
  {
    id: "politica-nacional",
    title: "Política Nacional de Integridad y Lucha contra la Corrupción",
    description:
      "Es el instrumento que ordena, integra y actualiza las acciones adoptadas por el país para fortalecer la prevención y sanción de los actos de corrupción. Fue aprobada mediante el Decreto Supremo N.° 092-2017-PCM.",
    image: "/images/integridad/politica-nacional-integridad.png",
    imageAlt:
      "Infografía oficial sobre la Política Nacional de Integridad y Lucha contra la Corrupción",
  },
  {
    id: "plan-nacional",
    title: "Plan Nacional de Integridad y Lucha contra la Corrupción",
    description:
      "Establece acciones priorizadas para prevenir y combatir la corrupción e impulsar la integridad pública. Facilita la articulación y coordinación entre entidades para implementar la política nacional, en el marco del Decreto Supremo N.° 180-2021-PCM.",
    image: "/images/integridad/plan-nacional-integridad.png",
    imageAlt:
      "Infografía oficial del Plan Nacional de Integridad y Lucha contra la Corrupción",
  },
  {
    id: "modelo-integridad",
    title: "Modelo de Integridad",
    description:
      "Es un conjunto de orientaciones, mecanismos y procedimientos para fortalecer la capacidad de prevención y sanción frente a la corrupción y las prácticas contrarias a la ética. Su implementación articula nueve componentes en todas las áreas de la entidad.",
    image: "/images/integridad/modelo-integridad.png",
    imageAlt:
      "Infografía oficial que presenta los nueve componentes del Modelo de Integridad",
  },
  {
    id: "etica-funcion-publica",
    title: "Ética en la Función Pública",
    description:
      "La ética permite distinguir lo correcto de lo incorrecto. En la administración pública se refiere a los valores que hacen posible el quehacer profesional, poniendo como eje el bien común, objetivo principal de la actividad del Estado.",
    image: "/images/integridad/etica-funcion-publica.png",
    imageAlt: "Infografía oficial sobre ética en la gestión pública",
  },
];

export const INTEGRITY_COMPONENTS = [
  {
    title: "Compromiso de la Alta Dirección",
    description:
      "Asegura las condiciones para establecer una cultura de integridad y fortalecer al órgano encargado de esta función.",
  },
  {
    title: "Gestión de riesgos",
    description:
      "Identifica, evalúa y mitiga espacios vulnerables que pueden dar lugar a delitos contra la administración pública.",
  },
  {
    title: "Políticas de integridad",
    description:
      "Establece estándares de cumplimiento y responsabilidad para entidades y servidores públicos.",
  },
  {
    title: "Transparencia, datos abiertos y rendición de cuentas",
    description:
      "Promueve la publicación de información, el acceso público, la apertura de datos y la rendición de cuentas.",
  },
  {
    title: "Controles interno, externo y auditoría",
    description:
      "Asegura el cumplimiento del Sistema de Control Interno y del control gubernamental externo.",
  },
  {
    title: "Comunicación y capacitación",
    description:
      "Fortalece el desempeño ético mediante difusión, capacitación, inducción y evaluación del clima laboral.",
  },
  {
    title: "Canal de denuncias",
    description:
      "Permite reportar actos de corrupción, aplicar medidas de protección y preservar la identidad del denunciante.",
  },
  {
    title: "Supervisión y monitoreo",
    description:
      "Evalúa el avance del modelo mediante el Índice de Capacidad Preventiva frente a la Corrupción.",
  },
  {
    title: "Encargado del Modelo de Integridad",
    description:
      "Unidad responsable del seguimiento, articulación, orientación y consolidación del modelo en la entidad.",
  },
] as const;

export const INTEGRITY_DOCUMENTS = [
  {
    title: "Programa de Integridad 2026",
    date: "30/03/2026",
    href: "/documents/integridad/programa-integridad-2026.pdf",
    description:
      "Programa de Integridad 2026 de la Municipalidad Distrital de La Molina, aprobado por Resolución de Alcaldía N.° 022-2026-MDLM.",
  },
  {
    title: "Compromiso de Integridad Institucional",
    date: "25/03/2026",
    href: "/documents/integridad/compromiso-integridad-2026.pdf",
    description:
      "Documento institucional que expresa el compromiso de la Municipalidad con la ética, la transparencia y la prevención de la corrupción.",
  },
] as const;

export const INTEGRITY_SOURCE_URL =
  "https://portal.munimolina.gob.pe/integridad-institucional/";
