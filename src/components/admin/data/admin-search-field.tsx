export function AdminSearchField({
  name = "q",
  defaultValue,
  placeholder = "Rechercher…",
}: {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <input
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="min-w-[200px] flex-1 rounded-md border border-[var(--admin-border)] px-3 py-2 text-sm"
      aria-label={placeholder}
    />
  );
}
