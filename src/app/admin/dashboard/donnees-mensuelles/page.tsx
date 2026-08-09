import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { MonthlyDataEditor } from "@/components/admin/dashboard/monthly-data-editor";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  currentYearMonth,
  listAvailableMonths,
  loadActivityRows,
  loadBeneficiaryRows,
  loadBudgetRow,
} from "@/features/dashboard/services/monthly-data.service";

export const metadata: Metadata = {
  title: "Chiffres mensuels du tableau de bord",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ mois?: string }>;
};

function canEdit(roles: string[], role: string) {
  const allowed = new Set([
    "super_admin",
    "platform_owner",
    "tenant_super_admin",
    "admin_principal_direction",
    "admin_principal_it",
  ]);
  return allowed.has(role) || roles.some((r) => allowed.has(r));
}

export default async function DonneesMensuellesPage({ searchParams }: PageProps) {
  const session = await requireAdmin("/admin/dashboard/donnees-mensuelles");
  const params = await searchParams;
  const requested = (params.mois || "").trim();
  const yearMonth = /^\d{4}-\d{2}$/.test(requested)
    ? requested
    : currentYearMonth();

  const [availableMonths, beneficiaries, activities, budget] =
    await Promise.all([
      listAvailableMonths(),
      loadBeneficiaryRows(yearMonth),
      loadActivityRows(yearMonth),
      loadBudgetRow(yearMonth),
    ]);

  const months = availableMonths.includes(yearMonth)
    ? availableMonths
    : [yearMonth, ...availableMonths];

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Chiffres mensuels"
        description="Saisissez ou mettez à jour, mois par mois, les chiffres officiels du tableau de bord : bénéficiaires, activités et budget."
        backFallbackHref="/admin"
        actions={
          <Link
            href="/admin"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Voir le dashboard
          </Link>
        }
      />

      <MonthlyDataEditor
        key={yearMonth}
        initialYearMonth={yearMonth}
        availableMonths={months}
        beneficiaries={beneficiaries}
        activities={activities}
        budget={budget}
        canEdit={canEdit(session.roles, session.role)}
      />
    </main>
  );
}
