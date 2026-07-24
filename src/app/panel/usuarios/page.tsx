import { redirect } from "next/navigation";
import { getCmsSession } from "@/lib/cms/session";
import { listEditableSections } from "@/lib/cms/permissions";
import { PanelShell } from "../panel-shell";
import { UsersAdminClient } from "./users-admin-client";

export default async function UsuariosPage() {
  const session = await getCmsSession();
  if (!session) redirect("/api/cms/clear-session");
  if (session.role !== "admin") redirect("/panel");

  const sections = listEditableSections(session).map((section) => ({
    id: section.id,
    label: section.label,
    description: section.description,
  }));

  return (
    <PanelShell user={session} sections={sections}>
      <UsersAdminClient />
    </PanelShell>
  );
}
