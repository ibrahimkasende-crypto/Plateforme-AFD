import { redirect } from "next/navigation";

/** Alias : détail projet → analyse. */
export default async function AdminProjetDetailAliasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/projets/${id}/analyse`);
}
