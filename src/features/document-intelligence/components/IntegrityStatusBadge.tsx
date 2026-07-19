import { integrityLabel } from "@/features/document-intelligence/utils/integrity-labels";
import { cn } from "@/lib/utils";

export function IntegrityStatusBadge({
  status,
  className,
}: {
  status: string | null | undefined;
  className?: string;
}) {
  const label = integrityLabel(status ?? "verification_unavailable");
  const tone =
    status === "cryptographically_verified"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : status === "unsigned"
        ? "bg-slate-50 text-slate-700 border-slate-200"
        : status === "document_suspect" || status === "signature_invalid"
          ? "bg-red-50 text-red-800 border-red-200"
          : "bg-amber-50 text-amber-900 border-amber-200";

  return (
    <span
      className={cn(
        "inline-flex max-w-full rounded-md border px-2 py-1 text-[11px] font-medium leading-snug",
        tone,
        className,
      )}
      title="Statut d’intégrité — distinct du score OCR. Jamais « document authentique » sur la seule base OCR."
    >
      {label}
    </span>
  );
}
