export function StatusField({
  name = "status",
  defaultValue = "",
  options,
  label = "Statut",
}: {
  name?: string;
  defaultValue?: string;
  options: Array<{ value: string; label: string }>;
  label?: string;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-md border px-3 py-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
