import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FileImage,
  FileText,
  Newspaper,
  Settings2,
  Users,
} from "lucide-react";
import { getCmsSession } from "@/lib/cms/session";
import { listEditableSections } from "@/lib/cms/permissions";
import { PanelShell } from "./panel-shell";

export const metadata = {
  title: "Panel de gestión | MuniMol",
  robots: { index: false, follow: false },
};

const SECTION_ICON: Record<string, typeof Newspaper> = {
  home: FileImage,
  noticias: Newspaper,
  contacto: Settings2,
  tramites: FileText,
  talleres: FileImage,
  integridad: FileText,
  "normas-legales": FileText,
  "control-interno": FileText,
  "gobierno-digital": Settings2,
  "nav-global": Settings2,
};

export default async function PanelPage() {
  const session = await getCmsSession();
  if (!session) redirect("/acceso-interno");

  const sections = listEditableSections(session);

  return (
    <PanelShell user={session}>
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h1 className="text-2xl font-bold text-molina-deep sm:text-3xl">
            Panel de contenidos
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-molina-muted">
            Elige una pestaña para registrar o actualizar información, subir
            imágenes y PDF, o eliminar lo que ya no corresponda. No necesitas
            editar código: todo es con formularios.
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-molina-deep sm:grid-cols-3">
            <li className="rounded-xl bg-emerald-50 px-3 py-2">
              1. Entra a la pestaña
            </li>
            <li className="rounded-xl bg-emerald-50 px-3 py-2">
              2. Agrega / edita / sube archivos
            </li>
            <li className="rounded-xl bg-emerald-50 px-3 py-2">
              3. Pulsa Guardar cambios
            </li>
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const Icon = SECTION_ICON[section.id] || Settings2;
            return (
              <Link
                key={section.id}
                href={`/panel/seccion/${section.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-molina-mint/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-molina-teal transition group-hover:bg-molina-deep group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-base font-bold text-molina-deep">
                  {section.label}
                </h2>
                <p className="mt-2 text-sm leading-6 text-molina-muted">
                  {section.description}
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-molina-teal">
                  Abrir editor →
                </span>
              </Link>
            );
          })}
        </div>

        {session.role === "admin" ? (
          <Link
            href="/panel/usuarios"
            className="inline-flex items-center gap-2 rounded-xl bg-molina-deep px-4 py-2.5 text-sm font-bold text-white hover:bg-molina-teal"
          >
            <Users className="h-4 w-4" />
            Administrar usuarios
          </Link>
        ) : null}
      </section>
    </PanelShell>
  );
}
