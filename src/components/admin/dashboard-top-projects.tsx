import Image from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import type { TopProject } from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

type DashboardTopProjectsProps = {
  projects: TopProject[];
  className?: string;
};

function formatBeneficiaries(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function DashboardTopProjects({
  projects,
  className,
}: DashboardTopProjectsProps) {
  if (projects.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
        Aucun projet disponible pour cette sélection.
      </p>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <ol className="space-y-3">
        {projects.slice(0, 5).map((project, index) => (
          <li key={project.id}>
            <Link
              href={`/admin/projets/${project.id}`}
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-slate-200 hover:bg-slate-50"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0d254e]/10 text-xs font-semibold text-[#0d254e]">
                {index + 1}
              </span>
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                  <Users className="size-5" aria-hidden />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-900">
                  {project.title}
                </span>
                {project.location ? (
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="size-3" aria-hidden />
                    {project.location}
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-sm font-semibold text-[#0877d1]">
                  {formatBeneficiaries(project.beneficiaries)}
                </span>
                <span className="text-xs text-slate-500">bénéf.</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <Link
        href="/admin/projets"
        className="inline-flex text-sm font-medium text-[#2563eb] hover:underline"
      >
        Voir tous les projets
      </Link>
    </div>
  );
}
