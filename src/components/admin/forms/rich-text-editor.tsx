export function RichTextEditor({
  name,
  defaultValue = "",
  rows = 8,
  label = "Contenu",
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
  label?: string;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium text-[var(--admin-text)]">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="w-full rounded-md border border-[var(--admin-border)] px-3 py-2 font-sans text-sm"
      />
    </label>
  );
}
