import { notFound } from "next/navigation";
import { PartnerForm } from "@/features/partenaires/components/partner-form";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminPartnerById } from "@/lib/queries/partenaires";

export default async function ModifierPartenairePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("partenaires:write");
  const { id } = await params;
  const partner = await getAdminPartnerById(id);
  if (!partner) notFound();

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Modifier le partenaire</h1>
      <PartnerForm partner={partner} />
    </main>
  );
}
