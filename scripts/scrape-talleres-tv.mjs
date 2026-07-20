/**
 * Scrapes Talleres + Molina TV hubs and detail pages from portal.munimolina.gob.pe,
 * downloads images/icons, extracts YouTube/Facebook/live embeds, writes JSON.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE = "https://portal.munimolina.gob.pe";
const WP = `${BASE}/wp-json/wp/v2/pages`;

const OUT_TALLERES = path.join(ROOT, "src/data/talleres-data.json");
const OUT_TV = path.join(ROOT, "src/data/molina-tv-data.json");
const IMG_TALLERES = path.join(ROOT, "public/images/talleres");
const ICONS_DIR = path.join(IMG_TALLERES, "icons");

const TALLERES_CATEGORIES = [
  {
    slug: "culturales",
    title: "Culturales",
    pageSlug: "talleres_culturales",
    sourceUrl: `${BASE}/talleres_culturales/`,
    icon: "svg",
    iconFile: "culturales.svg",
    breadcrumb: "Talleres > 2025",
  },
  {
    slug: "deportivos-moliactivate",
    title: "Deportivos y Moliactívate",
    pageSlug: "molimuevet-deportivo",
    sourceUrl: `${BASE}/molimuevet-deportivo`,
    icon: "svg",
    iconFile: "deportivos.svg",
    breadcrumb: "Talleres > 2025",
  },
  {
    slug: "productivos",
    title: "Productivos",
    pageSlug: "productivos",
    sourceUrl: `${BASE}/productivos/`,
    icon: "fa",
    iconName: "theater-masks",
    breadcrumb: "Talleres > 2025",
  },
  {
    slug: "omaped-2024",
    title: "OMAPED 2024",
    pageSlug: "omaped-2",
    sourceUrl: `${BASE}/omaped-2/`,
    icon: "svg",
    iconFile: "omaped.svg",
    breadcrumb: "Talleres > 2024",
    notice: "Próximamente",
  },
  {
    slug: "adulto-mayor",
    title: "Adulto Mayor",
    pageSlug: "culturales",
    sourceUrl: `${BASE}/culturales/`,
    icon: "svg",
    iconFile: "adulto-mayor.svg",
    breadcrumb: "Talleres > 2025",
  },
];

const TV_CATEGORIES = [
  {
    slug: "en-vivo",
    title: "EN VIVO",
    pageSlug: "molina-tv-en-vivo",
    sourceUrl: `${BASE}/molina-tv-en-vivo`,
    breadcrumb: "TV > En vivo",
  },
  {
    slug: "sesiones-concejo",
    title: "SESIONES DE CONCEJO MUNICIPAL",
    pageSlug: "sesiones-de-concejo-municipal",
    sourceUrl: `${BASE}/sesiones-de-concejo-municipal/`,
    breadcrumb: "TV > Sesiones de Concejo Municipal",
  },
  {
    slug: "molina-noticias",
    title: "LA MOLINA NOTICIAS",
    pageSlug: "molina-noticias",
    sourceUrl: `${BASE}/molina-noticias/`,
    breadcrumb: "TV > Moli Noticias",
  },
  {
    slug: "podcast",
    title: "PODCAST",
    pageSlug: "podcast",
    sourceUrl: `${BASE}/podcast/`,
    breadcrumb: "TV > La Molina Podcast",
  },
];

function decodeHtml(s) {
  return String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCharCode(parseInt(h, 16)),
    );
}

function stripTags(html) {
  return decodeHtml(String(html || "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function preferFullSize(url) {
  return url.replace(/-\d+x\d+(?=\.(jpe?g|png|webp|gif))/i, "");
}

function absUrl(url) {
  if (!url) return null;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${BASE}${url}`;
  return url;
}

function extFromUrl(url) {
  const m = url
    .toLowerCase()
    .match(/\.(jpe?g|png|webp|gif|svg)(?:$|\?)/);
  return m ? m[1].replace("jpeg", "jpg") : "jpg";
}

function titleFromFilename(url) {
  const base = path
    .basename(url)
    .split("?")[0]
    .replace(/\.[^.]+$/, "")
    .replace(/-\d+x\d+$/i, "");
  return decodeHtml(
    base
      .replace(/[_-]+/g, " ")
      .replace(/\bCURSO\b/gi, "Curso")
      .replace(/\bPROGRAMA\b/gi, "Programa")
      .replace(/\bPOST\b/gi, "")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function youtubeId(url) {
  if (!url) return null;
  const u = url.replace(/\\u0026/g, "&");
  const m =
    u.match(/[?&]v=([^&#]+)/) ||
    u.match(/youtu\.be\/([^?&#]+)/) ||
    u.match(/embed\/([^?&#]+)/);
  return m ? m[1] : null;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fetchPageBySlug(slug) {
  const data = await fetchJson(`${WP}?slug=${encodeURIComponent(slug)}`);
  return Array.isArray(data) && data[0] ? data[0] : null;
}

async function downloadFile(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    return fs.statSync(dest).size;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function extractImages(html) {
  const urls = new Set();
  const re =
    /(?:src|data-src|data-lazy-src)=["'](https:\/\/portal\.munimolina\.gob\.pe\/wp-content\/uploads\/[^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    const full = preferFullSize(m[1].split("?")[0]);
    if (!/logo|favicon|cropped-frame|logotop|logofooter/i.test(full)) {
      urls.add(full);
    }
  }
  return [...urls];
}

function extractHeadings(html) {
  const titles = [];
  const re = /<h[1-6][^>]*class="[^"]*elementor-heading-title[^"]*"[^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  let m;
  while ((m = re.exec(html))) {
    const t = stripTags(m[1]);
    if (t) titles.push(t);
  }
  return titles;
}

function extractVideos(html) {
  const decoded = decodeHtml(html);
  const videos = [];
  const seen = new Set();

  // Pair each youtube_url with the nearest preceding heading title
  const videoRe =
    /"youtube_url"\s*:\s*"((?:\\.|[^"\\])*)"/gi;
  let m;
  while ((m = videoRe.exec(decoded))) {
    const rawUrl = m[1].replace(/\\\//g, "/").replace(/\\u0026/g, "&");
    const id = youtubeId(rawUrl);
    if (!id || seen.has(id)) continue;
    seen.add(id);

    const before = decoded.slice(Math.max(0, m.index - 2500), m.index);
    const headings = [
      ...before.matchAll(
        /<h[1-6][^>]*class="[^"]*elementor-heading-title[^"]*"[^>]*>([\s\S]*?)<\/h[1-6]>/gi,
      ),
    ];
    let title = "";
    if (headings.length) {
      title = stripTags(headings[headings.length - 1][1]);
    }
    // Skip hub section titles used as false positives
    if (
      /^(LA MOLINA TV|Sesiones de Concejo Municipal|Micronoticiero La Molina Tv|Podcast La Molina Tv|Podcast)$/i.test(
        title,
      )
    ) {
      title = "";
    }

    videos.push({
      title: title || `Video ${videos.length + 1}`,
      url: rawUrl.startsWith("http")
        ? rawUrl
        : `https://www.youtube.com/watch?v=${id}`,
      youtubeId: id,
      provider: "youtube",
      embedUrl: `https://www.youtube.com/embed/${id}`,
    });
  }

  // Facebook video embeds
  const fbRe =
    /src=["'](https:\/\/www\.facebook\.com\/plugins\/video\.php[^"']+)["']/gi;
  let fi = 0;
  while ((m = fbRe.exec(decoded))) {
    const src = m[1].replace(/&amp;/g, "&");
    if (seen.has(src)) continue;
    seen.add(src);
    fi += 1;
    const before = decoded.slice(Math.max(0, m.index - 2500), m.index);
    const headings = [
      ...before.matchAll(
        /<h[1-6][^>]*class="[^"]*elementor-heading-title[^"]*"[^>]*>([\s\S]*?)<\/h[1-6]>/gi,
      ),
    ];
    let title = headings.length
      ? stripTags(headings[headings.length - 1][1])
      : "";
    if (
      /^(LA MOLINA TV|Micronoticiero La Molina Tv)$/i.test(title) ||
      !title
    ) {
      title = `Micronoticiero Facebook ${fi}`;
    }
    videos.push({
      title,
      url: src,
      provider: "facebook",
      embedUrl: src,
    });
  }

  // Live stream iframe (iblups)
  const liveRe =
    /src=["'](https:\/\/iblups\.com\/embed\/[^"']+)["']/i;
  const live = liveRe.exec(decoded);
  if (live) {
    videos.unshift({
      title: "Transmisión en vivo — La Molina TV",
      url: live[1],
      provider: "live",
      embedUrl: live[1],
    });
  }

  return videos;
}

function extractNotice(html) {
  const text = stripTags(html);
  if (/pr[oó]ximamente/i.test(text)) return "Próximamente";
  return null;
}

async function saveHubSvgs() {
  const page = await fetchPageBySlug("talleres");
  if (!page) return;
  const html = page.content?.rendered || "";
  fs.mkdirSync(ICONS_DIR, { recursive: true });

  const labelToFile = [
    [/Culturales/i, "culturales.svg"],
    [/Deportivos/i, "deportivos.svg"],
    [/OMAPED/i, "omaped.svg"],
    [/Adulto Mayor/i, "adulto-mayor.svg"],
  ];

  for (const [labelRe, file] of labelToFile) {
    const blockRe = new RegExp(
      `<svg[\\s\\S]*?<\\/svg>[\\s\\S]{0,700}?>${labelRe.source}<`,
      "i",
    );
    const m = html.match(blockRe);
    if (!m) continue;
    const svgMatch = m[0].match(/<svg[\s\S]*?<\/svg>/i);
    if (!svgMatch) continue;
    const svg = svgMatch[0].replace(/fill:#0e6a35/gi, 'fill="#00A651"');
    fs.writeFileSync(path.join(ICONS_DIR, file), svg, "utf8");
    console.log(`  icon ${file}`);
  }
}

async function processTallerCategory(cat) {
  console.log(`Talleres / ${cat.slug}`);
  const page = await fetchPageBySlug(cat.pageSlug);
  const html = page?.content?.rendered || "";
  const headings = extractHeadings(html);
  const pageTitle =
    headings.find(
      (h) =>
        !/^Talleres/i.test(h) &&
        !/^Te encuentras/i.test(h) &&
        h.length > 2,
    ) ||
    stripTags(page?.title?.rendered || "") ||
    cat.title;

  const remoteImages = extractImages(html);
  const images = [];
  let i = 1;
  for (const url of remoteImages) {
    const ext = extFromUrl(url);
    const file = `${cat.slug}-${String(i).padStart(2, "0")}.${ext}`;
    const dest = path.join(IMG_TALLERES, cat.slug, file);
    try {
      const bytes = await downloadFile(url, dest);
      images.push({
        url: `/images/talleres/${cat.slug}/${file}`,
        sourceUrl: url,
        alt: titleFromFilename(url),
        title: titleFromFilename(url),
        bytes,
      });
      i += 1;
    } catch (e) {
      console.warn(`  img fail ${url}: ${e.message}`);
    }
  }

  return {
    slug: cat.slug,
    title: cat.title,
    pageTitle,
    breadcrumb: cat.breadcrumb,
    sourceUrl: page?.link || cat.sourceUrl,
    icon:
      cat.icon === "svg"
        ? { type: "svg", url: `/images/talleres/icons/${cat.iconFile}` }
        : { type: "fa", name: cat.iconName },
    notice: cat.notice || extractNotice(html),
    headings,
    images,
  };
}

async function processTvCategory(cat) {
  console.log(`TV / ${cat.slug}`);
  const page = await fetchPageBySlug(cat.pageSlug);
  const html = page?.content?.rendered || "";
  const headings = extractHeadings(html);
  const videos = extractVideos(html);

  // Prefer heading list (with dates) when count matches videos of same provider
  const ytVideos = videos.filter((v) => v.provider === "youtube");
  const skip = new Set([
    "LA MOLINA TV",
    "Sesiones de Concejo Municipal",
    "Micronoticiero La Molina Tv",
    "Podcast La Molina Tv",
    "Podcast",
    "Molina Tv",
  ]);
  const detailTitles = headings.filter((h) => !skip.has(h));

  if (
    cat.slug === "sesiones-concejo" &&
    detailTitles.length >= ytVideos.length
  ) {
    ytVideos.forEach((v, idx) => {
      v.title = detailTitles[idx] || v.title;
    });
  } else if (
    (cat.slug === "molina-noticias" || cat.slug === "podcast") &&
    detailTitles.length
  ) {
    // Map remaining youtube titles from detail headings when generic
    let ti = 0;
    for (const v of ytVideos) {
      if (
        !v.title ||
        /^(Video \d+|Micronoticiero:?\s*$|Micronoticiero -\s*$)/i.test(v.title)
      ) {
        if (detailTitles[ti]) v.title = detailTitles[ti];
      }
      ti += 1;
    }
  }

  return {
    slug: cat.slug,
    title: cat.title,
    breadcrumb: cat.breadcrumb,
    sourceUrl: page?.link || cat.sourceUrl,
    headings,
    videos,
  };
}

async function main() {
  console.log("Scraping hub SVGs…");
  await saveHubSvgs();

  console.log("Scraping Talleres…");
  const talleresCategories = [];
  for (const cat of TALLERES_CATEGORIES) {
    talleresCategories.push(await processTallerCategory(cat));
  }

  const talleresData = {
    scrapedAt: new Date().toISOString(),
    sourceUrl: `${BASE}/talleres`,
    title: "TALLERES",
    categories: talleresCategories,
  };
  fs.writeFileSync(OUT_TALLERES, JSON.stringify(talleresData, null, 2), "utf8");
  console.log(`Wrote ${OUT_TALLERES}`);

  console.log("Scraping Molina TV…");
  const tvCategories = [];
  for (const cat of TV_CATEGORIES) {
    tvCategories.push(await processTvCategory(cat));
  }

  const tvData = {
    scrapedAt: new Date().toISOString(),
    sourceUrl: `${BASE}/molina-tv/`,
    title: "LA MOLINA TV",
    categories: tvCategories,
  };
  fs.writeFileSync(OUT_TV, JSON.stringify(tvData, null, 2), "utf8");
  console.log(`Wrote ${OUT_TV}`);

  const imgCount = talleresCategories.reduce(
    (n, c) => n + c.images.length,
    0,
  );
  const vidCount = tvCategories.reduce((n, c) => n + c.videos.length, 0);
  console.log(`Done. ${imgCount} images, ${vidCount} videos/embeds.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
