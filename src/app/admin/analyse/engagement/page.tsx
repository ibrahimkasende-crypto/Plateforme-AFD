import { AnalyticsPageView } from "@/components/admin/analytics/analytics-page-view";
import { getEngagementAnalytics } from "@/features/admin-analytics/services/admin-analytics.service";
import { parseAnalyticsContext } from "@/features/admin-analytics/utils/analytics-search-params";

export default async function AdminAnalyseEngagementPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const context = parseAnalyticsContext(params);
  const data = await getEngagementAnalytics(context);
  return <AnalyticsPageView data={data} />;
}
