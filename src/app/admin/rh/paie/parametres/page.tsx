import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminRhPaieParametresPage() {
  await requirePermission("payroll.view");
  const supabase = await createClientSafe();

  let composantsActifs = 0;
  let reglesVerifiees = 0;
  let reglesBrouillon = 0;
  let dernierePeriode: { label: string; statut: string } | null = null;

  if (supabase) {
    const [{ count: comp }, { count: verified }, { count: draft }, { data: period }] =
      await Promise.all([
        supabase
          .from("salary_components" as never)
          .select("id", { count: "exact", head: true })
          .eq("active", true),
        supabase
          .from("legal_payroll_rules" as never)
          .select("id", { count: "exact", head: true })
          .eq("statut_validation", "verified"),
        supabase
          .from("legal_payroll_rules" as never)
          .select("id", { count: "exact", head: true })
          .eq("statut_validation", "draft"),
        supabase
          .from("payroll_periods" as never)
          .select("label, statut")
          .order("date_debut", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);
    composantsActifs = comp ?? 0;
    reglesVerifiees = verified ?? 0;
    reglesBrouillon = draft ?? 0;
    dernierePeriode = period as { label: string; statut: string } | null;
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Paramètres de paie"
        description="Synthèse de la configuration paie (composants, règles, périodes)."
        actions={
          <Link href="/admin/rh/paie" className="rounded border px-4 py-2 text-sm">
            Retour paie
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded border bg-white p-4 text-sm">
          <h2 className="font-semibold">Composants salariaux</h2>
          <p className="mt-2 text-2xl font-bold">{composantsActifs}</p>
          <p className="text-[var(--afd-muted)]">composants actifs</p>
          <Link href="/admin/rh/paie/composants" className="mt-3 inline-block text-[var(--afd-blue)]">
            Gérer les composants
          </Link>
        </div>
        <div className="rounded border bg-white p-4 text-sm">
          <h2 className="font-semibold">Règles légales</h2>
          <p className="mt-2">
            <span className="text-2xl font-bold">{reglesVerifiees}</span> vérifiées ·{" "}
            <span className="font-bold">{reglesBrouillon}</span> brouillon
          </p>
          <Link href="/admin/rh/paie/regles" className="mt-3 inline-block text-[var(--afd-blue)]">
            Gérer les règles
          </Link>
        </div>
        <div className="rounded border bg-white p-4 text-sm sm:col-span-2">
          <h2 className="font-semibold">Dernière période</h2>
          {dernierePeriode ? (
            <p className="mt-2">
              {dernierePeriode.label} — <strong>{dernierePeriode.statut}</strong>
            </p>
          ) : (
            <p className="mt-2 text-[var(--afd-muted)]">Aucune période créée.</p>
          )}
          <Link href="/admin/rh/paie/periodes" className="mt-3 inline-block text-[var(--afd-blue)]">
            Voir les périodes
          </Link>
        </div>
      </div>
    </main>
  );
}
