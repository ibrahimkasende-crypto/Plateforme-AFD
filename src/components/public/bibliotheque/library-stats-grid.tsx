type LibraryStats = {
  activityCount: number;
  photoCount: number;
  reportCount: number;
  provinceCount: number;
  projectCount: number;
  archiveYearCount: number;
  categoryCount?: number;
  videoCount?: number;
};

export function LibraryStatsGrid({ stats }: { stats: LibraryStats }) {
  const items = [
    { label: "Activités", value: stats.activityCount },
    { label: "Photographies", value: stats.photoCount },
    { label: "Rapports", value: stats.reportCount },
    { label: "Provinces", value: stats.provinceCount },
    { label: "Projets documentés", value: stats.projectCount },
    { label: "Années d’archives", value: stats.archiveYearCount },
  ].filter((item) => item.value > 0 || item.label === "Activités");

  if (items.every((i) => i.value === 0)) return null;

  return (
    <section aria-label="Statistiques de la bibliothèque">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[var(--afd-border)] bg-white px-4 py-4 text-center shadow-sm"
          >
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
              {item.label}
            </dt>
            <dd className="mt-1 font-display text-2xl font-bold text-[var(--afd-ink)]">
              {item.value.toLocaleString("fr-FR")}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
