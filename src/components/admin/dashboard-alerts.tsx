import Link from "next/link";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { DashboardAlert } from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

const levelStyles = {
  info: {
    container: "border-sky-200 bg-sky-50",
    icon: "text-sky-600",
    Icon: Info,
  },
  warning: {
    container: "border-amber-200 bg-amber-50",
    icon: "text-amber-600",
    Icon: AlertTriangle,
  },
  critical: {
    container: "border-red-200 bg-red-50",
    icon: "text-red-600",
    Icon: AlertCircle,
  },
} as const;

type DashboardAlertsProps = {
  alerts: DashboardAlert[];
};

export function DashboardAlerts({ alerts }: DashboardAlertsProps) {
  if (alerts.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
        Aucune alerte pour le moment.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {alerts.map((alert) => {
        const style = levelStyles[alert.level];
        const Icon = style.Icon;
        return (
          <li key={alert.id}>
            <Link
              href={alert.href}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3 transition hover:opacity-90",
                style.container,
              )}
            >
              <Icon className={cn("mt-0.5 size-4 shrink-0", style.icon)} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-slate-900">
                  {alert.message}
                </span>
                <span className="mt-0.5 block text-xs text-slate-600">
                  {alert.dateLabel}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
