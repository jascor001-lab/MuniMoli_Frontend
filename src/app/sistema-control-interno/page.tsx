import type { Metadata } from "next";
import { SistemaControlInternoClient } from "./sistema-control-interno-client";

export const metadata: Metadata = {
  title: "Sistema de Control Interno | Municipalidad de La Molina",
  description:
    "Planes de Acción Anual, evaluaciones y reportes de seguimiento del Sistema de Control Interno de la Municipalidad de La Molina.",
};

export default function SistemaControlInternoPage() {
  return <SistemaControlInternoClient />;
}
