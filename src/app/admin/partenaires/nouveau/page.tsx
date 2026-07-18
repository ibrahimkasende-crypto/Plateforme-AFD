import { PartnerForm } from "@/features/partenaires/components/partner-form";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouveauPartenairePage() {
  await requirePermission("partenaires:write");

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Nouveau partenaire</h1>
      <PartnerForm />
    </main>
  );
}
