import { redirect } from "next/navigation";
import { getCmsSession } from "@/lib/cms/session";
import { PanelShell } from "../panel-shell";
import { UsersAdminClient } from "./users-admin-client";

export default async function UsuariosPage() {
  const session = await getCmsSession();
  if (!session) redirect("/acceso-interno");
  if (session.role !== "admin") redirect("/panel");

  return (
    <PanelShell user={session}>
      <UsersAdminClient />
    </PanelShell>
  );
}
