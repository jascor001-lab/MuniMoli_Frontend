import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { getPortalCmsBundle } from "@/lib/cms/portal-content";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cms = await getPortalCmsBundle();

  return (
    <html lang="es-PE">
      <body className="min-h-screen min-w-0 overflow-x-clip font-sans">
        <Providers cms={cms}>{children}</Providers>
      </body>
    </html>
  );
}
