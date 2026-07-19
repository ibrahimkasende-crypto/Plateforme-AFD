import Link from "next/link";
import { cn } from "@/lib/utils";

const LINKS = [
  { suffix: "", label: "Vue d’ensemble" },
  { suffix: "/revision", label: "Révision" },
  { suffix: "/donnees", label: "Données" },
  { suffix: "/anomalies", label: "Anomalies" },
  { suffix: "/historique", label: "Historique" },
] as const;

export function DocumentDetailNav({
  documentId,
  current,
}: {
  documentId: string;
  current: (typeof LINKS)[number]["suffix"];
}) {
  return (
    <nav className="flex flex-wrap gap-2">
      {LINKS.map((link) => {
        const href = `/admin/import-intelligent/${documentId}${link.suffix}`;
        const active = current === link.suffix;
        return (
          <Link
            key={link.suffix || "root"}
            href={href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold",
              active
                ? "bg-[var(--admin-primary)] text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
