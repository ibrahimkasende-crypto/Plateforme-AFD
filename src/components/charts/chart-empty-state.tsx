export function ChartEmptyState({
  title = "Aucune donnée",
  description = "Ajustez les filtres ou saisissez des données dans le module correspondant.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex h-full min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 text-center">
      <p className="font-display text-sm font-semibold text-[var(--admin-text)]">
        {title}
      </p>
      <p className="mt-1 max-w-sm text-xs text-[var(--admin-muted)]">
        {description}
      </p>
    </div>
  );
}
