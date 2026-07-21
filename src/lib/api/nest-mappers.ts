import type { NewsCategory, NewsItem } from "@/types/portal";
import type { MunicipalProcedureDetail } from "@/data/municipal-procedures";

type NestNoticia = {
  id: string;
  titulo: string;
  resumen: string;
  slug: string;
  urlImagen?: string | null;
  cuerpo?: string | null;
  enlaceExterno?: string | null;
  publicadoEn: string;
  activo?: boolean;
  categoriaNoticia?: { codigo?: string; nombre?: string } | null;
};

type NestTramite = {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  dirigidoA?: string | null;
  cuando?: string | null;
  duracion?: string | null;
  costo?: string | null;
  resultado?: string | null;
  vigencia?: string | null;
  accionEtiqueta?: string | null;
  accionEnlace?: string | null;
  orden?: number;
  activo?: boolean;
  categorias?: Array<{ categoriaTramite?: { codigo?: string; nombre?: string } }>;
  canales?: Array<{
    descripcion: string;
    horario?: string | null;
    tipoCanal?: { codigo?: string; nombre?: string };
  }>;
  requisitos?: Array<{ texto: string; orden?: number }>;
  documentos?: Array<{ texto: string; orden?: number }>;
  tarifas?: Array<{ concepto: string; monto: string }>;
  preguntasFrecuentes?: Array<{ pregunta: string; respuesta: string }>;
  basesLegales?: Array<{ texto: string }>;
};

const CATEGORIA_NOTICIA: Record<string, NewsCategory> = {
  obras: "Obras",
  cultura: "Cultura",
  seguridad: "Seguridad",
  deportes: "Deportes",
  general: "General",
};

const CATEGORIA_TRAMITE: Record<
  string,
  MunicipalProcedureDetail["categories"][number]
> = {
  vecinos: "Vecinos",
  negocios: "Negocios",
  "registro-civil": "Registro Civil",
  "licencias-de-edificacion": "Edificación",
  tupa: "TUPA",
};

const CANAL_TIPO: Record<
  string,
  MunicipalProcedureDetail["channels"][number]["type"]
> = {
  virtual: "Virtual",
  presencial: "Presencial",
  web: "Web",
  telefonico: "Telefónico",
  "100-en-linea": "100% en línea",
};

export function mapNestNoticiaToNewsItem(n: NestNoticia): NewsItem {
  const codigo = n.categoriaNoticia?.codigo?.toLowerCase() ?? "general";
  return {
    id: n.id,
    title: n.titulo,
    excerpt: n.resumen,
    category: CATEGORIA_NOTICIA[codigo] ?? "General",
    publishedAt: (n.publicadoEn || "").slice(0, 10),
    imageUrl: n.urlImagen || "/images/news/placeholder.jpg",
    slug: n.slug,
    href: n.enlaceExterno || undefined,
    body: n.cuerpo || undefined,
  };
}

export function mapNestTramiteToProcedure(t: NestTramite): MunicipalProcedureDetail {
  const categories = (t.categorias ?? [])
    .map((c) => {
      const codigo = c.categoriaTramite?.codigo ?? "";
      return CATEGORIA_TRAMITE[codigo];
    })
    .filter(Boolean) as MunicipalProcedureDetail["categories"];

  const channels = (t.canales ?? []).map((c) => {
    const codigo = c.tipoCanal?.codigo ?? "presencial";
    return {
      type: CANAL_TIPO[codigo] ?? ("Presencial" as const),
      description: c.descripcion,
      schedule: c.horario || undefined,
    };
  });

  return {
    slug: t.slug,
    title: t.titulo,
    categories: categories.length ? categories : ["Vecinos"],
    summary: t.resumen,
    directedTo: t.dirigidoA || "",
    when: t.cuando || "",
    channels,
    duration: t.duracion || "",
    cost: t.costo || "",
    requirements: (t.requisitos ?? [])
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
      .map((r) => r.texto),
    documents: (t.documentos ?? [])
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
      .map((d) => d.texto),
    result: t.resultado || "",
    validity: t.vigencia || undefined,
    faqs: (t.preguntasFrecuentes ?? []).map((f) => ({
      question: f.pregunta,
      answer: f.respuesta,
    })),
    fees: (t.tarifas ?? []).map((f) => ({
      concept: f.concepto,
      amount: f.monto,
    })),
    legalBasis: (t.basesLegales ?? []).map((b) => b.texto),
    action:
      t.accionEtiqueta && t.accionEnlace
        ? { label: t.accionEtiqueta, href: t.accionEnlace }
        : undefined,
  };
}
