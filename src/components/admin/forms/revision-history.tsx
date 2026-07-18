export function RevisionHistory({
  entries = [],
}: {
  entries?: Array<{ id: string; label: string; at: string }>;
}) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-[var(--admin-muted)]">
        Aucun historique de révision disponible.
      </p>
    );
  }
  return (
    <ul className="space-y-2 text-sm">
      {entries.map((entry) => (
        <li key={entry.id} className="rounded border px-3 py-2">
          <span className="font-medium">{entry.label}</span>
          <span className="ml-2 text-[var(--admin-muted)]">{entry.at}</span>
        </li>
      ))}
    </ul>
  );
}
