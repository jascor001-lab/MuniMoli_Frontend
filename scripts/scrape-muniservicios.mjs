/**
 * Scrapes Muniservicios hubs + detail pages from portal.munimolina.gob.pe
 * via WordPress REST API, downloads images locally, writes JSON inventory.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_JSON = path.join(ROOT, "src/data/muniservicios-content.json");
const IMG_ROOT = path.join(ROOT, "public/images/muniservicios/detalle");
const TAB_ROOT = path.join(ROOT, "public/images/muniservicios/tabs");
const DOC_ROOT = path.join(ROOT, "public/documents/muniservicios");

const BASE = "https://portal.munimolina.gob.pe";
const WP = `${BASE}/wp-json/wp/v2/pages`;

/** categorySlug -> { hubSlug, pages: [{ serviceSlug, pageSlug, title? }] } */
const CATALOG = {
  "participacion-vecinal": {
    hubSlug: "contenido-vecinos",
    pages: [
      { serviceSlug: "participacion-vecinal", pageSlug: "participacion-vecinal" },
      { serviceSlug: "audiencias-vecinales", pageSlug: "audiencias-vecinales" },
      { serviceSlug: "talleres-capacitacion", pageSlug: "talleres-de-capacitacion" },
      { serviceSlug: "ruos", pageSlug: "ruos" },
      {
        serviceSlug: "mesas-concertacion",
        pageSlug: "servicios-vecinos02",
        titleFallback: "Mesas de Concertación Municipal",
      },
      {
        serviceSlug: "voluntariado",
        pageSlug: "servicios-vecinos05",
        titleFallback: "Gestión de Voluntariado",
      },
    ],
  },
  "desarrollo-social-educacion-cultura": {
    hubSlug: "contenido-educacion",
    pages: [
      { serviceSlug: "educacion", pageSlug: "educacion" },
      { serviceSlug: "cetpro", pageSlug: "cetpro" },
      { serviceSlug: "ie-descubriendo", pageSlug: "ie-municipal-descubriendo" },
      { serviceSlug: "promocion-cultural", pageSlug: "promocion-cultural" },
      { serviceSlug: "molicasa-molitalleres", pageSlug: "molicasa" },
      { serviceSlug: "plaza-bicentenario", pageSlug: "plaza-bicentenario" },
      { serviceSlug: "moliturismo", pageSlug: "moliturismo" },
      { serviceSlug: "biblioteca-municipal", pageSlug: "biblioteca-municipal" },
    ],
  },
  "desarrollo-sostenible": {
    hubSlug: "contenido-molina-verde",
    pages: [
      { serviceSlug: "areas-verdes", pageSlug: "areas-verdes" },
      {
        serviceSlug: "calidad-aire-ruido",
        pageSlug: "calidad-del-aire-y-ruido-en-el-distrito",
      },
      { serviceSlug: "ecorecicla", pageSlug: "ecorecicla" },
      { serviceSlug: "instrumento-ambiental", pageSlug: "instrumento-ambiental" },
      { serviceSlug: "limpieza-publica", pageSlug: "limpieza-publica" },
      {
        serviceSlug: "molihuertos",
        pageSlug: "molihuertos-y-fonoarbol",
      },
      { serviceSlug: "operativos-integrales", pageSlug: "operativos-integrales" },
      { serviceSlug: "programa-educca", pageSlug: "programa-educca" },
      {
        serviceSlug: "recoleccion-maleza",
        pageSlug: "servicio-recoleccion-de-maleza",
      },
      {
        serviceSlug: "valorizacion-residuos-organicos",
        pageSlug: "valorizacion-de-residuos-solidos",
      },
    ],
  },
  "movilidad-sostenible": {
    hubSlug: "contenido-movilidad-sostenible",
    pages: [
      { serviceSlug: "molibike", pageSlug: "molibike" },
      { serviceSlug: "molitaxi", pageSlug: "molitaxi" },
      { serviceSlug: "control-transporte", pageSlug: "control-de-transporte" },
      {
        serviceSlug: "seguridad-educacion-vial",
        pageSlug: "seguridad-y-educacion-vial",
      },
      { serviceSlug: "proyectos-movilidad", pageSlug: "proyectos" },
    ],
  },
  "seguridad-ciudadana": {
    hubSlug: "contenido-seguridad",
    pages: [
      { serviceSlug: "alerta-la-molina", pageSlug: "alerta-la-molina" },
      { serviceSlug: "patrullaje-integrado", pageSlug: "patrullaje-integrado" },
      { serviceSlug: "equipamiento-seguridad", pageSlug: "equipamiento" },
      {
        serviceSlug: "codisec",
        pageSlug: "plan-local-de-seguridad-ciudadana",
      },
      { serviceSlug: "tips-seguridad", pageSlug: "tips-de-seguridad" },
      {
        serviceSlug: "vigilancia-integral",
        pageSlug: "observatorio-de-seguridad-ciudadana",
      },
    ],
  },
  "programas-sociales": {
    hubSlug: "contenido-servicios-para-el-vecino",
    pages: [
      {
        serviceSlug: "consultorios-virtuales",
        pageSlug: "consultorio-virtual-nutricional",
      },
      { serviceSlug: "demuna", pageSlug: "demuna" },
      { serviceSlug: "ciam", pageSlug: "ciam" },
      {
        serviceSlug: "acompanamiento-pamar-pcds",
        pageSlug: "acompanamiento-a-pamar",
      },
      { serviceSlug: "omaped", pageSlug: "omaped" },
      {
        serviceSlug: "unidad-local-empadronamiento",
        pageSlug: "unidad-local-empadronamiento",
      },
      { serviceSlug: "asesoria-legal-social", pageSlug: "asesoria-legal" },
      {
        serviceSlug: "promocion-prevencion-salud",
        pageSlug: "promocion-y-prevencion-de-la-salud",
      },
      { serviceSlug: "vaso-leche", pageSlug: "programa-vaso-de-leche" },
      { serviceSlug: "pantbc", pageSlug: "pantbc" },
    ],
  },
  "emprendimientos-negocios": {
    hubSlug: "molinaemprende",
    pages: [
      { serviceSlug: "molina-emprende", pageSlug: "molinaemprende" },
      {
        serviceSlug: "capacitaciones-emprendedores",
        pageSlug: "molinaemprende-capacitaciones",
      },
      { serviceSlug: "networking", pageSlug: "molinaemprende-networking" },
      { serviceSlug: "exposiciones", pageSlug: "molinaemprende-exposiciones" },
      {
        serviceSlug: "directorio-emprendedores",
        pageSlug: "molinaemprende-directorio-emprendedores",
      },
      {
        serviceSlug: "bolsas-trabajo-servicios",
        pageSlug: "molinaemprende-bolsa-de-trabajo",
      },
      {
        serviceSlug: "bolsa-servicios",
        pageSlug: "molinaemprende-bolsa-de-servico",
      },
    ],
  },
  recreacion: {
    hubSlug: "contenido-recreacion",
    pages: [
      { serviceSlug: "molistreetfit", pageSlug: "molistreet" },
      { serviceSlug: "talleres-integracion", pageSlug: "talleres-de-integracion" },
      { serviceSlug: "moliactivate", pageSlug: "moliactivate" },
      { serviceSlug: "molientrevistas", pageSlug: "molientrevistas" },
      { serviceSlug: "escuelas-deportivas", pageSlug: "escuelas-deportivas" },
      { serviceSlug: "molifitness", pageSlug: "molifitness" },
    ],
  },
  obras: {
    hubSlug: "contenido-obras",
    pages: [
      {
        serviceSlug: "mantenimiento-periodico-rutinario",
        pageSlug: "mantenimiento-periodico-y-rutinario",
      },
      { serviceSlug: "obras-realizadas", pageSlug: "obras-realizadas" },
      { serviceSlug: "obras-proyecto", pageSlug: "en-proyectos" },
    ],
  },
  "gestion-riesgo-desastres": {
    hubSlug: "contenido-riesgo-de-desastres",
    pages: [
      {
        serviceSlug: "gerencia-riesgo-defensa-civil",
        pageSlug: "riesgo-de-desastres-defensa-civil",
      },
      { serviceSlug: "gestion-coel", pageSlug: "gestion-coel" },
      { serviceSlug: "gestion-prospectiva", pageSlug: "gestion-prospectiva" },
      { serviceSlug: "gestion-correctiva", pageSlug: "gestion-correctiva" },
      { serviceSlug: "gestion-reactiva", pageSlug: "gestion-reactiva" },
      {
        serviceSlug: "gestion-riesgos-molina",
        pageSlug: "gestion-de-riesgos-y-desastres-de-la-molina",
      },
    ],
  },
  "parametros-urbanisticos": {
    hubSlug: "certificado-de-parametros-urbanisticos",
    pages: [
      {
        serviceSlug: "certificado-parametros",
        pageSlug: "certificado-de-parametros-urbanisticos",
      },
      {
        serviceSlug: "requisitos-parametros",
        pageSlug: "requisitos-certificado-de-parametros-urbanisticos",
      },
      {
        serviceSlug: "recomendaciones-parametros",
        pageSlug: "recomendaciones-certificado-de-parametros-urbanisticos",
      },
    ],
  },
  "seguridad-salud-trabajo": {
    hubSlug: null,
    pages: [
      {
        serviceSlug: "organizacion-sgsst",
        pageSlug: "seguridad-y-salud-en-el-trabajo",
      },
      {
        serviceSlug: "organizacion-del-sg-sst",
        pageSlug: "organizacion-del-sg-sst",
      },
    ],
  },
};

const NOISE =
  /canal de denuncias|portal del usuario|pagos tributarios|clasificaci[oó]n aa|gobierno digital|transmisi[oó]n en vivo|sesi[oó]n solemne|cont[aá]ctanos|te encuentras|servicios municipales\s*>|men[uú]|search|close|previous|next|av\.\s*ricardo el[ií]as|lunes a viernes de 8|proyectos y anexos foliados/i;

const TAB_LABELS = [
  "PARTICIPACIÓN VECINAL",
  "AUDIENCIAS VECINALES",
  "TALLERES DE CAPACITACIÓN",
  "RUOS",
  "MESAS DE CONCERTACIÓN MUNICIPAL",
  "GESTIÓN DE VOLUNTARIADO",
];

function decodeHtml(s) {
  return s
    .replace(/&#8211;/g, "–")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8217;/g, "'")
    .replace(/&#038;/g, "&")
    .replace(/&#176;/g, "°")
    .replace(/&#186;/g, "º")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html) {
  return decodeHtml(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\n+/g, "\n")
      .replace(/[ \t]+/g, " "),
  );
}

function absUrl(url) {
  if (!url) return null;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${BASE}${url}`;
  return url;
}

function preferFullSize(url) {
  return url
    .replace(/-\d+x\d+(?=\.(jpe?g|png|webp|gif)$)/i, "")
    .replace(/-scaled(?=\.(jpe?g|png|webp|gif)$)/i, "");
}

function isJunkImage(url) {
  const u = url.toLowerCase();
  return (
    /cropped-frame|favicon|logo-app|tupa2|captura-de-pantalla-2025-03-10|whatsapp-image|icon-|sprite|gravatar|emoji|wp-includes|dummy|placeholder|logo-mdlm|la-molina-emprende-logo/i.test(
      u,
    ) || /-\d+x\d+\.(jpe?g|png|webp|gif)$/i.test(u)
  );
}

function isTabIconCandidate(url, bytes) {
  if (!/\.png$/i.test(url)) return false;
  if (bytes && (bytes < 8_000 || bytes > 35_000)) return false;
  return /particip|audienc|taller|ruos|mesa|volunt|vecin|icon|line|verde/i.test(
    url,
  );
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "MuniMol-Frontend-Scraper/1.0" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fetchPageBySlug(slug) {
  const data = await fetchJson(`${WP}?slug=${encodeURIComponent(slug)}`);
  if (!Array.isArray(data) || data.length === 0) return null;
  return data[0];
}

async function downloadFile(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
    return fs.statSync(dest).size;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url, {
    headers: { "User-Agent": "MuniMol-Frontend-Scraper/1.0" },
  });
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function extractImages(html) {
  const urls = new Set();
  const re =
    /(?:src|data-src|data-lazy-src|data-full-url)=["']([^"']+\.(?:jpe?g|png|webp|gif))(?:\?[^"']*)?["']/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = absUrl(m[1]);
    if (!raw || !raw.includes("munimolina")) continue;
    const full = preferFullSize(raw.split("?")[0]);
    if (isJunkImage(full) && !/-\d+x\d+\./.test(raw)) {
      // keep non-sized junk check already filtered full
    }
    if (isJunkImage(full)) continue;
    urls.add(full);
  }
  // also catch background / href to images
  const re2 =
    /https:\/\/portal\.munimolina\.gob\.pe\/wp-content\/uploads\/[^"'\\\s>]+\.(?:jpe?g|png|webp|gif)/gi;
  while ((m = re2.exec(html))) {
    const full = preferFullSize(m[0].split("?")[0]);
    if (!isJunkImage(full)) urls.add(full);
  }
  return [...urls];
}

function extractDocs(html) {
  const urls = new Set();
  const re =
    /href=["'](https:\/\/portal\.munimolina\.gob\.pe\/wp-content\/uploads\/[^"']+\.(?:pdf|docx?|xlsx?|pptx?))["']/gi;
  let m;
  while ((m = re.exec(html))) urls.add(m[1]);
  return [...urls];
}

function extractHeadings(html) {
  const out = [];
  const re = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html))) {
    const text = stripTags(m[2]).replace(/\n/g, " ").trim();
    if (!text || text.length < 3 || NOISE.test(text)) continue;
    if (TAB_LABELS.some((t) => text.toUpperCase().includes(t) && text.length < 40))
      continue;
    out.push({ level: Number(m[1]), text });
  }
  return out;
}

function extractParagraphs(html) {
  const out = [];
  const re = /<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const text = stripTags(m[1]).replace(/\n/g, " ").trim();
    if (!text || text.length < 40) continue;
    if (NOISE.test(text)) continue;
    if (/PARTICIPACIÓN VECINAL|AUDIENCIAS VECINALES|TALLERES DE CAPACITACIÓN/.test(text) && text.length < 200)
      continue;
    out.push(text);
  }
  // dedupe consecutive
  return out.filter((t, i, arr) => arr.indexOf(t) === i);
}

function extractTables(html) {
  const tables = [];
  const re = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let m;
  while ((m = re.exec(html))) {
    const rows = [];
    const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rm;
    while ((rm = rowRe.exec(m[1]))) {
      const cells = [];
      const cellRe = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
      let cm;
      while ((cm = cellRe.exec(rm[1]))) {
        cells.push(stripTags(cm[1]).replace(/\n/g, " ").trim());
      }
      if (cells.some((c) => c)) rows.push(cells);
    }
    if (rows.length >= 2) tables.push({ rows });
  }
  return tables;
}

function extractSections(html) {
  // Split by h2/h3 and attach following paragraphs until next heading
  const parts = html.split(/(?=<h[23][^>]*>)/i);
  const sections = [];
  for (const part of parts) {
    const hm = part.match(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/i);
    if (!hm) continue;
    const title = stripTags(hm[2]).replace(/\n/g, " ").trim();
    if (!title || NOISE.test(title) || title.length < 3) continue;
    if (TAB_LABELS.includes(title.toUpperCase())) continue;
    const bodyHtml = part.slice(hm[0].length);
    const paragraphs = extractParagraphs(bodyHtml).slice(0, 12);
    const lists = [];
    const ulRe = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
    let um;
    while ((um = ulRe.exec(bodyHtml))) {
      const items = [];
      const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let lm;
      while ((lm = liRe.exec(um[1]))) {
        const t = stripTags(lm[1]).replace(/\n/g, " ").trim();
        if (t && t.length > 5 && !NOISE.test(t)) items.push(t);
      }
      if (items.length) lists.push(items);
    }
    const tables = extractTables(bodyHtml);
    if (paragraphs.length || lists.length || tables.length) {
      sections.push({ title, paragraphs, lists, tables });
    }
  }
  return sections;
}

function extFromUrl(url) {
  const m = url.toLowerCase().match(/\.(jpe?g|png|webp|gif|pdf|docx?|xlsx?|pptx?)(?:$|\?)/);
  return m ? m[1].replace("jpeg", "jpg") : "bin";
}

function safeName(slug, index, ext) {
  return `${slug}-${String(index).padStart(2, "0")}.${ext}`;
}

async function processPage(meta, categorySlug) {
  const page = await fetchPageBySlug(meta.pageSlug);
  if (!page) {
    console.warn(`  MISSING page ${meta.pageSlug}`);
    return {
      serviceSlug: meta.serviceSlug,
      pageSlug: meta.pageSlug,
      missing: true,
      title: meta.titleFallback || meta.serviceSlug,
      sourceUrl: `${BASE}/${meta.pageSlug}/`,
      paragraphs: [],
      headings: [],
      sections: [],
      images: [],
      documents: [],
      tables: [],
    };
  }

  const html = page.content?.rendered || "";
  const title =
    meta.titleFallback ||
    decodeHtml(page.title?.rendered || meta.serviceSlug);
  const sourceUrl = page.link || `${BASE}/${meta.pageSlug}/`;

  const remoteImages = extractImages(html);
  const remoteDocs = extractDocs(html);
  const headings = extractHeadings(html);
  const paragraphs = extractParagraphs(html);
  const tables = extractTables(html);
  const sections = extractSections(html);

  const localImages = [];
  let imgIndex = 1;
  for (const url of remoteImages) {
    const ext = extFromUrl(url);
    const file = safeName(meta.serviceSlug, imgIndex, ext);
    const dest = path.join(IMG_ROOT, categorySlug, file);
    try {
      const size = await downloadFile(url, dest);
      // skip tiny icons in galleries (keep separately for tabs)
      if (size < 12_000 && ext === "png") {
        const tabDest = path.join(TAB_ROOT, `${meta.serviceSlug}.png`);
        if (!fs.existsSync(tabDest) || fs.statSync(tabDest).size < size) {
          fs.mkdirSync(TAB_ROOT, { recursive: true });
          fs.copyFileSync(dest, tabDest);
        }
        // still keep if unique enough for icon row
        localImages.push({
          url: `/images/muniservicios/detalle/${categorySlug}/${file}`,
          sourceUrl: url,
          bytes: size,
          kind: "icon",
        });
      } else {
        localImages.push({
          url: `/images/muniservicios/detalle/${categorySlug}/${file}`,
          sourceUrl: url,
          bytes: size,
          kind: size < 40_000 ? "graphic" : "photo",
        });
      }
      imgIndex += 1;
    } catch (e) {
      console.warn(`  img fail ${url}: ${e.message}`);
    }
  }

  const localDocs = [];
  let docIndex = 1;
  for (const url of remoteDocs) {
    const ext = extFromUrl(url);
    const base = path.basename(url).split("?")[0];
    const file = `${meta.serviceSlug}-${docIndex}-${base}`.replace(
      /[^a-zA-Z0-9._-]/g,
      "-",
    );
    const dest = path.join(DOC_ROOT, categorySlug, file);
    try {
      await downloadFile(url, dest);
      localDocs.push({
        url: `/documents/muniservicios/${categorySlug}/${file}`,
        sourceUrl: url,
        label: decodeHtml(base.replace(/[-_]/g, " ").replace(/\.[^.]+$/, "")),
      });
      docIndex += 1;
    } catch (e) {
      console.warn(`  doc fail ${url}: ${e.message}`);
    }
  }

  // Hub tab icons: from content-vecinos style pages, icons often link next to labels
  // Extract icon+label pairs from hub separately later

  return {
    serviceSlug: meta.serviceSlug,
    pageSlug: meta.pageSlug,
    title,
    sourceUrl,
    headings,
    paragraphs,
    sections,
    tables,
    images: localImages,
    documents: localDocs,
  };
}

async function processHub(categorySlug, hubSlug) {
  if (!hubSlug) return null;
  const page = await fetchPageBySlug(hubSlug);
  if (!page) return null;
  const html = page.content?.rendered || "";

  // Extract tab nav: <a href="..."><img ...> LABEL</a> patterns loosely
  const tabs = [];
  const aRe =
    /<a[^>]+href=["']([^"']+)["'][^>]*>[\s\S]*?(?:<img[^>]+src=["']([^"']+)["'][^>]*>)?[\s\S]*?<\/a>/gi;
  let m;
  const seen = new Set();
  while ((m = aRe.exec(html))) {
    const href = absUrl(m[1]);
    if (!href || !href.includes("munimolina")) continue;
    const slug = href
      .replace(BASE, "")
      .replace(/^\/+|\/+$/g, "")
      .split("/")[0];
    if (!slug || seen.has(slug) || /servicios-para-el-vecino|wp-|categoria/.test(slug))
      continue;
    const chunk = m[0];
    const label = stripTags(chunk).replace(/\n/g, " ").trim().toUpperCase();
    if (!label || label.length > 60) continue;
    // Prefer known tab-like short labels
    const img = m[2] ? preferFullSize(absUrl(m[2]).split("?")[0]) : null;
    if (img && !isJunkImage(img)) {
      const ext = extFromUrl(img);
      const dest = path.join(TAB_ROOT, `${slug}.${ext}`);
      try {
        await downloadFile(img, dest);
        tabs.push({
          pageSlug: slug,
          label,
          iconUrl: `/images/muniservicios/tabs/${slug}.${ext}`,
        });
        seen.add(slug);
      } catch {
        /* ignore */
      }
    } else if (TAB_LABELS.some((t) => label.includes(t.slice(0, 12)))) {
      tabs.push({ pageSlug: slug, label, iconUrl: null });
      seen.add(slug);
    }
  }

  const remoteImages = extractImages(html).slice(0, 8);
  const gallery = [];
  let i = 1;
  for (const url of remoteImages) {
    const ext = extFromUrl(url);
    const file = `hub-${i}.${ext}`;
    const dest = path.join(IMG_ROOT, categorySlug, file);
    try {
      const size = await downloadFile(url, dest);
      if (size > 20_000) {
        gallery.push(`/images/muniservicios/detalle/${categorySlug}/${file}`);
        i += 1;
      }
    } catch {
      /* ignore */
    }
  }

  return {
    hubSlug,
    sourceUrl: page.link,
    title: decodeHtml(page.title?.rendered || hubSlug),
    tabs,
    gallery,
  };
}

async function main() {
  fs.mkdirSync(IMG_ROOT, { recursive: true });
  fs.mkdirSync(TAB_ROOT, { recursive: true });
  fs.mkdirSync(DOC_ROOT, { recursive: true });

  const result = {
    scrapedAt: new Date().toISOString(),
    source: BASE,
    categories: {},
  };

  for (const [categorySlug, cfg] of Object.entries(CATALOG)) {
    console.log(`\n=== ${categorySlug} ===`);
    let hub = null;
    try {
      hub = await processHub(categorySlug, cfg.hubSlug);
    } catch (e) {
      console.warn(`hub fail: ${e.message}`);
    }

    const services = [];
    for (const meta of cfg.pages) {
      console.log(`  -> ${meta.pageSlug}`);
      try {
        const item = await processPage(meta, categorySlug);
        services.push(item);
        console.log(
          `     paras=${item.paragraphs.length} imgs=${item.images.length} docs=${item.documents.length} sections=${item.sections.length}`,
        );
      } catch (e) {
        console.warn(`  FAIL ${meta.pageSlug}: ${e.message}`);
        services.push({
          serviceSlug: meta.serviceSlug,
          pageSlug: meta.pageSlug,
          missing: true,
          error: e.message,
          title: meta.titleFallback || meta.serviceSlug,
          paragraphs: [],
          images: [],
          documents: [],
          sections: [],
          tables: [],
          headings: [],
        });
      }
      // polite delay
      await new Promise((r) => setTimeout(r, 200));
    }

    result.categories[categorySlug] = { hub, services };
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(result, null, 2), "utf8");
  console.log(`\nWrote ${OUT_JSON}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
