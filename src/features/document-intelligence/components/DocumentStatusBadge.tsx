import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  uploaded: "Téléversé",
  security_check: "Contrôle sécurité",
  queued: "En file",
  processing: "Traitement",
  extracted: "Extrait",
  needs_review: "À réviser",
  inconsistent: "Incohérent",
  suspicious: "Suspect",
  approved: "Approuvé",
  rejected: "Rejeté",
  applying: "Application",
  applied: "Appliqué",
  failed: "Échec",
  archived: "Archivé",
};

const TONES: Record<string, string> = {
  needs_review: "bg-amber-100 text-amber-900",
  inconsistent: "bg-orange-100 text-orange-900",
  suspicious: "bg-red-100 text-red-800",
  approved: "bg-emerald-100 text-emerald-900",
  rejected: "bg-red-100 text-red-900",
  applied: "bg-sky-100 text-sky-900",
  processing: "bg-blue-100 text-blue-900",
  queued: "bg-slate-100 text-slate-700",
  failed: "bg-red-100 text-red-800",
};

export function DocumentStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        TONES[status] ?? "bg-slate-100 text-slate-700",
        className,
      )}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
