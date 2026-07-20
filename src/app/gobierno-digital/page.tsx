import type { Metadata } from "next";
import { GobiernoDigitalPageClient } from "./gobierno-digital-client";

export const metadata: Metadata = {
  title: "Gobierno Digital | Municipalidad de La Molina",
  description:
    "Servicios al ciudadano y aplicaciones de Gobierno Digital de la Municipalidad Distrital de La Molina.",
};

export default function GobiernoDigitalPage() {
  return <GobiernoDigitalPageClient />;
}
