import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { ImportRapportButton } from "@/features/document-intelligence/components/ImportRapportButton";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminBeneficiaires } from "@/lib/queries/admin/beneficiaires";

export default async function AdminBeneficiairesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("beneficiaires:read");
  const { q } = await searchParams;
  const items = await getAdminBeneficiaires({ q });

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Bénéficiaires"
        description="Agrégats de bénéficiaires par période et province."
        createHref="/admin/beneficiaires/nouveau"
        createLabel="Nouvel agrégat"
        actions={
          <ImportRapportButton
            moduleCible="beneficiaires"
            typeDocument="rapport_beneficiaires"
          />
        }
      />
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Province" className="rounded border p-2" />
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucun agrégat enregistré"
          description="Saisissez les totaux bénéficiaires par période pour alimenter le suivi."
          createHref="/admin/beneficiaires/nouveau"
          createLabel="Nouvel agrégat"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Période</th>
                <th>Province</th>
                <th>Femmes</th>
                <th>Hommes</th>
                <th>Enfants</th>
                <th>Jeunes</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.periode}</td>
                  <td>{item.province ?? "—"}</td>
                  <td>{item.femmes}</td>
                  <td>{item.hommes}</td>
                  <td>{item.enfants}</td>
                  <td>{item.jeunes}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
