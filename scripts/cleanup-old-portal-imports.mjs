import fs from "fs";

const patches = [
  [
    "src/app/talleres/talleres-client.tsx",
    [
      ['import { Drama, ExternalLink } from "lucide-react";', 'import { Drama } from "lucide-react";'],
      [
        `import {
  TALLERES_SOURCE_URL,
  type TallerCategory,
} from "@/data/talleres-data";`,
        'import { type TallerCategory } from "@/data/talleres-data";',
      ],
      ["\n  const sourceUrl = talleres.sourceUrl || TALLERES_SOURCE_URL;", ""],
    ],
  ],
  [
    "src/app/talleres/taller-category-client.tsx",
    [
      [
        'import { ArrowLeft, ExternalLink } from "lucide-react";',
        'import { ArrowLeft } from "lucide-react";',
      ],
    ],
  ],
  [
    "src/app/molina-tv/molina-tv-client.tsx",
    [
      ["  ExternalLink,\n", ""],
      ['import { MOLINA_TV_SOURCE_URL } from "@/data/molina-tv-data";\n', ""],
      ["\n  const sourceUrl = molinaTv.sourceUrl || MOLINA_TV_SOURCE_URL;", ""],
    ],
  ],
  [
    "src/app/molina-tv/molina-tv-category-client.tsx",
    [
      [
        'import { ArrowLeft, ExternalLink, Search } from "lucide-react";',
        'import { ArrowLeft, Search } from "lucide-react";',
      ],
    ],
  ],
  [
    "src/app/gestion-municipal/gestion-municipal-client.tsx",
    [
      ["  ExternalLink,\n", ""],
      [
        `import {
  GESTION_MUNICIPAL_SOURCE_URL,
} from "@/data/gestion-municipal-data";
`,
        "",
      ],
      [
        "\n  const sourceUrl =\n    gestionMunicipal.sourceUrl || GESTION_MUNICIPAL_SOURCE_URL;",
        "",
      ],
    ],
  ],
  [
    "src/app/gestion-municipal/gestion-section-client.tsx",
    [["  ExternalLink,\n", ""]],
  ],
  [
    "src/app/gobierno-digital/gobierno-digital-client.tsx",
    [
      [
        'import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";',
        'import { ArrowLeft, ArrowUpRight } from "lucide-react";',
      ],
    ],
  ],
  [
    "src/app/sistema-control-interno/sistema-control-interno-client.tsx",
    [
      ["  ExternalLink,\n", ""],
      [
        'import { INTERNAL_CONTROL_SOURCE_URL } from "@/data/internal-control-data";\n',
        "",
      ],
    ],
  ],
  [
    "src/app/integridad-institucional/integridad-institucional-client.tsx",
    [
      [
        `import {
  INTEGRITY_SOURCE_URL,
  type IntegrityTopic,
} from "@/data/integrity-data";`,
        'import { type IntegrityTopic } from "@/data/integrity-data";',
      ],
    ],
  ],
  [
    "src/app/normas-legales-y-publicaciones/normas-legales-client.tsx",
    [
      [
        'import { LEGAL_PUBLICATIONS_SOURCE_URL } from "@/data/legal-publications-data";\n',
        "",
      ],
      [
        `\n              <div className="mt-6 flex flex-wrap gap-3">\n              </div>`,
        "",
      ],
    ],
  ],
];

for (const [file, reps] of patches) {
  let s = fs.readFileSync(file, "utf8");
  const before = s;
  for (const [a, b] of reps) s = s.split(a).join(b);
  if (s !== before) {
    fs.writeFileSync(file, s);
    console.log("cleaned", file);
  } else console.log("skip", file);
}
