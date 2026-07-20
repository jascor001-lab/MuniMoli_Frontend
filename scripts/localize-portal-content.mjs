/**
 * Localiza dependencias de portal.munimolina.gob.pe:
 * - descarga imágenes de noticias
 * - reescribe news-items sin href externos
 * - reescribe appUrls de PROCEDURES hacia rutas locales
 */
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const ROOT = process.cwd();
const NEWS_DIR = path.join(ROOT, "public", "images", "news");
fs.mkdirSync(NEWS_DIR, { recursive: true });

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          "User-Agent": "MuniMolPortalMigrator/1.0",
          Accept: "*/*",
        },
        timeout: 60000,
      },
      (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          fetchBuffer(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      },
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Timeout ${url}`));
    });
  });
}

function extFromUrl(url) {
  const clean = url.split("?")[0];
  const ext = path.extname(clean).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) return ext;
  return ".jpg";
}

async function localizeNews() {
  const newsPath = path.join(ROOT, "src", "data", "news-items.ts");
  let src = fs.readFileSync(newsPath, "utf8");
  const items = [...src.matchAll(/\{\s*id:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?href:\s*"([^"]+)"\s*,?\s*\}/g)];

  // Parse more carefully with a simpler approach: extract imageUrl lines
  const imageMatches = [
    ...src.matchAll(/imageUrl:\s*"(https:\/\/portal\.munimolina\.gob\.pe[^"]+)"/g),
  ];
  const slugMatches = [...src.matchAll(/slug:\s*"([^"]+)"/g)];

  console.log(`Found ${imageMatches.length} remote news images`);

  for (let i = 0; i < imageMatches.length; i++) {
    const remote = imageMatches[i][1];
    const slug = slugMatches[i]?.[1] || `news-${i + 1}`;
    const ext = extFromUrl(remote);
    const filename = `${slug}${ext}`;
    const dest = path.join(NEWS_DIR, filename);
    const localUrl = `/images/news/${filename}`;

    if (!fs.existsSync(dest)) {
      try {
        console.log(`Downloading ${slug}...`);
        const buf = await fetchBuffer(remote);
        fs.writeFileSync(dest, buf);
      } catch (err) {
        console.warn(`Failed ${slug}: ${err.message}`);
        continue;
      }
    } else {
      console.log(`Exists ${filename}`);
    }
    src = src.replace(remote, localUrl);
  }

  // Remove external hrefs — NewsCard will use /noticias/{slug}
  src = src.replace(/\n\s*href:\s*"https:\/\/portal\.munimolina\.gob\.pe[^"]*",?/g, "");
  src = src.replace(
    /\/\*\* Noticias tomadas de portal\.munimolina\.gob\.pe\/noticias\/ \*\//,
    "/** Noticias del portal (contenido local editable vía CMS) */",
  );

  fs.writeFileSync(newsPath, src);
  console.log("Updated news-items.ts");
}

function localizePortalData() {
  const p = path.join(ROOT, "src", "data", "portal-data.ts");
  let src = fs.readFileSync(p, "utf8");

  src = src.replace(
    /tupa:\s*"https:\/\/portal\.munimolina\.gob\.pe\/tupa\/"/,
    'tupa: "/tramites-municipales/tupa"',
  );
  src = src.replace(
    /gobiernoDigital:\s*"https:\/\/portal\.munimolina\.gob\.pe\/contenido-gobierno-digital\/"/,
    'gobiernoDigital: "/gobierno-digital"',
  );
  src = src.replace(
    /talleres:\s*"https:\/\/portal\.munimolina\.gob\.pe\/talleres"/,
    'talleres: "/talleres"',
  );
  src = src.replace(
    /molinaTv:\s*"https:\/\/portal\.munimolina\.gob\.pe\/molina-tv\/"/,
    'molinaTv: "/molina-tv"',
  );
  src = src.replace(
    /gestionMunicipal:\s*"https:\/\/portal\.munimolina\.gob\.pe\/gestion-municipal\/"/,
    'gestionMunicipal: "/gestion-municipal"',
  );

  // Contact urls → internal
  src = src.replace(
    /portalUsuarioUrl:\s*"https:\/\/portal\.munimolina\.gob\.pe\/portal-del-usuario\/"/,
    'portalUsuarioUrl: "/plataforma-digital"',
  );
  src = src.replace(
    /sobreNosotrosUrl:\s*"https:\/\/portal\.munimolina\.gob\.pe\/sobre-nosotros\/"/,
    'sobreNosotrosUrl: "/gestion-municipal"',
  );

  // Ticker → local news
  src = src.replace(
    /href:\s*"https:\/\/portal\.munimolina\.gob\.pe\/mas-de-500-camaras-y-378-serenos-resguardaran-la-molina-durante-fiestas-patrias\/"/,
    'href: "/noticias/mas-de-500-camaras-y-378-serenos-resguardaran-la-molina-durante-fiestas-patrias"',
  );
  src = src.replace(
    /href:\s*"https:\/\/portal\.munimolina\.gob\.pe\/la-molina-renovara-medio-millon-de-metros-cuadrados-en-pistas-y-veredas-al-finalizar-2026\/"/,
    'href: "/noticias/la-molina-renovara-medio-millon-de-metros-cuadrados-en-pistas-y-veredas-al-finalizar-2026"',
  );

  // TUPA quick access — internal
  src = src.replace(
    /href: EXTERNAL_LINKS\.tupa,\n    icon: "FileText",\n    color: "deep",\n    category: "digital",\n    featured: true,\n    openInNewTab: true,\n    external: true,/,
    `href: "/tramites-municipales/tupa",
    icon: "FileText",
    color: "deep",
    category: "digital",
    featured: true,`,
  );

  // Gobierno digital tupa-tramites
  src = src.replace(
    /href:\s*"https:\/\/portal\.munimolina\.gob\.pe\/tupa-tramites"/,
    'href: "/tramites-municipales/tupa"',
  );

  // PROCEDURES: replace appUrl portal URLs with matching href from same object
  // Simpler: replace any appUrl that is portal.munimolina with removing those lines
  // and rely on href. Or set appUrl equal by regex per block.
  src = src.replace(
    /appUrl:\s*\n?\s*"https:\/\/portal\.munimolina\.gob\.pe\/[^"]+",/g,
    "",
  );

  // OFFICIAL_PORTAL_URL — point to home of this portal (relative)
  src = src.replace(
    /export const OFFICIAL_PORTAL_URL = "https:\/\/portal\.munimolina\.gob\.pe";/,
    '/** Base del portal actual (sin dependencia del WordPress anterior) */\nexport const OFFICIAL_PORTAL_URL = "";',
  );

  fs.writeFileSync(p, src);
  console.log("Updated portal-data.ts");
}

await localizeNews();
localizePortalData();
console.log("Done.");
