import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createPayrollRuleAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Regle = {
  id: string;
  code: string;
  nom: string;
  rule_type: string;
  rate: number | null;
  formula: string | null;
  effective_from: string;
  statut_validation: string;
  jurisdiction: string;
};

export default async function AdminRhPaieReglesPage() {
  await requirePermission("payroll.manage_rules");
  const supabase = await createClientSafe();

  let items: Regle[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("legal_payroll_rules" as never)
      .select(
        "id, code, nom, rule_type, rate, formula, effective_from, statut_validation, jurisdiction",
      )
      .order("effective_from", { ascending: false });
    items = (data ?? []) as Regle[];
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Règles de paie"
        description="Règles légales et paramètres de calcul (sans taux codés en dur)."
        actions={
          <Link href="/admin/rh/paie" className="rounded border px-4 py-2 text-sm">
            Retour paie
          </Link>
        }
      />

      <form action={createPayrollRuleAction} className="grid gap-3 rounded border bg-white p-4 lg:grid-cols-3">
        <input required name="code" placeholder="Code *" className={fieldClass} />
        <input required name="nom" placeholder="Nom *" className={fieldClass} />
        <input required name="rule_type" placeholder="Type (social, tax…)" className={fieldClass} />
        <input required type="date" name="effective_from" className={fieldClass} />
        <input name="formula" placeholder="Formule" className={fieldClass} />
        <input type="number" step="0.0001" name="rate" placeholder="Taux (optionnel)" className={fieldClass} />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white lg:col-span-3">
          Ajouter une règle
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucune règle" description="Configurez les règles de paie applicables." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Code</th>
                <th>Nom</th>
                <th>Type</th>
                <th>Taux</th>
                <th>Formule</th>
                <th>Validité</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.code}</td>
                  <td>{item.nom}</td>
                  <td>{item.rule_type}</td>
                  <td>{item.rate ?? "—"}</td>
                  <td className="max-w-xs truncate">{item.formula ?? "—"}</td>
                  <td>{item.effective_from}</td>
                  <td>{item.statut_validation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
