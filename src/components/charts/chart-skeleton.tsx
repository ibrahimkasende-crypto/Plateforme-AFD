export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-busy="true"
      aria-label="Chargement du graphique"
    >
      <div className="h-full min-h-[180px] animate-pulse rounded-xl bg-gradient-to-br from-slate-100 to-slate-200" />
    </div>
  );
}
