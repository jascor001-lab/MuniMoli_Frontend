import { notFound, redirect } from "next/navigation";
import { getCmsSession } from "@/lib/cms/session";
import {
  canEditSection,
  CMS_SECTIONS,
  isCmsSectionId,
  listEditableSections,
} from "@/lib/cms/permissions";
import { PanelShell } from "../../panel-shell";
import { SectionEditor } from "./section-editor";

type Props = { params: Promise<{ section: string }> };

export default async function PanelSectionPage({ params }: Props) {
  const session = await getCmsSession();
  if (!session) redirect("/acceso-interno");

  const { section } = await params;
  if (!isCmsSectionId(section)) notFound();
  if (!canEditSection(session, section)) {
    redirect("/panel");
  }

  const meta = CMS_SECTIONS.find((item) => item.id === section)!;
  const sections = listEditableSections(session).map((item) => ({
    id: item.id,
    label: item.label,
    description: item.description,
  }));

  return (
    <PanelShell user={session} sections={sections}>
      <SectionEditor sectionId={section} sectionLabel={meta.label} />
    </PanelShell>
  );
}
