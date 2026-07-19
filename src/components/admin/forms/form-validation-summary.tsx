type FormValidationSummaryProps = {
  errors: string[];
  title?: string;
};

export function FormValidationSummary({
  errors,
  title = "Corrigez les champs suivants",
}: FormValidationSummaryProps) {
  if (errors.length === 0) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <p className="font-semibold">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
