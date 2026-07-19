import Link from "next/link";
import { notFound } from "next/navigation";
import { AnalyticsPageView } from "@/components/admin/analytics/analytics-page-view";
import { getProjectAnalytics } from "@/features/admin-analytics/services/admin-analytics.service";
import { parseAnalyticsContext } from "@/features/admin-analytics/utils/analytics-search-params";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminProgrammeAnalysePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requirePermission("programmes:read");
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClientSafe();
  if (!supabase) notFound();
  const { data: programme } = await supabase
    .from("programmes")
    .select("id, title, description")
    .eq("id", id)
    .maybeSingle();
  if (!programme) notFound();

  const context = parseAnalyticsContext(query);
  const data = await getProjectAnalytics({
    ...context,
    programmeId: id,
    sourceWidget: "programme",
  });

  return (
    <div>
      <div className="px-6 pt-6">
        <Link
          href={`/admin/programmes/${id}/modifier`}
          className="text-sm font-semibold text-[var(--admin-primary)] hover:underline"
        >
          Modifier le programme
        </Link>
        <h1 className="mt-2 font-display text-2xl font-extrabold">
          {programme.title}
        </h1>
      </div>
      <AnalyticsPageView
        data={{
          ...data,
          title: `Programme — ${programme.title}`,
          description:
            programme.description ??
            "Analyse des projets rattachés à ce programme.",
        }}
      />
    </div>
  );
}
