import Link from "next/link";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { getCmsSession } from "@/lib/cms/session";
import { listEditableSections } from "@/lib/cms/permissions";
import { PanelShell } from "./panel-shell";

export const metadata = {
  title: "Panel de gestión | MuniMol",
  robots: { index: false, follow: false },
};

export default async function PanelPage() {
  const session = await getCmsSession();
  if (!session) redirect("/acceso-interno");

  const sections = listEditableSections(session).map((section) => ({
    id: section.id,
    label: section.label,
    description: section.description,
  }));

  return (
    <PanelShell user={session} sections={sections}>
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
          <p className="mt-4 text-sm text-molina-muted">
            Usa el menú lateral izquierdo para abrir cualquier sección.
          </p>
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
