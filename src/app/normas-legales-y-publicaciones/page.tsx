import type { Metadata } from "next";
import { NormasLegalesClient } from "./normas-legales-client";

export const metadata: Metadata = {
  title: "Normas Legales y Publicaciones | Municipalidad de La Molina",
  description:
    "Consulta decretos, ordenanzas, acuerdos, resoluciones, directivas y publicaciones oficiales de la Municipalidad Distrital de La Molina.",
};

export default function NormasLegalesPage() {
  return <NormasLegalesClient />;
}
