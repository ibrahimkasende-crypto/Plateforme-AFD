import Link from "next/link";
import { LibraryActivityCard } from "@/components/public/bibliotheque/library-activity-card";
import type { LibraryActivity } from "@/config/bibliotheque";

export function LibraryDomainActivities({
  domainSlug,
  domainTitle,
  activities,
}: {
  domainSlug: string;
  domainTitle: string;
  activities: LibraryActivity[];
}) {
  if (activities.length === 0) return null;

  const preview = activities.slice(0, 3);
  const photoCount = activities.reduce((n, a) => n + a.photoCount, 0);

  return (
    <section
      aria-labelledby="library-domain-activities"
      className="mt-12 space-y-5 border-t border-[var(--afd-border)] pt-10"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="library-domain-activities"
            className="font-display text-2xl font-bold text-[var(--afd-ink)]"
          >
            Activités dans ce domaine
          </h2>
          <p className="mt-1 text-sm text-[var(--afd-muted)]">
            {activities.length} activité{activities.length > 1 ? "s" : ""} ·{" "}
            {photoCount} photo{photoCount > 1 ? "s" : ""} documentée
            {photoCount > 1 ? "s" : ""} pour {domainTitle}.
          </p>
        </div>
        <Link
          href={`/bibliotheque/domaines/${domainSlug}`}
          className="text-sm font-semibold text-[var(--afd-blue)] hover:underline"
        >
          Voir toutes les activités →
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {preview.map((activity) => (
          <LibraryActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </section>
  );
}
