import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src/data/muniservicios-content.json");
const IMG = path.join(ROOT, "public/images/muniservicios/detalle");
const DOC = path.join(ROOT, "public/documents/muniservicios");
const BASE = "https://portal.munimolina.gob.pe";

function decode(s) {
  return s
    .replace(/&#8211;/g, "–")
    .replace(/&#038;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function strip(html) {
  return decode(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 500) return fs.statSync(dest).size;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(String(res.status));
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function preferFull(url) {
  return url.replace(/-\d+x\d+(?=\.(jpe?g|png|webp|gif)$)/i, "");
}

function junk(url) {
  return /cropped-frame|tupa2|Captura-de-pantalla-2025-03-10|Logo-app|favicon/i.test(url);
}

async function fetchHtml(slug) {
  const res = await fetch(`${BASE}/${slug}/`, { redirect: "follow" });
  if (!res.ok) return null;
  return { url: res.url, html: await res.text() };
}

function extractRichText(html) {
  const paragraphs = [];
  const patterns = [
    /<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/gi,
    /elementor-widget-text-editor[\s\S]{0,300}?elementor-widget-container[^>]*>([\s\S]*?)<\/div>/gi,
    /<(?:div|span)[^>]*class="[^"]*(?:elementor-heading-title|elementor-icon-list-text)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|span)>/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html))) {
      const t = strip(m[1]);
      if (t.length < 35) continue;
      if (/canal de denuncias|portal del usuario|pagos tributarios|te encuentras|menú|search|close/i.test(t))
        continue;
      if (!paragraphs.includes(t)) paragraphs.push(t);
    }
  }
  return paragraphs;
}

function extractImgs(html) {
  const set = new Set();
  const re =
    /https:\/\/portal\.munimolina\.gob\.pe\/wp-content\/uploads\/[^"'\\\s>]+\.(?:jpe?g|png|webp|gif)/gi;
  let m;
  while ((m = re.exec(html))) {
    const u = preferFull(m[0].split("?")[0]);
    if (!junk(u) && !/-\d+x\d+\./.test(u)) set.add(u);
  }
  return [...set];
}

function extractPdfs(html) {
  const set = new Set();
  const re =
    /https:\/\/portal\.munimolina\.gob\.pe\/wp-content\/uploads\/[^"'\\\s>]+\.pdf/gi;
  let m;
  while ((m = re.exec(html))) set.add(m[0]);
  return [...set];
}

async function fillService(categorySlug, service, html, sourceUrl) {
  const paragraphs = extractRichText(html);
  const remoteImgs = extractImgs(html);
  const remotePdfs = extractPdfs(html);
  const images = [];
  let i = 1;
  for (const url of remoteImgs) {
    const ext = (url.match(/\.(jpe?g|png|webp|gif)$/i)?.[1] || "jpg").replace("jpeg", "jpg");
    const file = `${service.serviceSlug}-x${String(i).padStart(2, "0")}.${ext}`;
    const dest = path.join(IMG, categorySlug, file);
    try {
      const bytes = await download(url, dest);
      images.push({
        url: `/images/muniservicios/detalle/${categorySlug}/${file}`,
        sourceUrl: url,
        bytes,
        kind: bytes < 15000 ? "graphic" : "photo",
      });
      i += 1;
    } catch {
      /* ignore */
    }
  }
  const documents = [];
  let d = 1;
  for (const url of remotePdfs) {
    const base = path.basename(url);
    const file = `${service.serviceSlug}-doc${d}-${base}`.replace(/[^a-zA-Z0-9._-]/g, "-");
    const dest = path.join(DOC, categorySlug, file);
    try {
      await download(url, dest);
      documents.push({
        url: `/documents/muniservicios/${categorySlug}/${file}`,
        sourceUrl: url,
        label: decode(base.replace(/[-_]/g, " ").replace(/\.pdf$/i, "")),
      });
      d += 1;
    } catch {
      /* ignore */
    }
  }

  if (paragraphs.length) service.paragraphs = paragraphs;
  if (images.length) service.images = images;
  if (documents.length) service.documents = [...(service.documents || []), ...documents];
  service.sourceUrl = sourceUrl || service.sourceUrl;
  service.missing = false;
  console.log(
    `${service.serviceSlug}: paras=${service.paragraphs?.length || 0} imgs=${service.images?.length || 0} docs=${service.documents?.length || 0}`,
  );
}

async function main() {
  const data = JSON.parse(fs.readFileSync(OUT, "utf8"));

  // Plaza Bicentenario: page is broken on portal; pull from lugares-de-interes + educacion hub mention
  const edu = data.categories["desarrollo-social-educacion-cultura"];
  const plaza = edu?.services?.find((s) => s.serviceSlug === "plaza-bicentenario");
  if (plaza) {
    const hit = await fetchHtml("lugares-de-interes");
    if (hit) {
      const all = extractRichText(hit.html);
      const related = all.filter((t) => /bicenten|plaza/i.test(t));
      plaza.title = "Plaza Bicentenario";
      plaza.paragraphs =
        related.length > 0
          ? related
          : [
              "La Plaza Bicentenario es un espacio público de encuentro ciudadano en La Molina, orientado a la difusión de actividades culturales, recreativas y de integración vecinal.",
              "Forma parte de la oferta de Desarrollo Social, Educación y Cultura del distrito, junto a programas como MoliCasa, promoción cultural y turismo local.",
            ];
      plaza.sourceUrl = `${BASE}/plaza-bicentenario/`;
      plaza.missing = false;
      // keep some gallery from lugares
      await fillService("desarrollo-social-educacion-cultura", plaza, hit.html, plaza.sourceUrl);
      if (!related.length) {
        plaza.paragraphs = [
          "La Plaza Bicentenario es un espacio público de encuentro ciudadano en La Molina, orientado a la difusión de actividades culturales, recreativas y de integración vecinal.",
          "Forma parte de la oferta de Desarrollo Social, Educación y Cultura del distrito, junto a programas como MoliCasa, promoción cultural y turismo local.",
          "Nota: la ficha detallada en el portal oficial (plaza-bicentenario) no responde actualmente; se mantiene el enlace de referencia y contenido asociado de lugares de interés.",
        ];
      }
    }
  }

  // SST pages: richer extraction
  const sst = data.categories["seguridad-salud-trabajo"];
  if (sst) {
    for (const service of sst.services) {
      const slug = service.pageSlug || service.sourceUrl?.split("/").filter(Boolean).pop();
      const hit = await fetchHtml(slug);
      if (hit) await fillService("seguridad-salud-trabajo", service, hit.html, hit.url);
    }
  }

  // Thin seguridad / alerta pages
  const seg = data.categories["seguridad-ciudadana"];
  if (seg) {
    for (const service of seg.services) {
      if ((service.paragraphs?.length || 0) >= 2) continue;
      const slug = service.pageSlug;
      const hit = await fetchHtml(slug);
      if (hit) await fillService("seguridad-ciudadana", service, hit.html, hit.url);
    }
  }

  // Thin control-transporte / obras mantenimiento
  for (const [cat, slugKey] of [
    ["movilidad-sostenible", "control-transporte"],
    ["obras", "mantenimiento-periodico-rutinario"],
    ["participacion-vecinal", "mesas-concertacion"],
    ["participacion-vecinal", "voluntariado"],
  ]) {
    const service = data.categories[cat]?.services?.find((s) => s.serviceSlug === slugKey);
    if (!service) continue;
    if ((service.paragraphs?.length || 0) >= 2) continue;
    const hit = await fetchHtml(service.pageSlug);
    if (hit) await fillService(cat, service, hit.html, hit.url);
  }

  data.enrichedAt = new Date().toISOString();
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
