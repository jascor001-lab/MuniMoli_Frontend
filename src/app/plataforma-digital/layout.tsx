import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plataforma Digital | Municipalidad de La Molina",
  description:
    "Catálogo de trámites municipales y servicios digitales para vecinos, negocios, registro civil y licencias de edificación.",
};

export default function PlataformaDigitalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
