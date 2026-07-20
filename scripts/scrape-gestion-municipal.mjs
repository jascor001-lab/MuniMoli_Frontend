/**
 * Scrapes Gestión Municipal hub + detail pages from portal.munimolina.gob.pe,
 * downloads images locally, extracts tables/people/sections, writes JSON.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE = "https://portal.munimolina.gob.pe";
const WP = `${BASE}/wp-json/wp/v2/pages`;
const OUT_JSON = path.join(ROOT, "src/data/gestion-municipal-data.json");
const IMG_ROOT = path.join(ROOT, "public/images/gestion-municipal");
const DOC_ROOT = path.join(ROOT, "public/documents/gestion-municipal");

const SECTIONS = [
  {
    slug: "alcalde",
    title: "Alcalde",
    pageSlug: "alcalde-nuevo",
    summary:
      "Al iniciar este periodo de gobierno municipal, junto con mi Concejo de Regidores, e inspirados por un fuerte sentimiento de amor por el Perú…",
  },
  {
    slug: "vision-y-objetivos",
    title: "Visión y Objetivos Estratégicos",
    pageSlug: "vision-y-objetivos-estrategicos",
    summary:
      'La visión compartida del desarrollo distrital de La Molina para el largo plazo (2017 - 2030) es: "El ciudadano de La Molina, al año 2030, vive en una ciudad…"',
  },
  {
    slug: "concejo-municipal",
    title: "Concejo Municipal",
    pageSlug: "concejo-municipal-nuevo",
    summary:
      "El Concejo Municipal está integrado por el Alcalde quien lo preside y por los Regidores.",
  },
  {
    slug: "estructura-organica",
    title: "Estructura Orgánica",
    pageSlug: "composicion",
    summary:
      "La Estructura Orgánica de la Municipalidad Distrital de La Molina es la siguiente:",
  },
  {
    slug: "comisiones",
    title: "Comisiones",
    pageSlug: "comisiones",
    summary:
      "Órganos consultivos del Concejo Municipal que tienen como finalidad realizar estudios e investigaciones en relación a la conformación de sus competencias.",
  },
  {
    slug: "funcionarios",
    title: "Funcionarios",
    pageSlug: "funcionarios-actuales",
    summary: "Listado de nuestros funcionarios.",
  },
  {
    slug: "reconocimientos",
    title: "Reconocimientos",
    pageSlug: "reconocimientos",
    summary:
      "Reconocimientos nacionales e internacionales que evidencian un modelo de gestión municipal orientado a mejorar la calidad de los servicios, a través de buenas prácticas organizacionales.",
  },
];

const NOISE =
  /canal de denuncias|portal del usuario|pagos tributarios|clasificaci[oó]n aa|gobierno digital|transmisi[oó]n en vivo|te encuentras|cont[aá]ctanos|leer m[aá]s|av\.\s*ricardo|lunes a viernes de 8|search|close|men[uú]/i;

function decodeHtml(s) {
  return String(s || "")
    .replace(/&#8230;/g, "…")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#038;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCharCode(parseInt(h, 16)),
    );
}

function stripTags(html) {
  return decodeHtml(
    String(html || "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\n+/g, "\n")
      .replace(/[ \t]+/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
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
  return /cropped-frame|favicon|logo|logotop|logofooter|tupa2|captura-de-pantalla-2025-03|whatsapp|sprite|gravatar|emoji|wp-includes|dummy|placeholder|sugerencias|libro_recl|acceso_informacion|transparencia|gob\.pe_|mesapv|bolsatrabajo|molicard/i.test(
    u,
  );
}

function extFromUrl(url) {
  const m = url
    .toLowerCase()
    .match(/\.(jpe?g|png|webp|gif|pdf|docx?|xlsx?|pptx?)(?:$|\?)/);
  return m ? m[1].replace("jpeg", "jpg") : "bin";
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
  return Array.isArray(data) && data[0] ? data[0] : null;
}

async function downloadFile(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
    return fs.statSync(dest).size;
  }
  const res = await fetch(url, {
    headers: { "User-Agent": "MuniMol-Frontend-Scraper/1.0" },
  });
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function extractBestImages(html) {
  const best = new Map(); // base key -> { url, width }

  // srcset: pick largest
  const srcsetRe = /srcset=["']([^"']+)["']/gi;
  let m;
  while ((m = srcsetRe.exec(html))) {
    const parts = m[1].split(",").map((p) => p.trim());
    for (const part of parts) {
      const pm = part.match(/(\S+)\s+(\d+)w/);
      if (!pm) continue;
      const url = absUrl(pm[1].split("?")[0]);
      if (!url || !url.includes("munimolina") || isJunkImage(url)) continue;
      const width = Number(pm[2]);
      const key = preferFullSize(url);
      const prev = best.get(key);
      if (!prev || width > prev.width) best.set(key, { url, width });
    }
  }

  // plain src
  const srcRe =
    /(?:src|data-src|data-lazy-src|data-full-url)=["']([^"']+\.(?:jpe?g|png|webp|gif))(?:\?[^"']*)?["']/gi;
  while ((m = srcRe.exec(html))) {
    const url = absUrl(m[1].split("?")[0]);
    if (!url || !url.includes("munimolina") || isJunkImage(url)) continue;
    const key = preferFullSize(url);
    if (!best.has(key)) best.set(key, { url, width: 0 });
  }

  // Prefer non-thumb when available: try full-size path
  return [...best.values()].map((v) => {
    const full = preferFullSize(v.url);
    // Keep elementor thumbs as-is (full path may 404)
    if (v.url.includes("/elementor/thumbs/")) return v.url;
    return full;
  });
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
    const text = stripTags(m[1]);
    if (!text || text.length < 25) continue;
    if (NOISE.test(text)) continue;
    if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(text)) continue;
    out.push(text);
  }
  return out.filter((t, i, arr) => arr.indexOf(t) === i);
}

function extractHeadings(html) {
  const out = [];
  const re =
    /<(?:h[1-6]|p)[^>]*class="[^"]*elementor-heading-title[^"]*"[^>]*>([\s\S]*?)<\/(?:h[1-6]|p)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const text = stripTags(m[1]);
    if (!text || text.length < 2 || NOISE.test(text)) continue;
    out.push(text);
  }
  // also plain h2/h3
  const re2 = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
  while ((m = re2.exec(html))) {
    const text = stripTags(m[2]);
    if (!text || text.length < 2 || NOISE.test(text)) continue;
    if (!out.includes(text)) out.push(text);
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
        cells.push(stripTags(cm[1]));
      }
      if (cells.some((c) => c)) rows.push(cells);
    }
    if (rows.length >= 2) {
      tables.push({
        headers: rows[0],
        rows: rows.slice(1),
      });
    }
  }
  return tables;
}

function extractPeople(html) {
  const text = stripTags(html);
  const people = [];
  const re =
    /(Regidor[a]?)\s+([A-ZÁÉÍÓÚÑÜ][\p{L}\s.]+?)\s+([a-z0-9._%+-]+@munimolina\.gob\.pe)/giu;
  let m;
  while ((m = re.exec(text))) {
    people.push({
      role: m[1],
      name: m[2].replace(/\s+/g, " ").trim(),
      email: m[3].toLowerCase(),
    });
  }
  return people;
}

function extractCommissions(html) {
  const text = stripTags(html.replace(/<br\s*\/?>/gi, "\n"));
  // Split by "Comisión de"
  const parts = text.split(/(?=Comisi[oó]n de )/i).filter(Boolean);
  const commissions = [];
  for (const part of parts) {
    if (!/^Comisi[oó]n de /i.test(part)) continue;
    const titleMatch = part.match(/^(Comisi[oó]n de .+?)(?=\s+Presidente\s*:)/i);
    const title = titleMatch
      ? titleMatch[1].trim()
      : part.split(/\s+Presidente/i)[0].trim();
    const presidente = (part.match(/Presidente\s*:\s*([^.]+)\./i) || [])[1]?.trim();
    const vicepresidente = (part.match(/Vicepresidente\s*:\s*([^.]+)\./i) ||
      [])[1]?.trim();
    const miembros = [];
    const memberRe = /Miembro\s*:\s*([^.]+)\./gi;
    let mm;
    while ((mm = memberRe.exec(part))) {
      miembros.push(mm[1].trim());
    }
    if (title) {
      commissions.push({ title, presidente, vicepresidente, miembros });
    }
  }
  return commissions;
}

function extractOrgStructure(html) {
  const raw = decodeHtml(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<[^>]+>/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ");

  const lines = raw
    .split("\n")
    .map((l) => l.replace(/^[?\s]+/, "").trim())
    .filter((l) => l && l.length > 2 && !NOISE.test(l));

  const sections = [];
  let current = null;
  const sectionStarts =
    /^(Órgano|Organos|Órganos|Administraci[oó]n Interna|Órganos de L[ií]nea)/i;

  for (const line of lines) {
    if (/^Estructura Org[aá]nica$/i.test(line)) continue;
    if (sectionStarts.test(line) && !line.startsWith("•")) {
      current = { title: line.replace(/^•\s*/, ""), items: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      current = { title: "Estructura", items: [] };
      sections.push(current);
    }
    const clean = line.replace(/^•\s*/, "").trim();
    if (clean && !current.items.includes(clean) && clean !== current.title) {
      current.items.push(clean);
    }
  }
  return sections.filter((s) => s.items.length > 0 || /Órgano|Gerencia/i.test(s.title));
}

function extractRecognitionBlocks(html) {
  const blocks = [];
  const parts = html.split(/(?=<h[23][^>]*>)/i);
  for (const part of parts) {
    const hm = part.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i);
    if (!hm) continue;
    const title = stripTags(hm[1]);
    if (!title || /^Reconocimientos$/i.test(title)) continue;
    const paragraphs = extractParagraphs(part);
    const images = extractBestImages(part);
    blocks.push({ title, paragraphs, images });
  }
  return blocks;
}

async function downloadImages(urls, folder, prefix) {
  const local = [];
  let i = 1;
  for (const url of urls) {
    const ext = extFromUrl(url);
    const file = `${prefix}-${String(i).padStart(2, "0")}.${ext}`;
    const dest = path.join(IMG_ROOT, folder, file);
    try {
      // Try full-size first; fall back to original URL
      let used = url;
      let bytes;
      try {
        bytes = await downloadFile(url, dest);
      } catch {
        if (url !== preferFullSize(url)) throw new Error("fail");
        // if we already preferred full and failed, try nothing
        throw new Error("fail");
      }
      // If preferFullSize changed URL and file is tiny/missing, retry original — handled above
      local.push({
        url: `/images/gestion-municipal/${folder}/${file}`,
        sourceUrl: used,
        bytes,
      });
      i += 1;
    } catch (e) {
      // try original sized URL if full failed
      try {
        const sized = url.includes("-") ? url : null;
        if (!sized) throw e;
      } catch {
        console.warn(`  img fail ${url}: ${e.message}`);
      }
    }
  }
  return local;
}

async function downloadImagesSmart(urls, folder, prefix) {
  const local = [];
  let i = 1;
  for (const url of urls) {
    const candidates = [];
    const full = preferFullSize(url);
    if (full !== url) candidates.push(full);
    candidates.push(url);

    let saved = null;
    for (const candidate of candidates) {
      const ext = extFromUrl(candidate);
      const file = `${prefix}-${String(i).padStart(2, "0")}.${ext}`;
      const dest = path.join(IMG_ROOT, folder, file);
      try {
        const bytes = await downloadFile(candidate, dest);
        saved = {
          url: `/images/gestion-municipal/${folder}/${file}`,
          sourceUrl: candidate,
          bytes,
        };
        break;
      } catch {
        // try next
      }
    }
    if (saved) {
      local.push(saved);
      i += 1;
    } else {
      console.warn(`  img fail ${url}`);
    }
  }
  return local;
}

async function processSection(meta) {
  console.log(`Section / ${meta.slug}`);
  const page = await fetchPageBySlug(meta.pageSlug);
  if (!page) {
    console.warn(`  MISSING ${meta.pageSlug}`);
    return {
      slug: meta.slug,
      title: meta.title,
      summary: meta.summary,
      sourceUrl: `${BASE}/${meta.pageSlug}/`,
      missing: true,
      headings: [],
      paragraphs: [],
      images: [],
      documents: [],
      tables: [],
      people: [],
      commissions: [],
      orgStructure: [],
      recognitionBlocks: [],
    };
  }

  const html = page.content?.rendered || "";
  const headings = extractHeadings(html);
  const paragraphs = extractParagraphs(html);
  const tables = extractTables(html);
  const people = extractPeople(html);
  const commissions =
    meta.slug === "comisiones" ? extractCommissions(html) : [];
  const orgStructure =
    meta.slug === "estructura-organica" ? extractOrgStructure(html) : [];
  const recognitionBlocks =
    meta.slug === "reconocimientos" ? extractRecognitionBlocks(html) : [];

  const remoteImages = extractBestImages(html);
  // For recognition blocks, also collect their images
  for (const block of recognitionBlocks) {
    for (const img of block.images) {
      if (!remoteImages.includes(img)) remoteImages.push(img);
    }
  }

  const images = await downloadImagesSmart(remoteImages, meta.slug, meta.slug);

  // Map recognition block images to local paths
  if (recognitionBlocks.length) {
    for (const block of recognitionBlocks) {
      block.images = block.images
        .map((src) => {
          const found = images.find(
            (img) =>
              img.sourceUrl === src ||
              preferFullSize(img.sourceUrl) === preferFullSize(src) ||
              img.sourceUrl.includes(path.basename(src).slice(0, 40)),
          );
          return found?.url || null;
        })
        .filter(Boolean);
    }
  }

  // Pair people with images in order for concejo
  if (meta.slug === "concejo-municipal" && people.length && images.length) {
    people.forEach((person, idx) => {
      if (images[idx]) person.photo = images[idx].url;
    });
  }

  const docs = [];
  let di = 1;
  for (const url of extractDocs(html)) {
    const ext = extFromUrl(url);
    const base = path.basename(url).split("?")[0];
    const file = `${meta.slug}-${di}-${base}`.replace(/[^a-zA-Z0-9._-]/g, "-");
    const dest = path.join(DOC_ROOT, meta.slug, file);
    try {
      await downloadFile(url, dest);
      docs.push({
        url: `/documents/gestion-municipal/${meta.slug}/${file}`,
        sourceUrl: url,
        label: decodeHtml(base.replace(/[-_]/g, " ").replace(/\.[^.]+$/, "")),
      });
      di += 1;
    } catch (e) {
      console.warn(`  doc fail ${url}: ${e.message}`);
    }
  }

  // Alcalde structured fields
  let profile = null;
  if (meta.slug === "alcalde") {
    const name =
      headings.find((h) => /uceda|esteban/i.test(h) && !h.includes("@")) ||
      "Esteban Uceda Guerra García";
    const email =
      headings.find((h) => h.includes("@")) || "uceda@munimolina.gob.pe";
    profile = {
      name,
      role: "Alcalde",
      email,
      photo: images[0]?.url || null,
    };
  }

  return {
    slug: meta.slug,
    title: meta.title,
    summary: meta.summary,
    sourceUrl: page.link || `${BASE}/${meta.pageSlug}/`,
    headings,
    paragraphs,
    images,
    documents: docs,
    tables,
    people,
    commissions,
    orgStructure,
    recognitionBlocks,
    profile,
  };
}

async function processHub() {
  const page = await fetchPageBySlug("gestion-municipal");
  const html = page?.content?.rendered || "";
  const images = await downloadImagesSmart(
    extractBestImages(html),
    "hub",
    "hub",
  );
  return {
    title: "Gestión Municipal",
    sourceUrl: page?.link || `${BASE}/gestion-municipal/`,
    images,
  };
}

async function main() {
  console.log("Scraping hub…");
  const hub = await processHub();

  console.log("Scraping sections…");
  const sections = [];
  for (const meta of SECTIONS) {
    sections.push(await processSection(meta));
  }

  const data = {
    scrapedAt: new Date().toISOString(),
    ...hub,
    sections,
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(data, null, 2), "utf8");
  console.log(`Wrote ${OUT_JSON}`);

  const imgCount = sections.reduce((n, s) => n + s.images.length, 0) + hub.images.length;
  const docCount = sections.reduce((n, s) => n + s.documents.length, 0);
  console.log(
    `Done. ${sections.length} sections, ${imgCount} images, ${docCount} docs.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
