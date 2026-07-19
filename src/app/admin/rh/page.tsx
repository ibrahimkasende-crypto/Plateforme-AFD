import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { getHrDashboardStats } from "@/features/hr/services/employees.service";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const kpiLinks = [
  { key: "actifs", label: "Employés actifs", href: "/admin/rh/personnel" },
  { key: "total", label: "Effectif total", href: "/admin/rh/personnel" },
  { key: "congesOuverts", label: "Congés en cours", href: "/admin/rh/conges" },
  { key: "contratsExpirant", label: "Contrats expirant (30 j)", href: "/admin/rh/contrats" },
  { key: "femmes", label: "Femmes", href: "/admin/rh/personnel" },
  { key: "hommes", label: "Hommes", href: "/admin/rh/personnel" },
] as const;

export default async function AdminRhDashboardPage() {
  await requirePermission("hr.view");
  const supabase = await createClientSafe();
  const stats = supabase
    ? await getHrDashboardStats(supabase)
    : {
        actifs: 0,
        femmes: 0,
        hommes: 0,
        congesOuverts: 0,
        contratsExpirant: 0,
        total: 0,
      };

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Ressources humaines"
        description="Vue d'ensemble du personnel et des processus RH."
        createHref="/admin/rh/personnel/nouveau"
        createLabel="Nouvel employé"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpiLinks.map((kpi) => (
          <Link
            key={kpi.key}
            href={kpi.href}
            className="rounded border bg-white p-4 transition hover:border-[var(--afd-blue)]"
          >
            <p className="text-sm text-[var(--afd-muted)]">{kpi.label}</p>
            <p className="mt-1 text-3xl font-bold text-[var(--afd-blue)]">
              {stats[kpi.key]}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Personnel", href: "/admin/rh/personnel" },
          { label: "Recrutement", href: "/admin/rh/recrutement" },
          { label: "Présences", href: "/admin/rh/presences" },
          { label: "Paie", href: "/admin/rh/paie" },
          { label: "Départements", href: "/admin/rh/departements" },
          { label: "Congés", href: "/admin/rh/conges" },
          { label: "Performance", href: "/admin/rh/performance" },
          { label: "Formations", href: "/admin/rh/formations" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded border px-4 py-3 text-sm font-medium hover:bg-[var(--afd-accent-soft)]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
