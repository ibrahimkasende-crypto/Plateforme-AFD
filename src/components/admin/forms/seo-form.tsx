export function SeoForm({
  defaults,
}: {
  defaults?: {
    meta_title?: string;
    meta_description?: string;
  };
}) {
  return (
    <fieldset className="space-y-3 rounded-lg border p-4">
      <legend className="px-1 text-sm font-semibold">SEO</legend>
      <label className="block space-y-1 text-sm">
        <span>Titre meta</span>
        <input
          name="meta_title"
          defaultValue={defaults?.meta_title ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Description meta</span>
        <textarea
          name="meta_description"
          defaultValue={defaults?.meta_description ?? ""}
          rows={3}
          className="w-full rounded-md border px-3 py-2"
        />
      </label>
    </fieldset>
  );
}
