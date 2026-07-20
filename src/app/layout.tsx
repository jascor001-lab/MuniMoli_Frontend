import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Municipalidad de La Molina | Portal del Ciudadano",
  description:
    "Trámites en línea, transparencia, noticias y servicios digitales de la Municipalidad Distrital de La Molina.",
  keywords: [
    "La Molina",
    "Municipalidad",
    "trámites",
    "tributos",
    "transparencia",
    "Lima",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-PE">
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
