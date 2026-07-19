import { AnalyticsPageView } from "@/components/admin/analytics/analytics-page-view";
import { getSectorAnalytics } from "@/features/admin-analytics/services/admin-analytics.service";
import { parseAnalyticsContext } from "@/features/admin-analytics/utils/analytics-search-params";

export default async function AdminAnalyseSecteurSlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const context = parseAnalyticsContext(query);
  const data = await getSectorAnalytics(context, slug);
  return <AnalyticsPageView data={data} />;
}
