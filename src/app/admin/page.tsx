import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { parseDashboardFilters } from "@/features/statistiques/lib/parse-dashboard-filters";
import { getDashboardBundle } from "@/services/dashboard.service";

type AdminDashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const params = await searchParams;
  const filters = parseDashboardFilters(params);
  const bundle = await getDashboardBundle(filters);

  return <AdminDashboardView initialData={bundle} />;
}
