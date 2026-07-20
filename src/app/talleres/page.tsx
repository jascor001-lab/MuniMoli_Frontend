import type { Metadata } from "next";
import { TalleresClient } from "./talleres-client";

export const metadata: Metadata = {
  title: "Talleres | Municipalidad de La Molina",
  description:
    "Talleres culturales, deportivos, productivos, OMAPED y adulto mayor de la Municipalidad Distrital de La Molina.",
};

export default function TalleresPage() {
  return <TalleresClient />;
}
