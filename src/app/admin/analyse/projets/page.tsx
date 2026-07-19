import { AnalyticsPageView } from "@/components/admin/analytics/analytics-page-view";
import { getProjectAnalytics } from "@/features/admin-analytics/services/admin-analytics.service";
import { parseAnalyticsContext } from "@/features/admin-analytics/utils/analytics-search-params";

export default async function AdminAnalyseProjetsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const context = parseAnalyticsContext(params);
  const data = await getProjectAnalytics(context);
  return <AnalyticsPageView data={data} />;
}
