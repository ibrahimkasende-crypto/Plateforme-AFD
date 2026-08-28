import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { BankCoordinatesForm } from "@/components/admin/dons/bank-coordinates-form";
import { getActiveBankCoordinates } from "@/features/dons/services/bank-coordinates.service";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function AdminDonsPaiementsPage() {
  await requirePermission("dons:bank_settings");
  const coords = await getActiveBankCoordinates();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Dons et paiements"
        description="Coordonnées bancaires officielles affichées sur la page publique de don. Accès réservé Super Admin / Admin IT."
      />
      <p className="max-w-3xl rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Toute modification de numéro de compte est journalisée dans l’audit. Ne jamais publier de
        compte EUR bénéficiaire AFD tant qu’il n’est pas fourni dans le document officiel.
      </p>
      <BankCoordinatesForm initial={coords} />
    </main>
  );
}
