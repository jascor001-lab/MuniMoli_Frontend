export type MunicipalProcedureCategory =
  | "Vecinos"
  | "Negocios"
  | "Registro Civil"
  | "Edificación"
  | "TUPA";

export type ProcedureChannel = {
  type: "Virtual" | "Presencial" | "Web" | "Telefónico" | "100% en línea";
  description: string;
  schedule?: string;
};

export type ProcedureFaq = {
  question: string;
  answer: string;
};

export type MunicipalProcedureDetail = {
  slug: string;
  title: string;
  categories: MunicipalProcedureCategory[];
  summary: string;
  directedTo: string;
  when: string;
  channels: ProcedureChannel[];
  duration: string;
  cost: string;
  requirements: string[];
  documents: string[];
  result: string;
  validity?: string;
  faqs?: ProcedureFaq[];
  fees?: Array<{ concept: string; amount: string }>;
  legalBasis?: string[];
  action?: {
    label: string;
    href: string;
  };
};

const MUNICIPAL_ADDRESS =
  "Palacio Municipal, Av. Ricardo Elías Aparicio 740, La Molina.";
const PRESENCIAL_8_5: ProcedureChannel = {
  type: "Presencial",
  description: MUNICIPAL_ADDRESS,
  schedule: "Lunes a viernes de 8:00 a.m. a 5:00 p.m.",
};
const PRESENCIAL_810_520: ProcedureChannel = {
  type: "Presencial",
  description:
    "Plataforma Única de Atención, primer piso del Palacio Municipal, Av. Ricardo Elías Aparicio 740.",
  schedule: "Lunes a viernes de 8:10 a.m. a 5:20 p.m.",
};
const VIRTUAL_MESA_PARTES: ProcedureChannel = {
  type: "Virtual",
  description:
    "Presentación de la solicitud y documentos mediante la Mesa de Partes Virtual.",
  schedule:
    "Disponible las 24 horas. Los documentos se procesan según el horario administrativo.",
};

export const MUNICIPAL_PROCEDURES: MunicipalProcedureDetail[] = [
  {
    slug: "fiscalizacion-tributaria",
    title: "Registro y Fiscalización Tributaria",
    categories: ["Vecinos"],
    summary:
      "Registro de contribuyentes y predios, determinación de deuda tributaria y declaraciones juradas.",
    directedTo:
      "Contribuyentes, propietarios de predios y representantes acreditados del distrito de La Molina.",
    when:
      "Cuando necesites registrar o actualizar información tributaria municipal, solicitar beneficios o presentar declaraciones.",
    channels: [PRESENCIAL_810_520],
    duration: "Según el procedimiento tributario solicitado.",
    cost: "Según el TUPA vigente; algunos servicios no tienen costo.",
    requirements: [
      "Documento de identidad del titular o representante.",
      "Documento que acredite la propiedad o el acto que origina la actualización.",
      "Poder o vigencia de poder cuando actúe un representante.",
    ],
    documents: [
      "Declaración jurada correspondiente al procedimiento.",
      "Documentos sustentatorios del predio, transferencia o beneficio solicitado.",
    ],
    result:
      "Actualización del registro municipal del contribuyente o pronunciamiento sobre el procedimiento solicitado.",
    action: {
      label: "Consultar TUPA",
      href: "/tramites-municipales/tupa",
    },
  },
  {
    slug: "procedimientos-tributarios",
    title: "Procedimientos Administrativos Tributarios",
    categories: ["Vecinos"],
    summary:
      "Inafectaciones, devoluciones, compensaciones, prescripción y recursos tributarios municipales.",
    directedTo:
      "Contribuyentes o representantes que requieran un pronunciamiento sobre obligaciones tributarias.",
    when:
      "Cuando corresponda solicitar inafectación, devolución, compensación, prescripción o presentar una reclamación o apelación.",
    channels: [PRESENCIAL_810_520, VIRTUAL_MESA_PARTES],
    duration: "Según el procedimiento y plazo legal aplicable.",
    cost:
      "Los siete procedimientos administrativos publicados son gratuitos.",
    requirements: [
      "Solicitud identificando el procedimiento requerido.",
      "Documento de identidad o representación.",
      "Sustento legal y documental de la petición.",
    ],
    documents: [
      "Documentos que acrediten el pago, condición tributaria o acto impugnado.",
      "Declaraciones y formularios que correspondan al procedimiento.",
    ],
    result:
      "Resolución o pronunciamiento municipal sobre la solicitud tributaria.",
    action: {
      label: "Presentar solicitud",
      href: "https://facilita.gob.pe/t/51855",
    },
  },
  {
    slug: "beneficio-pensionista-adulto-mayor",
    title: "Beneficio para Pensionista o Adulto Mayor",
    categories: ["Vecinos"],
    summary:
      "Deduce 50 UIT de la base imponible del impuesto predial cuando se cumplen las condiciones legales.",
    directedTo:
      "Pensionistas o personas adultas mayores propietarias de un predio que cumplan los límites de propiedad e ingresos.",
    when:
      "Cuando se solicite la aplicación del beneficio tributario sobre la vivienda del titular.",
    channels: [PRESENCIAL_810_520, VIRTUAL_MESA_PARTES],
    duration: "Según evaluación tributaria.",
    cost: "Gratuito.",
    requirements: [
      "Ser pensionista o cumplir la edad legal para adulto mayor.",
      "Poseer una sola vivienda a nombre propio o de la sociedad conyugal, con las excepciones legales.",
      "Tener ingresos brutos mensuales que no excedan 1 UIT.",
    ],
    documents: [
      "Documento de identidad.",
      "Documentación de propiedad.",
      "Constancia de pensión o sustento de ingresos.",
      "Poder cuando actúe un representante.",
    ],
    result:
      "Aplicación de la deducción de 50 UIT en la base imponible del impuesto predial, si corresponde.",
    action: {
      label: "Presentar solicitud",
      href: "https://facilita.gob.pe/t/51855",
    },
  },
  {
    slug: "inafectacion-tributaria",
    title: "Inafectación del Impuesto Predial",
    categories: ["Vecinos"],
    summary:
      "Solicita la exoneración del impuesto predial para propietarios o usos comprendidos por ley.",
    directedTo:
      "Propietarios de predios que se encuentren dentro de los supuestos legales de inafectación.",
    when:
      "Cuando la naturaleza del propietario o el uso del predio permita solicitar la inafectación.",
    channels: [PRESENCIAL_810_520, VIRTUAL_MESA_PARTES],
    duration: "Según evaluación tributaria.",
    cost: "Gratuito.",
    requirements: [
      "Declaración o solicitud firmada.",
      "Acreditar la condición legal que sustenta la inafectación.",
    ],
    documents: [
      "Documento de identidad.",
      "Título o documento de propiedad.",
      "Documentación que acredite el supuesto de inafectación.",
    ],
    result:
      "Resolución o actualización tributaria que reconoce la inafectación, si corresponde.",
    action: {
      label: "Presentar solicitud",
      href: "https://facilita.gob.pe/t/51855",
    },
  },
  {
    slug: "cambio-regimen-patrimonial",
    title: "Cambio de Régimen Patrimonial",
    categories: ["Vecinos"],
    summary:
      "Actualiza la titularidad y el registro tributario luego de cambiar el régimen patrimonial del matrimonio.",
    directedTo:
      "Cónyuges o titulares que hayan inscrito un cambio de sociedad de gananciales a separación de patrimonios, o viceversa.",
    when:
      "Después de inscribir el cambio de régimen patrimonial en Registros Públicos.",
    channels: [
      {
        type: "Presencial",
        description: MUNICIPAL_ADDRESS,
        schedule: "Lunes a viernes de 8:10 a.m. a 4:00 p.m.",
      },
    ],
    duration: "Según verificación del registro tributario.",
    cost: "Según el TUPA vigente.",
    requirements: [
      "Acreditar el cambio de régimen patrimonial inscrito.",
      "Identificación de los titulares o representantes.",
    ],
    documents: [
      "Partida registral o documento notarial inscrito.",
      "Documentación de propiedad del predio.",
      "Poder cuando corresponda.",
    ],
    result: "Actualización de titulares y obligaciones en el registro municipal.",
  },
  {
    slug: "adjudicacion-divorcio",
    title: "Adjudicación de Predio por Divorcio",
    categories: ["Vecinos"],
    summary:
      "Registra la adjudicación de un predio realizada como consecuencia de un divorcio.",
    directedTo:
      "Personas a quienes se haya adjudicado un inmueble luego de la disolución del vínculo matrimonial.",
    when:
      "Después de contar con resolución, escritura o inscripción que acredite la adjudicación.",
    channels: [
      {
        type: "Presencial",
        description: MUNICIPAL_ADDRESS,
        schedule: "Lunes a viernes de 8:10 a.m. a 4:00 p.m.",
      },
    ],
    duration: "Según verificación tributaria y registral.",
    cost: "Según el TUPA vigente.",
    requirements: [
      "Acreditar la adjudicación del predio.",
      "Identificación del nuevo titular o representante.",
    ],
    documents: [
      "Resolución judicial, escritura pública o asiento registral.",
      "Documentos de propiedad y representación.",
    ],
    result:
      "Actualización del titular del predio en el registro tributario municipal.",
  },
  {
    slug: "particion-copropietarios",
    title: "Partición y División de Copropietarios",
    categories: ["Vecinos"],
    summary:
      "Registra la división o terminación de la copropiedad de un inmueble.",
    directedTo:
      "Copropietarios que hayan formalizado la partición o división de un predio.",
    when:
      "Después de formalizar notarial o registralmente el acuerdo de división.",
    channels: [
      {
        type: "Presencial",
        description: MUNICIPAL_ADDRESS,
        schedule: "Lunes a viernes de 8:10 a.m. a 4:00 p.m.",
      },
    ],
    duration: "Según verificación tributaria y registral.",
    cost: "Según el TUPA vigente.",
    requirements: [
      "Acreditar el acuerdo de partición o división.",
      "Identificación de copropietarios o representantes.",
    ],
    documents: [
      "Acuerdo notarial o escritura de partición.",
      "Partida registral y documentos de propiedad.",
      "Poder cuando corresponda.",
    ],
    result:
      "Actualización individual de titulares y porcentajes en el registro municipal.",
  },
  {
    slug: "declaracion-impuesto-predial",
    title: "Registro de Declaración Jurada de Impuesto Predial",
    categories: ["Vecinos"],
    summary:
      "Registra o actualiza la declaración jurada vinculada al impuesto predial.",
    directedTo:
      "Propietarios de predios o representantes obligados a declarar información tributaria.",
    when:
      "Al adquirir un predio, modificar sus características o producirse un hecho que altere la base imponible.",
    channels: [PRESENCIAL_810_520],
    duration: "Según revisión de la declaración y documentos.",
    cost: "Según el TUPA vigente.",
    requirements: [
      "Identificación del contribuyente.",
      "Acreditar la propiedad y las características del predio.",
    ],
    documents: [
      "Formulario de declaración jurada.",
      "Documentos de propiedad.",
      "Planos, memoria u otros sustentos cuando exista modificación física.",
    ],
    result: "Declaración jurada registrada y ficha tributaria actualizada.",
  },
  {
    slug: "solicitudes-simples",
    title: "Registro de Solicitudes Simples",
    categories: ["Vecinos"],
    summary:
      "Permite presentar solicitudes o comunicaciones sobre asuntos de competencia municipal.",
    directedTo:
      "Personas naturales o jurídicas que requieran solicitar o comunicar un asunto municipal.",
    when:
      "Cuando necesites formular un pedido, comunicación o solicitud general a la Municipalidad.",
    channels: [PRESENCIAL_810_520, VIRTUAL_MESA_PARTES],
    duration: "Registro automático.",
    cost: "Gratuito.",
    requirements: ["Solicitud con los datos generales del solicitante."],
    documents: [
      "Documento que sustente el pedido o comunicación, cuando corresponda.",
    ],
    result:
      "Cargo de registro con número de expediente para realizar el seguimiento.",
    faqs: [
      {
        question: "¿Puedo hacer seguimiento virtual?",
        answer:
          "Sí. El cargo incluye un código o número de expediente para consultar el estado del trámite.",
      },
      {
        question: "¿Presentar una solicitud genera automáticamente un derecho?",
        answer:
          "No. La solicitud requiere una respuesta formal de la Municipalidad para concluir el trámite.",
      },
    ],
    action: {
      label: "Presentar solicitud",
      href: "https://facilita.gob.pe/t/51855",
    },
  },
  {
    slug: "declaracion-compra-venta",
    title: "Declaración Jurada de Compra y Venta",
    categories: ["Vecinos"],
    summary:
      "Registra la adquisición o transferencia de un predio y actualiza a sus titulares.",
    directedTo:
      "Personas naturales o jurídicas que hayan adquirido un predio en La Molina.",
    when:
      "Después de una compra, venta u otro acto que modifique la titularidad del predio.",
    channels: [
      PRESENCIAL_8_5,
      {
        type: "100% en línea",
        description:
          "Presentación digital mediante la Mesa de Partes oficial de la Municipalidad.",
        schedule:
          "La ficha fuente publica atención virtual de lunes a viernes de 8:00 a.m. a 7:00 p.m.",
      },
      {
        type: "Telefónico",
        description: "Orientación mediante la central (01) 754-4000.",
      },
    ],
    duration:
      "Atención presencial aproximada de 45 minutos; la presentación virtual puede tomar hasta 48 horas para su registro.",
    cost: "Según el procedimiento tributario aplicable.",
    requirements: [
      "Documento de identidad.",
      "Documento que acredite la adquisición o transferencia.",
      "Poder vigente si actúa un representante.",
    ],
    documents: [
      "Declaración jurada de impuesto predial.",
      "Documento de propiedad o transferencia.",
    ],
    result:
      "Ficha de registro municipal del predio y formularios HR y PU actualizados.",
    validity:
      "La declaración debe presentarse como máximo hasta el primer vencimiento tributario del año siguiente a la transferencia.",
    faqs: [
      {
        question: "¿Desde cuándo se pagan arbitrios e impuesto predial?",
        answer:
          "Los arbitrios corresponden desde el mes siguiente a la adquisición; el impuesto predial, desde el año siguiente.",
      },
    ],
    action: {
      label: "Presentar por Mesa de Partes",
      href: "https://facilita.gob.pe/t/51855",
    },
  },
  {
    slug: "descargos-papeletas",
    title: "Descargos de Papeletas de Infracción",
    categories: ["Vecinos"],
    summary:
      "Permite manifestar oposición o aceptación frente a una sanción administrativa municipal.",
    directedTo:
      "Personas naturales o jurídicas que hayan recibido una papeleta de sanción administrativa.",
    when:
      "Cuando quieras presentar un descargo o acogerte al beneficio por aceptación de la sanción.",
    channels: [
      PRESENCIAL_8_5,
      {
        type: "100% en línea",
        description:
          "Presentación digital mediante la Mesa de Partes oficial de la Municipalidad.",
        schedule:
          "La ficha fuente publica atención virtual de lunes a viernes de 8:00 a.m. a 7:00 p.m.",
      },
      {
        type: "Telefónico",
        description: "Orientación mediante la central (01) 754-4000.",
      },
    ],
    duration: "Registro automático de la solicitud.",
    cost: "Gratuito.",
    requirements: ["Solicitud con los datos generales del administrado."],
    documents: [
      "Sustento del descargo cuando se presenta oposición a la sanción.",
      "Copia de la papeleta o identificación de la sanción.",
    ],
    result:
      "Cargo de registro o liquidación de la sanción con el descuento aplicable.",
    validity:
      "El descargo debe presentarse dentro de los 5 días hábiles posteriores a la imposición de la papeleta.",
    faqs: [
      {
        question: "¿Pagar la multa concluye toda consecuencia de la infracción?",
        answer:
          "No necesariamente. Según el tipo de infracción pueden existir medidas correctivas adicionales.",
      },
    ],
    action: {
      label: "Presentar descargo",
      href: "https://facilita.gob.pe/t/51855",
    },
  },
  {
    slug: "estado-cuenta",
    title: "Estado de Cuenta y Recibos de Pago",
    categories: ["Vecinos"],
    summary:
      "Obtén el estado integral de deuda de tus predios y su liquidación para pago.",
    directedTo:
      "Personas naturales o jurídicas propietarias de un predio en La Molina, o sus representantes.",
    when:
      "Cuando necesites conocer impuestos y tasas pendientes o ante un vencimiento tributario.",
    channels: [PRESENCIAL_8_5, VIRTUAL_MESA_PARTES],
    duration: "Atención automática.",
    cost: "Gratuito.",
    requirements: [
      "Ser titular del predio o representante legal con poder notarial.",
    ],
    documents: ["DNI o documento que acredite la representación."],
    result:
      "Estado de cuenta integral de los predios y liquidación para pagar la deuda.",
    faqs: [
      {
        question: "¿Se puede separar el impuesto predial por cada predio?",
        answer:
          "No. El impuesto predial acumula el autoavalúo de todos los predios de un mismo propietario dentro del distrito.",
      },
      {
        question: "¿Puedo pagar desde otra provincia?",
        answer: "Sí. Las liquidaciones pueden pagarse virtualmente.",
      },
    ],
    action: {
      label: "Ir a pagos en línea",
      href: "https://molipagos.munimolina.gob.pe:444/MOLINA.PAGOS/public/index.php/oauth/login",
    },
  },
  {
    slug: "certificado-parametros",
    title: "Certificado de Parámetros Urbanísticos",
    categories: ["Vecinos", "Edificación"],
    summary:
      "Informa las condiciones técnicas, urbanísticas y edificatorias aplicables a un predio.",
    directedTo:
      "Personas naturales o jurídicas que deseen edificar o modificar un predio en La Molina.",
    when:
      "Antes de desarrollar un proyecto, para conocer las condiciones técnicas que regulan el terreno.",
    channels: [PRESENCIAL_810_520],
    duration: "5 días hábiles.",
    cost:
      "S/ 92.90 según la subpágina de requisitos publicada en noviembre de 2025. Verificar el importe en el TUPA vigente antes de pagar.",
    requirements: [
      "Solicitud simple que indique la ubicación exacta del predio.",
      "Pago del derecho de trámite.",
      "Poder simple original si actúa un representante.",
      "Para personas jurídicas, vigencia de poder emitida por Registros Públicos.",
    ],
    documents: [
      "Formato de solicitud para Mesa de Partes.",
      "Croquis de ubicación cuando sea necesario precisar las vías cercanas.",
      "Comprobante de pago del derecho de trámite.",
    ],
    result:
      "Certificado de Parámetros Urbanísticos y Edificatorios con firma digital y código QR de verificación.",
    validity: "3 años.",
    faqs: [
      {
        question: "¿Debo ser propietario para solicitarlo?",
        answer:
          "No. Puede solicitarlo cualquier persona natural o jurídica.",
      },
      {
        question: "¿Los parámetros pueden cambiar?",
        answer:
          "Sí. Pueden variar si cambia la zonificación aplicable al predio.",
      },
      {
        question: "¿Cómo se entrega el certificado?",
        answer:
          "La ficha institucional contempla notificación electrónica y recojo en la Plataforma Única de Atención, según la modalidad registrada.",
      },
    ],
  },
  {
    slug: "licencia-edificacion",
    title: "Licencia de Edificación",
    categories: ["Vecinos", "Edificación"],
    summary:
      "Autoriza la construcción, modificación o demolición de edificaciones conforme a la normativa vigente.",
    directedTo:
      "Propietarios o personas con derecho a edificar sobre un predio en La Molina.",
    when:
      "Antes de construir, modificar o demoler una edificación.",
    channels: [PRESENCIAL_8_5, VIRTUAL_MESA_PARTES],
    duration:
      "Depende de la modalidad de aprobación establecida por la Ley N.° 29090.",
    cost: "Según la modalidad y el TUPA vigente.",
    requirements: [
      "Requisitos correspondientes a la modalidad de licencia aplicable.",
      "Cumplimiento de la Ley N.° 29090 y su reglamento.",
      "Documentación técnica suscrita por los profesionales responsables.",
    ],
    documents: [
      "Formulario Único de Edificación (FUE) y anexos aplicables.",
      "Planos y memorias técnicas según la modalidad.",
      "Estudio o informe técnico de suelos cuando corresponda.",
    ],
    result: "Licencia que aprueba el proyecto de edificación.",
    validity:
      "36 meses, con posibilidad de prórroga por 12 meses y por única vez cuando se solicita antes del vencimiento.",
    legalBasis: [
      "Ley N.° 27972, Ley Orgánica de Municipalidades.",
      "D.S. N.° 004-2019-JUS, TUO de la Ley N.° 27444.",
      "Resolución N.° 097-2013-SUNARP-SN, Reglamento de Inscripciones del Registro de Predios.",
      "Ley N.° 29090, Ley de Regulación de Habilitaciones Urbanas y de Edificaciones.",
      "D.S. N.° 029-2019-VIVIENDA, Reglamento de la Ley N.° 29090.",
      "R.D. N.° 011-2021-VIVIENDA-VMVU-DGPRVU, lineamientos de numeración y nomenclatura vial.",
      "Acuerdo de Concejo N.° 129-1998-MML, Nomenclatura Vial de La Molina.",
      "Ordenanza N.° 441-2023/MDLM y modificatoria, Reglamento de Organización y Funciones.",
      "Decreto de Alcaldía N.° 010-2016/MDLM y modificatorias, parámetros urbanísticos y estándares de calidad.",
      "D.S. N.° 011-2006-VIVIENDA y modificatorias, Reglamento Nacional de Edificaciones.",
    ],
    faqs: [
      {
        question: "¿Puedo solicitar licencia si el predio está hipotecado?",
        answer:
          "Sí; si el proyecto incluye demolición, se requiere autorización del acreedor hipotecario.",
      },
      {
        question: "¿Puedo regularizar cualquier edificación sin licencia?",
        answer:
          "Solo en los supuestos y periodos permitidos por la normativa vigente y siempre que la edificación cumpla las condiciones aplicables.",
      },
      {
        question: "¿Acondicionamiento y refacción requieren licencia?",
        answer:
          "Están exceptuados cuando no afectan uso, área techada ni elementos estructurales y no involucran patrimonio cultural.",
      },
      {
        question:
          "¿Necesito autorización de los demás propietarios de un edificio?",
        answer:
          "Sí, cuando la obra modifica el diseño original de la fachada o aumenta la volumetría del edificio.",
      },
      {
        question: "¿Puedo cercar un terreno ubicado en una zona no habilitada?",
        answer:
          "No. La ficha indica que la licencia exige contar previamente con un proyecto de habilitación urbana aprobado.",
      },
      {
        question: "¿Puedo elevar el parapeto de la azotea?",
        answer:
          "El trámite depende de los antecedentes de la edificación y de la evaluación de seguridad, registro visual y normas técnicas aplicables.",
      },
      {
        question:
          "¿Puedo sustentar variaciones mediante Informes de Verificación Técnica?",
        answer:
          "No reemplazan la sección del cuaderno de obra donde el responsable acredita las modificaciones realizadas.",
      },
      {
        question:
          "¿Debo dar acabado al muro visible desde el predio vecino?",
        answer:
          "Desde el segundo nivel debe contar con acabado exterior, como tarrajeado, pañeteado o escarchado; no se exige pintura.",
      },
      {
        question: "¿Cuánto dura un anteproyecto y una licencia?",
        answer: "Ambos tienen una vigencia de 36 meses.",
      },
      {
        question: "¿Cómo solicito la prórroga?",
        answer:
          "Debe solicitarse dentro de los 30 días calendario anteriores al vencimiento. Se concede por 12 meses y por una sola vez.",
      },
      {
        question: "¿Puedo modificar una licencia antes de ejecutar la obra?",
        answer:
          "Sí, mientras esté vigente y se cumplan los requisitos del artículo 72 del reglamento.",
      },
      {
        question: "¿Cuándo se presenta factibilidad de servicios?",
        answer:
          "Para obra nueva de vivienda multifamiliar o para fines distintos de vivienda, según la modalidad aplicable.",
      },
      {
        question:
          "¿Es obligatorio tramitar el certificado de parámetros para solicitar la licencia?",
        answer:
          "No figura como requisito obligatorio, pero sus parámetros regulan el diseño y su cumplimiento es obligatorio.",
      },
      {
        question: "¿Cuándo corresponde un estudio de mecánica de suelos?",
        answer:
          "En los supuestos de la Norma E.050: edificaciones de alta concurrencia o riesgo, áreas y alturas determinadas, sótanos, cimentaciones profundas, muros de contención y terrenos inestables, entre otros.",
      },
      {
        question: "¿Qué es una refacción?",
        answer:
          "Es la mejora o renovación de instalaciones, equipamiento o elementos constructivos sin alterar uso, área techada ni estructura.",
      },
      {
        question: "¿Qué es un acondicionamiento?",
        answer:
          "Es la adecuación de ambientes mediante elementos removibles, acabados e instalaciones sin alterar la estructura.",
      },
      {
        question: "¿Cuándo puedo solicitar numeración municipal?",
        answer:
          "Después de obtener la licencia de edificación o cuando una modificación, conformidad o declaratoria genere una nueva asignación.",
      },
      {
        question:
          "¿Cuál es la diferencia entre resolución y certificado de numeración?",
        answer:
          "La resolución asigna el número municipal; el certificado acredita oficialmente una numeración definitiva ya asignada.",
      },
    ],
    action: {
      label: "Presentar por Mesa de Partes",
      href: "https://facilita.gob.pe/t/51855",
    },
  },
  {
    slug: "formularios-edificacion",
    title: "Formularios de Licencias de Edificación",
    categories: ["Edificación"],
    summary:
      "Formularios FUE, anexos, formatos técnicos y documentación vinculada a la Ley N.° 29090.",
    directedTo:
      "Propietarios, proyectistas y profesionales responsables de trámites de edificación.",
    when:
      "Al preparar el expediente de una licencia, conformidad de obra, declaratoria o procedimiento relacionado.",
    channels: [PRESENCIAL_810_520],
    duration: "No aplica; sección de consulta y descarga.",
    cost: "Descarga gratuita.",
    requirements: ["Seleccionar el formulario correspondiente al procedimiento."],
    documents: [
      "Formulario Único de Edificación y anexos.",
      "Formatos de verificación, dictamen e informes técnicos.",
    ],
    result: "Formularios oficiales para preparar el expediente.",
    action: {
      label: "Consultar TUPA",
      href: "/tramites-municipales/tupa",
    },
  },
  {
    slug: "habilitaciones-urbanas",
    title: "Licencias de Habilitaciones Urbanas",
    categories: ["Edificación"],
    summary:
      "Formularios y anexos para habilitación urbana, subdivisión, independización y regularización.",
    directedTo:
      "Propietarios y profesionales que gestionen habilitaciones urbanas en el distrito.",
    when:
      "Para habilitar terrenos, subdividir, independizar o regularizar habilitaciones ejecutadas.",
    channels: [PRESENCIAL_810_520, VIRTUAL_MESA_PARTES],
    duration: "Según modalidad y procedimiento del TUPA.",
    cost: "Según el TUPA vigente.",
    requirements: [
      "Formulario Único de Habilitación Urbana correspondiente.",
      "Requisitos técnicos y legales de la modalidad solicitada.",
    ],
    documents: [
      "FUHU.",
      "Anexos para condóminos naturales o personas jurídicas.",
      "Formatos de subdivisión, independización y regularización.",
      "Acta de verificación, dictamen e informes administrativos.",
    ],
    result:
      "Resolución o licencia correspondiente al procedimiento de habilitación urbana.",
    action: {
      label: "Presentar por Mesa de Partes",
      href: "https://facilita.gob.pe/t/51855",
    },
  },
  {
    slug: "licencia-funcionamiento",
    title: "Licencia de Funcionamiento",
    categories: ["Negocios"],
    summary:
      "Autoriza la apertura de un establecimiento compatible con la zonificación y el índice de usos.",
    directedTo:
      "Personas naturales o jurídicas propietarias o arrendatarias de un local en La Molina.",
    when: "Antes de iniciar actividades comerciales o de servicios.",
    channels: [
      PRESENCIAL_8_5,
      {
        type: "100% en línea",
        description:
          "Presentación digital mediante la Mesa de Partes oficial de la Municipalidad.",
        schedule:
          "La ficha fuente publica atención virtual de lunes a viernes de 8:00 a.m. a 7:00 p.m.",
      },
      {
        type: "Telefónico",
        description: "Orientación mediante la central (01) 754-4000.",
      },
    ],
    duration:
      "Hasta 2 días hábiles para riesgo bajo o medio; para riesgo alto o muy alto, el plazo depende de la inspección y evaluación.",
    cost:
      "Depende del nivel de riesgo y del derecho establecido en el TUPA.",
    requirements: [
      "Formato de solicitud con carácter de declaración jurada.",
      "RUC y documento de identidad o representación.",
      "Compatibilidad de zonificación y giro.",
      "Declaraciones y anexos de seguridad según el nivel de riesgo.",
      "Autorizaciones sectoriales cuando correspondan.",
    ],
    documents: [
      "Formato de declaración jurada de Licencia de Funcionamiento.",
      "Riesgo bajo o medio: anexos 1, 2, 3 y 4 para licencia, determinación de riesgo y declaración de condiciones de seguridad.",
      "Riesgo alto o muy alto: anexos 1, 2 y 3.",
      "Riesgo alto o muy alto: croquis de ubicación.",
      "Riesgo alto o muy alto: plano de arquitectura y cálculo de aforo.",
      "Riesgo alto o muy alto: plano de tableros eléctricos, diagramas unifilares y cuadro de cargas.",
      "Riesgo alto o muy alto: certificado vigente de medición de resistencia del sistema de puesta a tierra.",
      "Riesgo alto o muy alto: plan de seguridad del establecimiento.",
      "Riesgo alto o muy alto: memorias o protocolos de operatividad y mantenimiento de equipos de seguridad y protección contra incendios.",
    ],
    result: "Licencia de Funcionamiento y, cuando corresponde, Certificado ITSE.",
    validity:
      "La licencia puede ser temporal o indeterminada. El Certificado ITSE tiene vigencia de 2 años.",
    legalBasis: [
      "Ley N.° 28976 y D.S. N.° 163-2020-PCM, marco de Licencia de Funcionamiento.",
      "D.S. N.° 002-2018-PCM, Reglamento de Inspecciones Técnicas de Seguridad en Edificaciones.",
      "Ordenanza N.° 1661-2013-MML, Índice de Usos para actividades urbanas en La Molina.",
      "Ordenanza N.° 149-2007-MDLM, reglamento de licencias de funcionamiento.",
      "Ordenanza N.° 212-2011-MDLM.",
      "Ordenanza N.° 292-2015-MDLM.",
      "Decreto de Alcaldía N.° 010-2016-MDLM y modificatorias.",
      "Ordenanza N.° 371, procedimientos y servicios de licencias e ITSE.",
      "Decreto de Alcaldía N.° 001-2021-MDLM.",
    ],
    faqs: [
      {
        question: "¿Puedo funcionar apenas presento el expediente?",
        answer:
          "No. El establecimiento solo puede operar después de obtener la autorización correspondiente.",
      },
      {
        question: "¿Es necesario contar con RUC?",
        answer:
          "Sí. Es un requisito para personas naturales y jurídicas.",
      },
      {
        question: "¿Un extranjero puede solicitarla?",
        answer:
          "Sí, si cuenta con RUC y carné de extranjería vigente.",
      },
      {
        question: "¿El Certificado ITSE forma parte del procedimiento?",
        answer:
          "Sí. La licencia y la inspección de seguridad forman parte de un procedimiento integrado según el nivel de riesgo.",
      },
      {
        question: "¿Cuáles son los plazos según el riesgo?",
        answer:
          "Riesgo bajo o medio: hasta 2 días hábiles para emitir la licencia y programar la inspección. Riesgo alto o muy alto: la ficha estima 8 días hábiles si no hay observaciones.",
      },
      {
        question: "¿Quién puede presentar o recoger la documentación?",
        answer:
          "Puede hacerlo otra persona; para firmar la conformidad debe presentar carta poder simple. La ficha indica que la licencia y el ITSE se notifican al domicilio fiscal.",
      },
      {
        question: "¿Puedo solicitar una evaluación de compatibilidad de uso?",
        answer:
          "Sí. La evaluación técnica de zonificación e índice de usos se solicita mediante escrito simple y la ficha la identifica como gratuita.",
      },
      {
        question: "¿Puedo transferir una licencia?",
        answer:
          "Sí, siempre que se mantengan los giros autorizados y la zonificación. Debe comunicarse la transferencia a la municipalidad.",
      },
      {
        question: "¿Necesito una licencia por cada establecimiento?",
        answer:
          "Sí. Cada local requiere una licencia de funcionamiento vinculada a su ubicación.",
      },
    ],
    action: {
      label: "Presentar por Mesa de Partes",
      href: "https://facilita.gob.pe/t/51855",
    },
  },
  {
    slug: "certificado-defensa-civil",
    title: "Certificado ITSE — Defensa Civil",
    categories: ["Negocios"],
    summary:
      "Acredita que el establecimiento cumple las condiciones de seguridad en edificaciones.",
    directedTo:
      "Propietarios o arrendatarios de locales con licencia de funcionamiento vigente o en trámite.",
    when:
      "Para abrir un local o renovar un certificado ITSE próximo a vencer.",
    channels: [
      PRESENCIAL_8_5,
      {
        type: "Telefónico",
        description: "Orientación mediante la central (01) 754-4000.",
      },
    ],
    duration: "Depende del nivel de riesgo del establecimiento.",
    cost: "Según el nivel de riesgo y el TUPA vigente.",
    requirements: [
      "Cumplir los requisitos del Decreto Supremo N.° 002-2018-PCM.",
      "Contar con licencia de funcionamiento vigente o en trámite cuando corresponda.",
    ],
    documents: [
      "Riesgo bajo o medio: anexos 1, 2, 3 y 4.",
      "Riesgo alto o muy alto: anexos 1, 2 y 3 y documentación técnica.",
      "Renovación: anexos 1 y 5.",
    ],
    result:
      "Certificado de Inspección Técnica de Seguridad en Edificaciones.",
    validity: "2 años.",
  },
  {
    slug: "redes-subterraneas",
    title: "Autorización para Ampliación de Redes Subterráneas",
    categories: ["Negocios", "Edificación"],
    summary:
      "Autoriza intervenciones de mantenimiento, reparación o ampliación de redes de servicios.",
    directedTo:
      "Empresas de energía eléctrica, agua, desagüe o telecomunicaciones que intervendrán vías locales.",
    when:
      "Antes de ejecutar trabajos sobre redes o conexiones en vías del distrito.",
    channels: [PRESENCIAL_8_5, VIRTUAL_MESA_PARTES],
    duration: "Depende del alcance y plazo de la intervención.",
    cost: "Según el TUPA vigente.",
    requirements: [
      "Solicitud con datos de la intervención y vías involucradas.",
      "La Municipalidad solo autoriza intervenciones en vías locales.",
      "Para vías metropolitanas se requiere autorización de la Municipalidad Metropolitana de Lima.",
    ],
    documents: [
      "Solicitud general.",
      "Plano de ubicación de la intervención.",
      "Autorización metropolitana cuando corresponda.",
    ],
    result: "Carta de autorización de la intervención.",
    action: {
      label: "Presentar por Mesa de Partes",
      href: "https://facilita.gob.pe/t/51855",
    },
  },
  {
    slug: "publicidad-exterior",
    title: "Autorización de Publicidad Exterior",
    categories: ["Negocios"],
    summary:
      "Autoriza la instalación de avisos publicitarios en locales o áreas de dominio público.",
    directedTo:
      "Personas naturales o jurídicas conductoras de un establecimiento comercial.",
    when:
      "Antes de instalar un aviso simple, luminoso, banderola o elemento publicitario.",
    channels: [PRESENCIAL_8_5],
    duration: "Según el tipo de anuncio y procedimiento aplicable.",
    cost: "Según el TUPA y la clasificación del anuncio.",
    requirements: [
      "Presentar un expediente por cada anuncio.",
      "Cumplir el TUPA institucional y la Ordenanza N.° 371-MDLM.",
    ],
    documents: ["Solicitud simple y documentación técnica aplicable."],
    result:
      "Resolución y certificado de autorización; para banderolas y afiches temporales se entrega resolución.",
    validity:
      "Indeterminada, salvo autorizaciones temporales como banderolas.",
    faqs: [
      {
        question: "¿Puedo colocar el anuncio en cualquier parte del local?",
        answer:
          "No. La ubicación y características están sujetas a restricciones técnicas y normativas.",
      },
    ],
  },
  {
    slug: "infraestructura-telecom",
    title: "Infraestructura de Telecomunicaciones",
    categories: ["Negocios"],
    summary:
      "Autoriza la instalación de infraestructura y antenas de telecomunicaciones.",
    directedTo:
      "Personas jurídicas que instalarán infraestructura de telecomunicaciones en La Molina.",
    when:
      "Antes de instalar antenas o infraestructura destinada a mejorar la cobertura.",
    channels: [PRESENCIAL_8_5, VIRTUAL_MESA_PARTES],
    duration:
      "Aprobación automática cuando se cumplen los requisitos normativos.",
    cost: "S/ 4.30, sujeto a actualización en el TUPA.",
    requirements: ["Cumplir los requisitos establecidos en el TUPA vigente."],
    documents: ["Formulario FUIIT y documentos exigidos por el TUPA."],
    result: "Autorización para instalar la infraestructura.",
    action: {
      label: "Presentar por Mesa de Partes",
      href: "https://facilita.gob.pe/t/51855",
    },
  },
  {
    slug: "cese-actividades",
    title: "Cese de Actividades Económicas",
    categories: ["Negocios"],
    summary:
      "Cancela la autorización de funcionamiento de un establecimiento comercial.",
    directedTo:
      "Personas naturales o jurídicas titulares o conductoras de un local.",
    when: "Cuando concluyan las actividades comerciales en el establecimiento.",
    channels: [PRESENCIAL_8_5, VIRTUAL_MESA_PARTES],
    duration: "30 días hábiles.",
    cost: "Gratuito.",
    requirements: [
      "Solicitud simple o declaración jurada de cese de licencia.",
    ],
    documents: ["Licencia de Funcionamiento."],
    result: "Resolución de cese de actividades.",
    faqs: [
      {
        question: "¿Debo cesar una licencia para obtener otra en otro local?",
        answer:
          "No. Las licencias están vinculadas al predio y una persona puede tener varias.",
      },
    ],
    action: {
      label: "Presentar por Mesa de Partes",
      href: "https://facilita.gob.pe/t/51855",
    },
  },
  {
    slug: "matrimonio-civil",
    title: "Matrimonio Civil",
    categories: ["Registro Civil"],
    summary:
      "Procedimiento para contraer matrimonio civil ante la Municipalidad Distrital de La Molina.",
    directedTo:
      "Parejas que cumplan los requisitos legales y donde al menos uno de los contrayentes resida en La Molina.",
    when:
      "Cuando deseen iniciar el expediente matrimonial y reservar una fecha de ceremonia.",
    channels: [
      {
        type: "Presencial",
        description: MUNICIPAL_ADDRESS,
        schedule: "Lunes a viernes de 8:00 a.m. a 4:20 p.m.",
      },
      {
        type: "Telefónico",
        description: "Central (01) 754-4000, anexo 262.",
        schedule: "Lunes a viernes de 8:00 a.m. a 4:20 p.m.",
      },
    ],
    duration:
      "Luego de la publicación del edicto deben transcurrir 8 días hábiles. La fecha depende de la evaluación del expediente y disponibilidad.",
    cost:
      "Apertura de expediente: S/ 200. La ceremonia tiene tarifas diferenciadas según sede, día y horario, desde S/ 200 hasta S/ 2,500.",
    requirements: [
      "Solicitud simple con nombres, apellidos, domicilio, documento de identidad y, cuando corresponda, datos del representante.",
      "Exhibición del DNI o carné de extranjería de ambos contrayentes al abrir el expediente.",
      "Copia certificada y legible de la partida de nacimiento de cada contrayente, con antigüedad máxima de 3 meses.",
      "Exhibición del DNI o carné de extranjería de dos testigos mayores de edad.",
      "Declaración jurada de los dos testigos indicando que conocen a los contrayentes.",
      "Constancia médica prenupcial de ambos contrayentes, con antigüedad máxima de 30 días.",
      "Declaración jurada del estado civil actual de ambos contrayentes.",
      "Declaración jurada del domicilio de cada contrayente; al menos uno debe residir en La Molina.",
      "Constancia de pago según el lugar y horario seleccionados para la ceremonia.",
    ],
    documents: [
      "Menores de edad: autorización expresa de los padres, ascendientes o autorización judicial conforme al artículo 244 del Código Civil.",
      "Divorciados: acta de matrimonio con inscripción del divorcio, documento de identidad actualizado, declaración de no administrar bienes de hijos menores y, para la mujer divorciada, acreditar 300 días o presentar dispensa o constancia médica negativa de embarazo.",
      "Viudos: acta de defunción del cónyuge, documento de identidad actualizado, declaración sobre bienes de hijos menores y, para la mujer viuda, acreditar 300 días o la excepción correspondiente.",
      "Extranjeros: partida de nacimiento, certificado de soltería y documentos del estado civil apostillados o legalizados; traducción oficial cuando no estén en español; pasaporte o carné de extranjería.",
      "Matrimonio por poder: escritura pública con facultades específicas inscrita en SUNARP. Si fue otorgada fuera del país, debe estar legalizada o apostillada y traducida. El poder tiene una vigencia máxima de 6 meses.",
      "Parentesco entre contrayentes: dispensa judicial de parentesco de consanguinidad colateral de tercer grado.",
      "Hijos de peruanos nacidos en el extranjero: partida expedida por la autoridad peruana competente.",
      "Edicto matrimonial: se entrega luego de validar el expediente, debe publicarse una vez y deben transcurrir 8 días hábiles desde la publicación.",
    ],
    result: "Celebración del matrimonio y acta correspondiente.",
    validity:
      "Partidas: 3 meses. Certificados médicos: 30 días. Poder matrimonial: 6 meses. Luego de publicar el edicto deben transcurrir 8 días hábiles.",
    fees: [
      {
        concept:
          "Verificación de documentos y reserva de fecha, dentro o fuera del distrito",
        amount: "S/ 200.00",
      },
      {
        concept:
          "Ceremonia en local municipal, lunes a miércoles en horario laborable",
        amount: "S/ 700.00",
      },
      {
        concept:
          "Ceremonia en local municipal, jueves a sábado en horario laborable",
        amount: "S/ 1,200.00",
      },
      {
        concept:
          "Ceremonia en local municipal, miércoles a viernes en horario no laborable",
        amount: "S/ 1,500.00",
      },
      {
        concept:
          "Ceremonia en parques, jardines, lagunas o local privado dentro del distrito",
        amount: "S/ 2,000.00",
      },
      {
        concept: "Ceremonia fuera del distrito, en distritos aledaños",
        amount: "S/ 1,500.00",
      },
      {
        concept:
          "Ceremonia fuera del distrito, distrito no aledaño dentro de Lima (primer importe publicado)",
        amount: "S/ 1,800.00",
      },
      {
        concept:
          "Ceremonia fuera del distrito, distrito no aledaño dentro de Lima (segundo importe publicado; confirmar supuesto)",
        amount: "S/ 2,500.00",
      },
      {
        concept: "Servicio de fotografía municipal",
        amount: "S/ 200.00",
      },
      {
        concept: "Servicio de músico de cámara",
        amount: "S/ 250.00",
      },
      {
        concept: "Fotografía por personal externo en la municipalidad",
        amount: "S/ 180.00",
      },
      {
        concept: "Alquiler de toldo o cocineta para brindis y bocaditos",
        amount: "S/ 250.00",
      },
      {
        concept: "Veinticinco sillas Tiffany para invitados adicionales",
        amount: "S/ 500.00",
      },
    ],
    faqs: [
      {
        question: "¿Dónde puedo realizar una consulta?",
        answer:
          "En la sede municipal o llamando al (01) 754-4000, anexo 262.",
      },
    ],
    action: {
      label: "Consultar TUPA",
      href: "/tramites-municipales/tupa",
    },
  },
  {
    slug: "divorcios",
    title: "Separación Convencional y Divorcio Ulterior",
    categories: ["Registro Civil"],
    summary:
      "Procedimiento no contencioso que permite disolver el vínculo matrimonial por mutuo acuerdo.",
    directedTo:
      "Cónyuges con más de dos años de matrimonio, casados en La Molina o cuyo último domicilio conyugal se encuentre en el distrito.",
    when:
      "Cuando ambos cónyuges acuerden separarse y cumplan los requisitos del procedimiento no contencioso.",
    channels: [
      PRESENCIAL_8_5,
      {
        type: "Telefónico",
        description:
          "Central (01) 313-4444, anexo 262, o teléfono directo (01) 313-4492.",
      },
    ],
    duration:
      "El divorcio ulterior puede solicitarse luego de 2 meses de emitida la resolución de separación convencional.",
    cost:
      "Separación convencional: S/ 255.40. Divorcio ulterior: S/ 141.10.",
    requirements: [
      "Tener más de dos años de matrimonio.",
      "Haber contraído matrimonio en La Molina o haber tenido el último domicilio conyugal en el distrito.",
      "Solicitud escrita con nombres, documentos, domicilios y dirección para notificaciones; las firmas y huellas se colocan ante el responsable de Registro Civil.",
      "Si un cónyuge vive en el extranjero: poder consular legalizado por Relaciones Exteriores e inscrito en Registros Públicos.",
      "Si un cónyuge vive en provincia: poder notarial inscrito en Registros Públicos.",
      "Indicar si alguno no puede firmar, es analfabeto, ciego o tiene otra incapacidad para aplicar firma a ruego y huella digital.",
    ],
    documents: [
      "Copias simples y legibles de los documentos de identidad vigentes de ambos cónyuges, con estado civil actualizado.",
      "Partida de matrimonio expedida dentro de los 3 meses anteriores a la solicitud.",
      "Partidas de nacimiento de los hijos expedidas dentro de los 3 meses anteriores, cuando corresponda.",
      "Declaración jurada de no tener hijos menores o mayores con incapacidad, cuando corresponda.",
      "Declaración jurada de carecer de bienes sujetos al régimen de sociedad de gananciales.",
      "Declaración jurada del último domicilio conyugal.",
      "Sentencia firme o acta de conciliación sobre patria potestad, alimentos, tenencia y visitas de hijos menores.",
      "Sentencia firme o acta de conciliación sobre curatela, alimentos y visitas de hijos mayores con incapacidad.",
      "Sentencia firme de interdicción y nombramiento de curador, cuando corresponda.",
      "Testimonio de escritura pública inscrita sobre separación de patrimonios.",
      "Testimonio de escritura pública inscrita sobre sustitución o liquidación del régimen patrimonial.",
      "Para el divorcio ulterior: solicitud presentada por uno de los cónyuges y constancia de pago, transcurridos 2 meses desde la resolución de separación.",
    ],
    result:
      "Resolución de separación convencional y, posteriormente, resolución de divorcio ulterior.",
    faqs: [
      {
        question: "¿Dónde puedo realizar consultas?",
        answer:
          "En los teléfonos (01) 313-4444, anexo 262, y (01) 313-4492. Confirma el horario vigente antes de acudir.",
      },
    ],
    action: {
      label: "Consultar TUPA",
      href: "/tramites-municipales/tupa",
    },
  },
  {
    slug: "tupa",
    title: "Texto Único de Procedimientos Administrativos — TUPA",
    categories: ["TUPA"],
    summary:
      "Consulta los procedimientos, requisitos, derechos de tramitación, plazos y autoridades competentes.",
    directedTo:
      "Ciudadanía, empresas y administrados que realizarán un trámite municipal.",
    when:
      "Antes de presentar una solicitud, para verificar requisitos, costos y plazos vigentes.",
    channels: [
      {
        type: "Virtual",
        description: "Consulta digital del TUPA municipal.",
      },
    ],
    duration: "Consulta inmediata.",
    cost: "Acceso gratuito.",
    requirements: ["No requiere registro."],
    documents: [
      "TUPA vigente de la Municipalidad Distrital de La Molina.",
      "Ordenanza N.° 470/MDLM y Acuerdo de Concejo N.° 267 que sustentan el TUPA publicado como vigente.",
      "Línea de tiempo del TUPA vigente.",
      "Actualizaciones y antecedentes correspondientes a 2023.",
      "Decretos de Alcaldía y actualizaciones correspondientes a 2021.",
      "Ordenanza y anexos correspondientes a 2019.",
      "TUPA y anexos correspondientes a 2018.",
      "Decretos y anexos correspondientes a 2017.",
      "Ordenanza y antecedentes correspondientes a 2016.",
    ],
    result: "Información oficial vigente del procedimiento seleccionado.",
    legalBasis: [
      "El documento vigente y sus normas modificatorias prevalecen cuando una ficha web presenta datos contradictorios.",
      "Los documentos históricos se conservan como referencia y están separados de la versión vigente.",
    ],
    action: {
      label: "Buscar un trámite",
      href: "/tramites-municipales",
    },
  },
];

export const MUNICIPAL_PROCEDURE_CATEGORIES: MunicipalProcedureCategory[] = [
  "Vecinos",
  "Negocios",
  "Registro Civil",
  "Edificación",
  "TUPA",
];

/** Compatibilidad con nombres usados por las páginas del portal anterior. */
export const MUNICIPAL_PROCEDURE_ALIASES: Record<string, string> = {
  "tramites-de-sg-de-registro-y-fiscalizacion-tributaria":
    "fiscalizacion-tributaria",
  "certificado-de-parametros-urbanisticos": "certificado-parametros",
  "registro-de-solicitudes-simples": "solicitudes-simples",
  "descargos-de-papeletas-de-infraccion": "descargos-papeletas",
  "emision-de-estado-de-cuenta-y-recibos-de-pago": "estado-cuenta",
  "licencias-de-funcionamiento-mas": "licencia-funcionamiento",
  "licencias-de-funcionamiento": "licencia-funcionamiento",
  "autorizacion-para-ampliacion-de-redes": "redes-subterraneas",
  "autorizacion-para-la-instalacion-de-publicidad": "publicidad-exterior",
  "contenido-tramites-municipales": "infraestructura-telecom",
  "cese-de-actividades-economicas": "cese-actividades",
  "contenido-licencias-de-edificacion": "licencia-edificacion",
  "formularios-licencias-de-edificacion": "formularios-edificacion",
  "licencias-de-habilitaciones-urbanas": "habilitaciones-urbanas",
  "tupa-tramites": "tupa",
};

export function getMunicipalProcedure(slug: string) {
  const canonicalSlug = MUNICIPAL_PROCEDURE_ALIASES[slug] ?? slug;
  return MUNICIPAL_PROCEDURES.find(
    (procedure) => procedure.slug === canonicalSlug,
  );
}
