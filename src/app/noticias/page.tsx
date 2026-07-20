import type { Metadata } from "next";
import { NoticiasPageClient } from "./noticias-client";

export const metadata: Metadata = {
  title: "Noticias | Municipalidad de La Molina",
  description:
    "Todas las noticias y comunicados oficiales de la Municipalidad Distrital de La Molina.",
};

export default function NoticiasPage() {
  return <NoticiasPageClient />;
}
