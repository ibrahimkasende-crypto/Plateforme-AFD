import Link from "next/link";
import { FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ImportRapportButtonProps = {
  moduleCible: string;
  typeDocument?: string;
  programmeId?: string;
  projetId?: string;
  periodeDebut?: string;
  periodeFin?: string;
  provinceId?: string;
  devise?: string;
  className?: string;
  label?: string;
};

export function ImportRapportButton({
  moduleCible,
  typeDocument,
  programmeId,
  projetId,
  periodeDebut,
  periodeFin,
  provinceId,
  devise,
  className,
  label = "Importer un rapport",
}: ImportRapportButtonProps) {
  const params = new URLSearchParams();
  params.set("module_cible", moduleCible);
  if (typeDocument) params.set("type_document", typeDocument);
  if (programmeId) params.set("programme_id", programmeId);
  if (projetId) params.set("projet_id", projetId);
  if (periodeDebut) params.set("periode_debut", periodeDebut);
  if (periodeFin) params.set("periode_fin", periodeFin);
  if (provinceId) params.set("province_id", provinceId);
  if (devise) params.set("devise", devise);

  return (
    <Link
      href={`/admin/import-intelligent/nouveau?${params.toString()}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--admin-primary)] shadow-sm transition hover:bg-[var(--admin-primary)]/5",
        className,
      )}
    >
      <FileUp className="size-4" aria-hidden />
      {label}
    </Link>
  );
}
