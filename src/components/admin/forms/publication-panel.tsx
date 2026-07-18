export function PublicationPanel({
  defaultActive = true,
  defaultPublishedAt,
}: {
  defaultActive?: boolean;
  defaultPublishedAt?: string;
}) {
  return (
    <fieldset className="space-y-3 rounded-lg border p-4">
      <legend className="px-1 text-sm font-semibold">Publication</legend>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={defaultActive} />
        Actif / publié
      </label>
      <label className="block space-y-1 text-sm">
        <span>Date de publication</span>
        <input
          type="datetime-local"
          name="published_at"
          defaultValue={defaultPublishedAt}
          className="w-full rounded-md border px-3 py-2"
        />
      </label>
    </fieldset>
  );
}
