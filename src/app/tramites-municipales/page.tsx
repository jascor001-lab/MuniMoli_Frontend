import type { Metadata } from "next";
import { TramitesMunicipalesClient } from "./tramites-municipales-client";

export const metadata: Metadata = {
  title: "Trámites Municipales | Municipalidad de La Molina",
  description:
    "Requisitos, modalidades, plazos, costos y resultados de los trámites municipales de La Molina.",
};

export default function TramitesMunicipalesPage() {
  return <TramitesMunicipalesClient />;
}
