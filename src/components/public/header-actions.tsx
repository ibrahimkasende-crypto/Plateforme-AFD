import Link from "next/link";
import { HeartHandshake, UserRound } from "lucide-react";
import { publicCtas } from "@/config/public-navigation";
import { cn } from "@/lib/utils";

type HeaderActionsProps = {
  className?: string;
  compact?: boolean;
  onNavigate?: () => void;
  showJoin?: boolean;
  showSupport?: boolean;
  fullWidth?: boolean;
};

export function HeaderActions({
  className,
  compact = false,
  onNavigate,
  showJoin = true,
  showSupport = true,
  fullWidth = false,
}: HeaderActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        fullWidth && "w-full flex-col",
        className,
      )}
    >
      {publicCtas.map((cta) => {
        if (cta.variant === "secondary" && !showJoin) return null;
        if (cta.variant === "primary" && !showSupport) return null;

        const Icon = cta.icon === "heart" ? HeartHandshake : UserRound;

        return (
          <Link
            key={cta.href}
            href={cta.href}
            onClick={onNavigate}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-accent)] focus-visible:ring-offset-2",
              compact ? "min-h-10 px-3 py-2" : "min-h-11 px-4 py-2.5",
              fullWidth && "w-full",
              cta.variant === "secondary" &&
                "border border-[var(--afd-accent)] bg-white text-[var(--afd-accent)] hover:bg-[var(--afd-accent-soft)]",
              cta.variant === "primary" &&
                "bg-[var(--afd-support)] text-white hover:bg-[var(--afd-support-strong)]",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span>{compact && cta.variant === "primary" ? "Soutenir" : cta.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
