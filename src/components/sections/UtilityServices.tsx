"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cn, isExternalHref } from "@/lib/utils";
import { QUICK_ACCESS } from "@/data/portal-data";
import type { QuickAccessItem } from "@/types/portal";

type AccordionGroup = {
  id: string;
  title: string;
  description: string;
  accent: "deep" | "teal" | "slate";
  items: QuickAccessItem[];
};

const GROUPS: AccordionGroup[] = [
  {
    id: "tupa-digital",
    title: "MoliTramites",
    description: "Trámites, pagos y servicios en línea",
    accent: "deep",
    items: QUICK_ACCESS.filter((i) =>
      ["tupa", "pagos", "mesa-partes", "molicard"].includes(i.id),
    ),
  },
  {
    id: "transparencia",
    title: "Transparencia e integridad",
    description: "Información pública, control y denuncias",
    accent: "teal",
    items: QUICK_ACCESS.filter((i) =>
      ["transparencia", "control-interno", "acceso-info", "denuncias"].includes(
        i.id,
      ),
    ),
  },
  {
    id: "ciudadano",
    title: "Atención al ciudadano",
    description: "Sugerencias, reclamos y portales externos",
    accent: "deep",
    items: QUICK_ACCESS.filter((i) =>
      ["sugerencias", "reclamaciones", "gob-pe"].includes(i.id),
    ),
  },
];

type CollageImage = { src: string; alt: string };

const MOLITRAMITES_COLLAGE: CollageImage[] = [
  {
    src: "/images/tupa/firma-digital.png",
    alt: "Firma digital de trámites en línea",
  },
  {
    src: "/images/tupa/documentos-digitales.png",
    alt: "Gestión digital de documentos",
  },
  {
    src: "/images/tupa/atencion-ciudadana.png",
    alt: "Atención ciudadana presencial y digital",
  },
  {
    src: "/images/tupa/firma-tramite.png",
    alt: "Firma y revisión de trámites",
  },
  {
    src: "/images/tupa/pago-en-linea.png",
    alt: "Pagos en línea con tarjeta",
  },
];

const TRANSPARENCIA_COLLAGE: CollageImage[] = [
  {
    src: "/images/transparencia/transparencia-datos-abiertos.png",
    alt: "Datos abiertos y presupuesto público",
  },
  {
    src: "/images/transparencia/transparencia-control-interno.png",
    alt: "Control interno y auditoría",
  },
  {
    src: "/images/transparencia/transparencia-acceso-info.png",
    alt: "Acceso a la información pública",
  },
  {
    src: "/images/transparencia/transparencia-denuncia.png",
    alt: "Canal seguro de denuncias",
  },
  {
    src: "/images/transparencia/transparencia-integridad.png",
    alt: "Integridad y rendición de cuentas",
  },
];

const CIUDADANO_COLLAGE: CollageImage[] = [
  {
    src: "/images/ciudadano/ciudadano-sugerencias.png",
    alt: "Buzón de sugerencias ciudadanas",
  },
  {
    src: "/images/ciudadano/ciudadano-reclamaciones.png",
    alt: "Libro de reclamaciones",
  },
  {
    src: "/images/ciudadano/ciudadano-portal-gob.png",
    alt: "Portales digitales del Estado",
  },
  {
    src: "/images/ciudadano/ciudadano-atencion-mesa.png",
    alt: "Mesa de atención al ciudadano",
  },
  {
    src: "/images/ciudadano/ciudadano-escucha.png",
    alt: "Escucha ciudadana y encuestas",
  },
];

const COLLAGE_BY_GROUP: Record<string, CollageImage[]> = {
  "tupa-digital": MOLITRAMITES_COLLAGE,
  transparencia: TRANSPARENCIA_COLLAGE,
  ciudadano: CIUDADANO_COLLAGE,
};

const ACCENT_STYLES = {
  deep: {
    header: "from-molina-deep to-[#0a6b52]",
    open: "ring-molina-mint/40",
    link: "hover:bg-emerald-50 hover:text-molina-deep",
    bar: "bg-molina-mint",
  },
  teal: {
    header: "from-molina-teal to-molina-deep",
    open: "ring-molina-teal/40",
    link: "hover:bg-teal-50 hover:text-molina-teal",
    bar: "bg-molina-teal",
  },
  slate: {
    header: "from-slate-700 to-slate-900",
    open: "ring-slate-400/40",
    link: "hover:bg-slate-50 hover:text-slate-800",
    bar: "bg-slate-500",
  },
} as const;

function DiagonalCollage({
  className,
  images = MOLITRAMITES_COLLAGE,
}: {
  className?: string;
  images: readonly CollageImage[];
}) {
  return (
    <div
      className={cn(
        "relative h-16 w-[50%] min-w-[10rem] shrink-0 overflow-hidden rounded-xl shadow-md ring-1 ring-slate-200/80 sm:h-20 md:h-[90px]",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 flex">
        {images.map((image, index) => (
          <div
            key={image.src}
            className="relative h-full flex-1 overflow-hidden"
            style={{
              clipPath:
                index === 0
                  ? "polygon(0 0, 100% 0, 78% 100%, 0 100%)"
                  : index === images.length - 1
                    ? "polygon(22% 0, 100% 0, 100% 100%, 0 100%)"
                    : "polygon(22% 0, 100% 0, 78% 100%, 0 100%)",
              marginLeft: index === 0 ? 0 : "-12%",
              zIndex: index + 1,
            }}
          >
            <Image
              src={image.src}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="256px"
            />
            <span
              className="absolute inset-0 bg-gradient-to-t from-molina-deep/25 to-transparent"
              aria-hidden
            />
          </div>
        ))}
      </div>
      <span
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/40"
        aria-hidden
      />
    </div>
  );
}

function ServiceRow({
  item,
  images,
}: {
  item: QuickAccessItem;
  images: readonly CollageImage[];
}) {
  const external = isExternalHref(item.href) || Boolean(item.external);
  const openBlank = external || Boolean(item.openInNewTab);

  const className =
    "group flex w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-emerald-50/80 sm:gap-4 sm:px-5";

  const textBlock = (
    <span className="min-w-0 flex-[1_1_45%]">
      <span className="block text-sm font-semibold text-molina-ink transition-colors group-hover:text-molina-teal">
        {item.label}
      </span>
      {item.shortLabel && item.shortLabel !== item.label && (
        <span className="mt-0.5 block text-xs text-molina-muted">
          {item.shortLabel}
        </span>
      )}
    </span>
  );

  const trailing = (
    <div className="flex w-[50%] min-w-[10rem] shrink-0 items-center justify-end gap-2 sm:gap-3">
      <DiagonalCollage className="w-full min-w-0 max-w-none" images={images} />
      {external ? (
        <ExternalLink
          className="hidden h-4 w-4 shrink-0 text-molina-muted transition-colors group-hover:text-molina-teal lg:block"
          aria-hidden
        />
      ) : (
        <span
          className="hidden text-xs font-bold uppercase tracking-wider text-molina-mint opacity-0 transition-opacity group-hover:opacity-100 lg:inline"
          aria-hidden
        >
          Ir →
        </span>
      )}
    </div>
  );

  if (external || openBlank) {
    return (
      <a
        href={item.href}
        target={openBlank ? "_blank" : undefined}
        rel={openBlank ? "noopener noreferrer" : undefined}
        className={className}
      >
        {textBlock}
        {trailing}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {textBlock}
      {trailing}
    </Link>
  );
}

function AccordionPanel({
  group,
  open,
  onToggle,
}: {
  group: AccordionGroup;
  open: boolean;
  onToggle: () => void;
}) {
  const styles = ACCENT_STYLES[group.accent];
  const panelId = `${group.id}-panel`;
  const collage = COLLAGE_BY_GROUP[group.id] ?? MOLITRAMITES_COLLAGE;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-white shadow-md shadow-molina-deep/5 ring-1 ring-slate-200/80 transition-all duration-300",
        open && cn("shadow-xl shadow-molina-deep/10 ring-2", styles.open),
      )}
    >
      <button
        type="button"
        id={`${group.id}-trigger`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-4 bg-gradient-to-r px-5 py-4 text-left text-white transition-opacity hover:opacity-95",
          styles.header,
        )}
      >
        <span className={cn("h-10 w-1 shrink-0 rounded-full", styles.bar)} aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold tracking-tight sm:text-lg">
            {group.title}
          </span>
          <span className="mt-0.5 block text-xs text-white/75 sm:text-sm">
            {group.description} · {group.items.length} opciones
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-300",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={`${group.id}-trigger`}
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <nav aria-label={group.title} className="bg-white">
            {group.items.map((item) => (
              <ServiceRow key={item.id} item={item} images={collage} />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export function UtilityServices({ className }: { className?: string }) {
  const [openId, setOpenId] = useState<string>("tupa-digital");

  return (
    <div className={cn("space-y-3", className)}>
      {GROUPS.map((group) => (
        <AccordionPanel
          key={group.id}
          group={group}
          open={openId === group.id}
          onToggle={() =>
            setOpenId((current) => (current === group.id ? "" : group.id))
          }
        />
      ))}
    </div>
  );
}
