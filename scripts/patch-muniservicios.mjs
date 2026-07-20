/**
 * Patch scrape: fill missing pages via HTML fetch + alternate slugs,
 * improve participación tab icons, enrich thin pages.
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

const ALTERNATES = {
  "plaza-bicentenario": ["plaza-del-bicentenario", "plaza-bicentenario-la-molina"],
  "instrumento-ambiental": [
    "instrumentos-ambientales",
    "instrumento-de-gestion-ambiental",
    "instrumentos-de-gestion-ambiental",
  ],
  "plan-local-de-seguridad-ciudadana": [
    "codisec",
    "plan-de-seguridad-ciudadana",
    "seguridad01",
    "seguridad02",
    "seguridad03",
    "seguridad04",
  ],
  "riesgo-de-desastres-defensa-civil": [
    "gestion-de-riesgos-y-desastres-de-la-molina",
    "defensa-civil",
  ],
  molistreet: ["molistreetfit", "moli-street-fit", "recreacion01", "recreacion02"],
  molifitness: ["moli-fitness", "fitness", "recreacion03", "recreacion04"],
  "seguridad-y-salud-en-el-trabajo": ["seguridad-salud-en-el-trabajo", "sgsst"],
  "organizacion-del-sg-sst": ["organizacion-del-sgsst", "organizacion-sgsst"],
};

const TAB_ICON_MAP = {
  "participacion-vecinal": "participacion-vecinal.png",
  "audiencias-vecinales": "audiencias-vecinales.png",
  "talleres-capacitacion": "talleres-capacitacion.png",
  ruos: "ruos.png",
  "mesas-concertacion": "mesas-concertacion.png",
  voluntariado: "voluntariado.png",
};

function decodeHtml(s) {
  return s
    .replace(/&#8211;/g, "–")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8217;/g, "'")
    .replace(/&#038;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
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

const NOISE =
  /canal de denuncias|portal del usuario|pagos tributarios|clasificaci[oó]n aa|transmisi[oó]n en vivo|sesi[oó]n solemne|cont[aá]ctanos|te encuentras|servicios municipales\s*>|men[uú]|search|close|previous|next|av\.\s*ricardo el[ií]as|lunes a viernes de 8|proyectos y anexos foliados/i;

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
  return /cropped-frame|favicon|logo-app|tupa2|captura-de-pantalla-2025-03-10|whatsapp-image|gravatar|emoji|wp-includes|dummy|placeholder/i.test(
    u,
  );
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
    if (isJunkImage(full)) continue;
    if (/-\d+x\d+\./i.test(raw) && !/-\d+x\d+\./i.test(full)) {
      urls.add(full);
    } else if (!/-\d+x\d+\./i.test(full)) {
      urls.add(full);
    }
  }
  const re2 =
    /https:\/\/portal\.munimolina\.gob\.pe\/wp-content\/uploads\/[^"'\\\s>]+\.(?:jpe?g|png|webp|gif)/gi;
  while ((m = re2.exec(html))) {
    const full = preferFullSize(m[0].split("?")[0]);
    if (!isJunkImage(full) && !/-\d+x\d+\./i.test(full)) urls.add(full);
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

function extractParagraphs(html) {
  const out = [];
  const re = /<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const text = stripTags(m[1]).replace(/\n/g, " ").trim();
    if (!text || text.length < 40 || NOISE.test(text)) continue;
    if (
      /PARTICIPACIÓN VECINAL|AUDIENCIAS VECINALES|TALLERES DE CAPACITACIÓN/.test(
        text,
      ) &&
      text.length < 200
    )
      continue;
    out.push(text);
  }
  return out.filter((t, i, arr) => arr.indexOf(t) === i);
}

function extractHeadings(html) {
  const out = [];
  const re = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html))) {
    const text = stripTags(m[2]).replace(/\n/g, " ").trim();
    if (!text || text.length < 3 || NOISE.test(text)) continue;
    out.push({ level: Number(m[1]), text });
  }
  return out;
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
  const parts = html.split(/(?=<h[23][^>]*>)/i);
  const sections = [];
  for (const part of parts) {
    const hm = part.match(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/i);
    if (!hm) continue;
    const title = stripTags(hm[2]).replace(/\n/g, " ").trim();
    if (!title || NOISE.test(title) || title.length < 3) continue;
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
  const m = url
    .toLowerCase()
    .match(/\.(jpe?g|png|webp|gif|pdf|docx?|xlsx?|pptx?)(?:$|\?)/);
  return m ? m[1].replace("jpeg", "jpg") : "bin";
}

async function downloadFile(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
    return fs.statSync(dest).size;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url, {
    headers: { "User-Agent": "MuniMol-Frontend-Scraper/1.0" },
  });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function fetchWp(slug) {
  const res = await fetch(`${WP}?slug=${encodeURIComponent(slug)}`, {
    headers: { "User-Agent": "MuniMol-Frontend-Scraper/1.0" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) && data[0] ? data[0] : null;
}

async function fetchHtml(pathOrUrl) {
  const url = pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${BASE}/${pathOrUrl.replace(/^\/+|\/+$/g, "")}/`;
  const res = await fetch(url, {
    headers: { "User-Agent": "MuniMol-Frontend-Scraper/1.0" },
    redirect: "follow",
  });
  if (!res.ok) return null;
  const html = await res.text();
  return { url: res.url, html };
}

async function searchWp(term) {
  const res = await fetch(
    `${WP}?search=${encodeURIComponent(term)}&per_page=10`,
    { headers: { "User-Agent": "MuniMol-Frontend-Scraper/1.0" } },
  );
  if (!res.ok) return [];
  return res.json();
}

async function materializeContent({
  categorySlug,
  serviceSlug,
  pageSlug,
  title,
  sourceUrl,
  html,
}) {
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
    const file = `${serviceSlug}-${String(imgIndex).padStart(2, "0")}.${ext}`;
    const dest = path.join(IMG_ROOT, categorySlug, file);
    try {
      const size = await downloadFile(url, dest);
      localImages.push({
        url: `/images/muniservicios/detalle/${categorySlug}/${file}`,
        sourceUrl: url,
        bytes: size,
        kind: size < 12_000 && ext === "png" ? "icon" : size < 40_000 ? "graphic" : "photo",
      });
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
    const file = `${serviceSlug}-${docIndex}-${base}`.replace(
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

  return {
    serviceSlug,
    pageSlug,
    title,
    sourceUrl,
    missing: false,
    headings,
    paragraphs,
    sections,
    tables,
    images: localImages,
    documents: localDocs,
  };
}

async function resolveMissing(categorySlug, service) {
  const tried = new Set([service.pageSlug]);
  const candidates = [
    service.pageSlug,
    ...(ALTERNATES[service.pageSlug] || []),
  ];

  for (const slug of candidates) {
    if (!slug || tried.has(`wp:${slug}`)) continue;
    tried.add(`wp:${slug}`);
    const page = await fetchWp(slug);
    if (page) {
      console.log(`  resolved WP ${service.serviceSlug} <- ${slug}`);
      return materializeContent({
        categorySlug,
        serviceSlug: service.serviceSlug,
        pageSlug: slug,
        title: decodeHtml(page.title?.rendered || service.title),
        sourceUrl: page.link,
        html: page.content?.rendered || "",
      });
    }
  }

  // HTML fallback for known URLs
  for (const slug of candidates) {
    if (!slug || tried.has(`html:${slug}`)) continue;
    tried.add(`html:${slug}`);
    const hit = await fetchHtml(slug);
    if (!hit) continue;
    // Detect soft 404 / empty
    if (hit.html.length < 5000) continue;
    if (/página no encontrada|page not found|error 404/i.test(hit.html)) continue;
    console.log(`  resolved HTML ${service.serviceSlug} <- ${hit.url}`);
    const titleMatch = hit.html.match(/<title>([^<]+)<\/title>/i);
    return materializeContent({
      categorySlug,
      serviceSlug: service.serviceSlug,
      pageSlug: slug,
      title: titleMatch
        ? decodeHtml(titleMatch[1].split("»")[0].split("&raquo;")[0])
        : service.title,
      sourceUrl: hit.url,
      html: hit.html,
    });
  }

  // Search by service title words
  const q = (service.title || service.serviceSlug).split(/\s+/).slice(0, 3).join(" ");
  const results = await searchWp(q);
  for (const page of results) {
    const slug = page.slug;
    if (tried.has(`wp:${slug}`)) continue;
    console.log(`  search hit ${service.serviceSlug} <- ${slug}`);
    return materializeContent({
      categorySlug,
      serviceSlug: service.serviceSlug,
      pageSlug: slug,
      title: decodeHtml(page.title?.rendered || service.title),
      sourceUrl: page.link,
      html: page.content?.rendered || "",
    });
  }

  return null;
}

async function enrichThin(categorySlug, service) {
  // Re-fetch if almost empty content but page exists
  if (service.missing) return null;
  const thin =
    (service.paragraphs?.length || 0) < 2 &&
    (service.sections?.length || 0) <= 1 &&
    (service.images?.length || 0) <= 2;
  if (!thin) return null;

  const htmlHit = await fetchHtml(service.pageSlug);
  if (!htmlHit) return null;
  const enriched = await materializeContent({
    categorySlug,
    serviceSlug: service.serviceSlug,
    pageSlug: service.pageSlug,
    title: service.title,
    sourceUrl: service.sourceUrl || htmlHit.url,
    html: htmlHit.html,
  });
  if (
    enriched.paragraphs.length > (service.paragraphs?.length || 0) ||
    enriched.images.length > (service.images?.length || 0) ||
    enriched.tables.length > (service.tables?.length || 0)
  ) {
    console.log(
      `  enriched ${service.serviceSlug}: paras ${service.paragraphs?.length || 0}->${enriched.paragraphs.length} imgs ${service.images?.length || 0}->${enriched.images.length}`,
    );
    return enriched;
  }
  return null;
}

async function scrapeHubTabs(hubSlug) {
  const hit = await fetchHtml(hubSlug);
  if (!hit) return [];
  const tabs = [];
  const re =
    /<a[^>]+href=["']([^"']+)["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi;
  let m;
  const seen = new Set();
  while ((m = re.exec(hit.html))) {
    const href = absUrl(m[1]);
    const img = preferFullSize(absUrl(m[2]).split("?")[0]);
    if (!href || !img || isJunkImage(img)) continue;
    const slug = href
      .replace(BASE, "")
      .replace(/^\/+|\/+$/g, "")
      .split("/")[0];
    if (!slug || seen.has(slug) || /servicios-para-el-vecino|wp-/.test(slug))
      continue;
    const label = stripTags(m[0]).replace(/\n/g, " ").trim().toUpperCase();
    if (!label || label.length > 80) continue;
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
  }
  return tabs;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(OUT_JSON, "utf8"));

  // Ensure participación tab icons exist and are wired
  for (const [serviceSlug, file] of Object.entries(TAB_ICON_MAP)) {
    const src = path.join(TAB_ROOT, file);
    if (!fs.existsSync(src)) {
      console.warn(`missing tab icon ${file}`);
    }
  }

  if (data.categories["participacion-vecinal"]?.hub) {
    const hub = data.categories["participacion-vecinal"].hub;
    const htmlTabs = await scrapeHubTabs("contenido-vecinos");
    if (htmlTabs.length) {
      hub.tabs = htmlTabs;
      console.log(`hub tabs refreshed: ${htmlTabs.length}`);
    } else if (hub.tabs) {
      for (const tab of hub.tabs) {
        const map = {
          "participacion-vecinal": "participacion-vecinal.png",
          "audiencias-vecinales": "audiencias-vecinales.png",
          "talleres-de-capacitacion": "talleres-capacitacion.png",
          ruos: "ruos.png",
          "mesas-de-concertacion-municipal": "mesas-concertacion.png",
          "gesion-de-voluntariado": "voluntariado.png",
        };
        const file = map[tab.pageSlug];
        if (file && fs.existsSync(path.join(TAB_ROOT, file))) {
          tab.iconUrl = `/images/muniservicios/tabs/${file}`;
        }
      }
    }
  }

  // Also scrape tabs for other hubs
  const hubMap = {
    "desarrollo-social-educacion-cultura": "contenido-educacion",
    "desarrollo-sostenible": "contenido-molina-verde",
    "movilidad-sostenible": "contenido-movilidad-sostenible",
    "seguridad-ciudadana": "contenido-seguridad",
    "programas-sociales": "contenido-servicios-para-el-vecino",
    "emprendimientos-negocios": "molinaemprende",
    recreacion: "contenido-recreacion",
    obras: "contenido-obras",
    "gestion-riesgo-desastres": "contenido-riesgo-de-desastres",
  };

  for (const [cat, hubSlug] of Object.entries(hubMap)) {
    if (!data.categories[cat]) continue;
    const tabs = await scrapeHubTabs(hubSlug);
    if (tabs.length) {
      data.categories[cat].hub = data.categories[cat].hub || {
        hubSlug,
        sourceUrl: `${BASE}/${hubSlug}/`,
        title: hubSlug,
        gallery: [],
      };
      data.categories[cat].hub.tabs = tabs;
      console.log(`${cat} tabs: ${tabs.length}`);
    }
  }

  for (const [categorySlug, cat] of Object.entries(data.categories)) {
    console.log(`\n=== patch ${categorySlug} ===`);
    for (let i = 0; i < cat.services.length; i++) {
      const service = cat.services[i];
      if (service.missing) {
        const fixed = await resolveMissing(categorySlug, service);
        if (fixed) cat.services[i] = fixed;
        else console.warn(`  still missing ${service.serviceSlug}`);
      } else {
        const enriched = await enrichThin(categorySlug, service);
        if (enriched) cat.services[i] = enriched;
      }

      // Wire known participación icons onto services
      const iconFile = TAB_ICON_MAP[service.serviceSlug];
      if (iconFile && fs.existsSync(path.join(TAB_ROOT, iconFile))) {
        const iconUrl = `/images/muniservicios/tabs/${iconFile}`;
        const imgs = cat.services[i].images || [];
        if (!imgs.some((im) => im.url === iconUrl)) {
          imgs.unshift({
            url: iconUrl,
            sourceUrl: iconUrl,
            bytes: fs.statSync(path.join(TAB_ROOT, iconFile)).size,
            kind: "icon",
          });
          cat.services[i].images = imgs;
        }
      }
      await new Promise((r) => setTimeout(r, 150));
    }
  }

  // Manual content for mesas/voluntariado if still empty (from prior web scrape)
  const part = data.categories["participacion-vecinal"];
  if (part) {
    const mesas = part.services.find((s) => s.serviceSlug === "mesas-concertacion");
    if (mesas && (!mesas.paragraphs || mesas.paragraphs.length === 0)) {
      mesas.paragraphs = [
        "Las Mesas de Concertación Municipal son espacios de participación vecinal institucionalizados para facilitar el diálogo directo entre los vecinos, el alcalde y los funcionarios municipales.",
        "Su objetivo es atender consultas, reclamos y solicitudes, permitiendo la búsqueda conjunta de soluciones a problemáticas del distrito.",
        "Contacto: Gerencia de Participación Vecinal · Teléfono: (01) 754-4000 Anexo: 367 / 251 · Correo: participacionvecinal@munimolina.gob.pe",
      ];
      mesas.missing = false;
      mesas.title = "Mesas de Concertación Municipal";
    }
    const vol = part.services.find((s) => s.serviceSlug === "voluntariado");
    if (vol && (!vol.paragraphs || vol.paragraphs.length === 0)) {
      vol.paragraphs = [
        "La Red de Voluntariado de la Municipalidad de La Molina es un espacio de participación vecinal y de trabajo conjunto, integrado por grupos de ciudadanos y organizaciones sin fines de lucro, altruistas y solidarias, con el objetivo de realizar actividades de bien común para la población del distrito.",
        "Desarrolla actividades asistenciales, de servicios sociales, cívicas, de cooperación al desarrollo, de defensa del medio ambiente, de promoción de la cultura, el deporte y la educación, entre otras de naturaleza análoga.",
        "Parte del modelo innovador de voluntariado distrital ha implicado la gestión del voluntariado profesional, conformado por vecinos de distintas especialidades y experiencia en distintos sectores económicos, fortaleciendo capacidades locales de forma gratuita en temas asociados al emprendimiento y la gestión de negocios.",
        "Contacto: Gerencia de Participación Vecinal · Telf: (01) 313-4444 anexos 367 / 251 · Correo: participacionvecinal@munimolina.gob.pe",
      ];
      vol.missing = false;
      vol.title = "Gestión de Voluntariado";
    }
  }

  data.patchedAt = new Date().toISOString();
  fs.writeFileSync(OUT_JSON, JSON.stringify(data, null, 2), "utf8");
  console.log(`\nPatched ${OUT_JSON}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
