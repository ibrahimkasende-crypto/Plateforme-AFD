import { AnalyticsPageView } from "@/components/admin/analytics/analytics-page-view";
import { getFinanceAnalytics } from "@/features/admin-analytics/services/admin-analytics.service";
import { parseAnalyticsContext } from "@/features/admin-analytics/utils/analytics-search-params";

export default async function AdminAnalyseFinancesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const context = parseAnalyticsContext(params);
  const data = await getFinanceAnalytics(context);
  return <AnalyticsPageView data={data} />;
}
