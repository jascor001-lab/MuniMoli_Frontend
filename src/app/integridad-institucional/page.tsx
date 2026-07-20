import type { Metadata } from "next";
import { IntegridadInstitucionalClient } from "./integridad-institucional-client";

export const metadata: Metadata = {
  title: "Integridad Institucional | Municipalidad de La Molina",
  description:
    "Información sobre integridad pública, prevención de la corrupción, Modelo de Integridad y canales de denuncia de la Municipalidad Distrital de La Molina.",
};

export default function IntegridadInstitucionalPage() {
  return <IntegridadInstitucionalClient />;
}
