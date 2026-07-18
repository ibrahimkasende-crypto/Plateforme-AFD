export function AdminErrorState({
  title = "Impossible de charger les données",
  description = "Une erreur est survenue. Réessayez ou contactez un administrateur.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1">{description}</p>
    </div>
  );
}
