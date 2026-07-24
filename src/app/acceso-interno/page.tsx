import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AccesoInternoLogin } from "./acceso-interno-login";
import { getCmsSession } from "@/lib/cms/session";

export const metadata: Metadata = {
  title: "Acceso interno",
  robots: { index: false, follow: false },
};

export default async function AccesoInternoPage() {
  const session = await getCmsSession();
  if (session) redirect("/panel");

  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50" />}>
      <AccesoInternoLogin />
    </Suspense>
  );
}
