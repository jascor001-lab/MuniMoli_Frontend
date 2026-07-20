import type { Metadata } from "next";
import { MuniserviciosClient } from "./muniservicios-client";

export const metadata: Metadata = {
  title: "Muniservicios | Municipalidad de La Molina",
  description:
    "Programas, atención, servicios ambientales, seguridad, educación, cultura, recreación y servicios municipales para los vecinos de La Molina.",
};

export default function MuniserviciosPage() {
  return <MuniserviciosClient />;
}
