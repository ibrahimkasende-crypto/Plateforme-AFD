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
  compact?: boolean;
};

export function DashboardAlerts({
  alerts,
  compact = false,
}: DashboardAlertsProps) {
  if (alerts.length === 0) {
    return (
      <p
        className={cn(
          "rounded-lg border border-dashed border-slate-200 text-center text-[var(--admin-muted)]",
          compact ? "px-2 py-4 text-[11px]" : "px-4 py-8 text-sm",
        )}
      >
        Aucune alerte pour le moment.
      </p>
    );
  }

  return (
    <ul className={compact ? "space-y-1.5" : "space-y-3"}>
      {alerts.slice(0, compact ? 4 : undefined).map((alert) => {
        const style = levelStyles[alert.level];
        const Icon = style.Icon;
        return (
          <li key={alert.id}>
            <Link
              href={alert.href}
              className={cn(
                "flex items-start gap-2 rounded-lg border transition hover:opacity-90",
                compact ? "px-2 py-1.5" : "gap-3 px-4 py-3",
                style.container,
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 shrink-0",
                  compact ? "size-3.5" : "size-4",
                  style.icon,
                )}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block font-medium text-slate-900",
                    compact ? "line-clamp-2 text-[11px] leading-snug" : "text-sm",
                  )}
                >
                  {alert.message}
                </span>
                {!compact ? (
                  <span className="mt-0.5 block text-xs text-slate-600">
                    {alert.dateLabel}
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
