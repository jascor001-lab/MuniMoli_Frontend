"use client";

import dynamic from "next/dynamic";

const MunicipalityMap = dynamic(
  () =>
    import("@/components/sections/MunicipalityMap").then(
      (mod) => mod.MunicipalityMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[380px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-molina-muted"
        aria-busy="true"
        aria-label="Cargando mapa"
      >
        Cargando mapa de ubicación…
      </div>
    ),
  },
);

export function MunicipalityMapLazy() {
  return <MunicipalityMap />;
}
