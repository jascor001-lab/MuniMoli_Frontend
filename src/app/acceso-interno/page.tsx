import type { Metadata } from "next";
import { Suspense } from "react";
import { AccesoInternoLogin } from "./acceso-interno-login";

export const metadata: Metadata = {
  title: "Acceso interno",
  robots: { index: false, follow: false },
};

export default function AccesoInternoPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50" />}>
      <AccesoInternoLogin />
    </Suspense>
  );
}
