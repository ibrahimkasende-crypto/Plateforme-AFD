type AutosaveIndicatorProps = {
  status: "idle" | "saving" | "saved" | "error";
};

export function AutosaveIndicator({ status }: AutosaveIndicatorProps) {
  if (status === "idle") return null;
  const label =
    status === "saving"
      ? "Enregistrement…"
      : status === "saved"
        ? "Brouillon enregistré"
        : "Échec de l’enregistrement";
  return (
    <span
      className="text-xs font-medium text-[var(--admin-muted)]"
      aria-live="polite"
      data-autosave-status={status}
    >
      {label}
    </span>
  );
}
