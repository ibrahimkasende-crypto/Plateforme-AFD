export function RelationPicker({
  name,
  label,
  options,
  defaultValue = "",
  required = false,
}: {
  name: string;
  label: string;
  options: Array<{ id: string; label: string }>;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-md border px-3 py-2"
      >
        <option value="">— Sélectionner —</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
