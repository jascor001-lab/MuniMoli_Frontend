import type { Metadata } from "next";
import { GestionMunicipalClient } from "./gestion-municipal-client";

export const metadata: Metadata = {
  title: "Gestión Municipal | Municipalidad de La Molina",
  description:
    "Alcalde, concejo municipal, estructura orgánica, comisiones, funcionarios y reconocimientos de la Municipalidad Distrital de La Molina.",
};

export default function GestionMunicipalPage() {
  return <GestionMunicipalClient />;
}
