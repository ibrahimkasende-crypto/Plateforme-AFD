import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { STATUS_LABELS, formatDonationAmount } from "@/features/dons/config/bank-donation";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminDons } from "@/lib/queries/admin/dons";

export default async function AdminDonsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requirePermission("dons:read");
  const { q, status } = await searchParams;
  const items = await getAdminDons({ q, status });

  const filters = [
    { value: "", label: "Tous" },
    { value: "pending", label: "En attente" },
    { value: "proof_submitted", label: "Preuves reçues" },
    { value: "verified", label: "Confirmés" },
    { value: "rejected", label: "Rejetés" },
  ];

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Dons"
        description="Intentions, virements bancaires et transactions."
        actions={
          <>
            <Link href="/admin/dons/intentions" className="rounded border px-3 py-2 text-sm">
              Intentions
            </Link>
            <Link href="/admin/dons/transactions" className="rounded border px-3 py-2 text-sm">
              Transactions
            </Link>
            <Link href="/admin/parametres/dons-paiements" className="rounded border px-3 py-2 text-sm">
              Coordonnées bancaires
            </Link>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.value || "all"}
            href={f.value ? `/admin/dons?status=${f.value}` : "/admin/dons"}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              (status ?? "") === f.value
                ? "border-[var(--afd-blue)] bg-[var(--afd-blue)] text-white"
                : "border-[var(--afd-border)] bg-white"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <form className="flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Référence, nom, e-mail"
          className="rounded border p-2"
        />
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <button className="rounded border px-4 py-2">Rechercher</button>
      </form>

      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucun don enregistré"
          description="Les dons soumis en ligne apparaîtront ici."
          createHref="/soutenir"
          createLabel="Page don public"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Référence</th>
                <th>Donateur</th>
                <th>Montant</th>
                <th>Méthode</th>
                <th>Date</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3 font-mono text-xs">{item.reference ?? "—"}</td>
                  <td>
                    <div>{item.is_anonymous ? "Don anonyme" : item.donor_name}</div>
                    <div className="text-[var(--afd-muted)]">{item.donor_email}</div>
                  </td>
                  <td>
                    {formatDonationAmount(item.amount, item.currency ?? "USD")}{" "}
                    {item.currency ?? "USD"}
                  </td>
                  <td>{item.payment_method}</td>
                  <td>{item.created_at?.slice(0, 10) ?? "—"}</td>
                  <td>{STATUS_LABELS[item.status ?? "pending"] ?? item.status}</td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/dons/${item.id}`} className="text-[var(--afd-blue)]">
                      Détail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
