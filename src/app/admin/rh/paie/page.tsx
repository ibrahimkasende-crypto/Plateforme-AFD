import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminRhPaiePage() {
  await requirePermission("payroll.view");
  const supabase = await createClientSafe();

  let periodCount = 0;
  let bulletinCount = 0;
  let draftPeriods = 0;

  if (supabase) {
    const [{ count: periods }, { count: bulletins }, { count: drafts }] = await Promise.all([
      supabase.from("payroll_periods" as never).select("id", { count: "exact", head: true }),
      supabase.from("payslips" as never).select("id", { count: "exact", head: true }),
      supabase
        .from("payroll_periods" as never)
        .select("id", { count: "exact", head: true })
        .eq("statut", "draft"),
    ]);
    periodCount = periods ?? 0;
    bulletinCount = bulletins ?? 0;
    draftPeriods = drafts ?? 0;
  }

  const links = [
    { label: "Périodes de paie", href: "/admin/rh/paie/periodes", value: periodCount },
    { label: "Bulletins", href: "/admin/rh/paie/bulletins", value: bulletinCount },
    { label: "Règles légales", href: "/admin/rh/paie/regles" },
    { label: "Composants salariaux", href: "/admin/rh/paie/composants" },
    { label: "Paramètres", href: "/admin/rh/paie/parametres" },
  ];

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Paie"
        description="Gestion des périodes, calculs et bulletins de paie."
        createHref="/admin/rh/paie/periodes"
        createLabel="Périodes"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Périodes</p>
          <p className="text-2xl font-bold">{periodCount}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Bulletins générés</p>
          <p className="text-2xl font-bold">{bulletinCount}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Brouillons</p>
          <p className="text-2xl font-bold">{draftPeriods}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between rounded border bg-white px-4 py-3 hover:border-[var(--afd-blue)]"
          >
            <span className="font-medium">{link.label}</span>
            {"value" in link && link.value != null ? (
              <span className="text-sm text-[var(--afd-muted)]">{link.value}</span>
            ) : null}
          </Link>
        ))}
      </div>
    </main>
  );
}
