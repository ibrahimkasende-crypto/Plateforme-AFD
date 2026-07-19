import Image from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import type { TopProject } from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

type DashboardTopProjectsProps = {
  projects: TopProject[];
  className?: string;
  compact?: boolean;
};

function formatBeneficiaries(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function DashboardTopProjects({
  projects,
  className,
  compact = false,
}: DashboardTopProjectsProps) {
  if (projects.length === 0) {
    return (
      <p
        className={cn(
          "rounded-lg border border-dashed border-slate-200 text-center text-[var(--admin-muted)]",
          compact ? "px-2 py-4 text-[11px]" : "px-4 py-8 text-sm",
        )}
      >
        Aucun projet disponible pour cette sélection.
      </p>
    );
  }

  return (
    <div className={cn(compact ? "space-y-1" : "space-y-4", className)}>
      <ol className={compact ? "space-y-1" : "space-y-3"}>
        {projects.slice(0, 5).map((project) => (
          <li key={project.id}>
            <Link
              href={`/admin/projets/${project.id}/analyse`}
              className={cn(
                "flex items-center transition hover:bg-slate-50",
                compact
                  ? "gap-2 rounded-md px-1 py-1"
                  : "gap-3 rounded-xl border border-slate-100 p-3 hover:border-slate-200",
              )}
            >
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt=""
                  width={compact ? 28 : 48}
                  height={compact ? 28 : 48}
                  className={cn(
                    "shrink-0 rounded object-cover",
                    compact ? "size-7" : "size-12 rounded-lg",
                  )}
                />
              ) : (
                <span
                  className={cn(
                    "flex shrink-0 items-center justify-center bg-slate-100 text-slate-400",
                    compact ? "size-7 rounded" : "size-12 rounded-lg",
                  )}
                >
                  <Users className={compact ? "size-3.5" : "size-5"} aria-hidden />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block truncate font-medium text-[var(--admin-text)]",
                    compact ? "text-[11px]" : "text-sm",
                  )}
                >
                  {project.title}
                </span>
                {project.location && !compact ? (
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="size-3" aria-hidden />
                    {project.location}
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 text-right">
                <span
                  className={cn(
                    "block font-bold text-[var(--admin-primary)]",
                    compact ? "text-[11px]" : "text-sm",
                  )}
                >
                  {formatBeneficiaries(project.beneficiaries)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      {!compact ? (
        <Link
          href="/admin/projets"
          className="inline-flex text-sm font-medium text-[var(--admin-primary)] hover:underline"
        >
          Voir tous les projets
        </Link>
      ) : null}
    </div>
  );
}
