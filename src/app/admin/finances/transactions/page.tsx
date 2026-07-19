import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import {
  createTransactionAction,
  reconcileTransactionAction,
} from "@/features/finances/actions/manage-finances";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminFinancesTransactionsPage() {
  await requirePermission("finances:read");
  const supabase = await createClientSafe();
  const { data } = supabase
    ? await supabase
        .from("finances_transactions" as never)
        .select("id, reference, libelle, montant, devise, type, canal, statut, occurred_at")
        .order("created_at", { ascending: false })
        .limit(100)
    : { data: [] };
  const items = (data ?? []) as Array<{
    id: string;
    reference: string;
    libelle: string;
    montant: number;
    devise: string;
    type: string;
    canal: string;
    statut: string;
    occurred_at: string;
  }>;

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Transactions financières"
        description="Caisse, banque et Mobile Money. Totaux issus des lignes sources."
        actions={
          <Link href="/admin/finances/depenses" className="rounded border px-3 py-2 text-sm">
            Dépenses
          </Link>
        }
      />
      <form
        action={createTransactionAction}
        className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-3"
      >
        <input name="libelle" required placeholder="Libellé" className="rounded border p-2 text-sm" />
        <input
          name="montant"
          type="number"
          step="0.01"
          min="0.01"
          required
          placeholder="Montant"
          className="rounded border p-2 text-sm"
        />
        <select name="type" className="rounded border p-2 text-sm" defaultValue="debit">
          <option value="debit">Débit</option>
          <option value="credit">Crédit</option>
        </select>
        <select name="canal" className="rounded border p-2 text-sm" defaultValue="banque">
          <option value="caisse">Caisse</option>
          <option value="banque">Banque</option>
          <option value="mobile_money">Mobile Money</option>
          <option value="autre">Autre</option>
        </select>
        <input name="reference_externe" placeholder="Réf. externe" className="rounded border p-2 text-sm" />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Enregistrer
        </button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucune transaction"
          description="Enregistrez les mouvements de caisse / banque."
          createHref="/admin/finances/transactions"
          createLabel="Ajouter ci-dessus"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Réf.</th>
                <th>Libellé</th>
                <th>Montant</th>
                <th>Canal</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3 font-mono text-xs">{item.reference}</td>
                  <td>
                    {item.type === "debit" ? "−" : "+"} {item.libelle}
                  </td>
                  <td>
                    {Number(item.montant).toLocaleString("fr-FR")} {item.devise}
                  </td>
                  <td>{item.canal}</td>
                  <td>{item.statut}</td>
                  <td className="p-3 text-right">
                    {item.statut === "enregistree" ? (
                      <form action={reconcileTransactionAction} className="inline">
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="text-[var(--afd-blue)]">
                          Rapprocher
                        </button>
                      </form>
                    ) : null}
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
