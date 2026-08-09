import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

export default async function ModifierUtilisateurRedirect({ params }: PageProps) {
  const { id } = await params;
  redirect(`/admin/utilisateurs/${id}?tab=personnel`);
}
