import fs from "fs";

const j = JSON.parse(
  fs.readFileSync(`${process.env.TEMP}/molina-news.json`, "utf8"),
);

const news = j.filter((p) => {
  const cats = (p._embedded?.["wp:term"]?.[0] || []).map((c) => c.name);
  return (
    cats.includes("Noticias") ||
    p.slug ===
      "inauguran-espectacular-exposicion-la-evolucion-de-los-vertebrados"
  );
});

function cat(title, slug) {
  const t = `${title} ${slug}`.toLowerCase();
  if (/camara|sereno|seguridad/.test(t)) return "Seguridad";
  if (/pista|vereda|obra|remodel/.test(t)) return "Obras";
  if (/exposici|sinfon|cultura|espect/.test(t)) return "Cultura";
  if (/estadio|futbol|fútbol|mundial|deport/.test(t)) return "Deportes";
  return "General";
}

function decode(s) {
  return s
    .replace(/&#8211;/g, "–")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8217;/g, "'")
    .replace(/&#176;/g, "°")
    .replace(/&#186;/g, "º")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#171;/g, "«")
    .replace(/&#187;/g, "»")
    .replace(/\s+/g, " ")
    .trim();
}

const items = news.map((p, i) => {
  const img =
    p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/images/news/obras.svg";
  let ex = decode(
    (p.excerpt?.rendered || "").replace(/<[^>]+>/g, " "),
  ).slice(0, 180);
  if (ex.length >= 180) ex = `${ex.replace(/\s+\S*$/, "")}…`;
  return {
    id: `n${i + 1}`,
    title: decode(p.title.rendered),
    excerpt: ex,
    category: cat(p.title.rendered, p.slug),
    publishedAt: p.date.slice(0, 10),
    imageUrl: img,
    slug: p.slug,
    href: p.link,
  };
});

const body = items
  .map((item) => {
    const lines = [
      `  {`,
      `    id: ${JSON.stringify(item.id)},`,
      `    title: ${JSON.stringify(item.title)},`,
      `    excerpt: ${JSON.stringify(item.excerpt)},`,
      `    category: ${JSON.stringify(item.category)},`,
      `    publishedAt: ${JSON.stringify(item.publishedAt)},`,
      `    imageUrl: ${JSON.stringify(item.imageUrl)},`,
      `    slug: ${JSON.stringify(item.slug)},`,
      `    href: ${JSON.stringify(item.href)},`,
      `  },`,
    ];
    return lines.join("\n");
  })
  .join("\n");

const out = `import type { NewsItem } from "@/types/portal";

/** Noticias tomadas de portal.munimolina.gob.pe/noticias/ */
export const NEWS_ITEMS: NewsItem[] = [
${body}
];
`;

fs.writeFileSync("src/data/news-items.ts", out, "utf8");
console.log(`Wrote ${items.length} news items to src/data/news-items.ts`);
