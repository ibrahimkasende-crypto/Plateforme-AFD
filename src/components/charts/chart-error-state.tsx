export function ChartErrorState({
  title = "Impossible d’afficher le graphique",
  description = "Réessayez ou contactez un administrateur.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex h-full min-h-[180px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/70 px-4 text-center">
      <p className="font-display text-sm font-semibold text-red-800">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-red-700/80">{description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white"
        >
          Réessayer
        </button>
      ) : null}
    </div>
  );
}
