import Link from "next/link";
import { Heart, UserRound } from "lucide-react";
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
        fullWidth && "w-full flex-col gap-2.5",
        className,
      )}
    >
      {publicCtas.map((cta) => {
        if (cta.variant === "secondary" && !showJoin) return null;
        if (cta.variant === "primary" && !showSupport) return null;

        const Icon = cta.icon === "heart" ? Heart : UserRound;
        const shortLabel =
          cta.variant === "primary" ? "Soutenir" : cta.label;

        return (
          <Link
            key={cta.href}
            href={cta.href}
            onClick={onNavigate}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-md text-[12px] font-semibold tracking-[0.01em] transition-colors duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)] focus-visible:ring-offset-2",
              compact ? "min-h-11 px-2.5 py-2 sm:min-h-9 sm:py-1.5" : "min-h-11 px-3 py-2 sm:min-h-9 sm:py-1.5",
              fullWidth && "w-full min-h-12 text-[13px]",
              cta.variant === "secondary" &&
                "border border-[var(--afd-blue)] bg-[var(--afd-surface-elevated)] text-[var(--afd-blue)] hover:bg-[var(--afd-light-blue)]",
              cta.variant === "primary" &&
                "bg-[var(--afd-orange)] text-white hover:bg-[var(--afd-orange-hover)]",
            )}
          >
            <Icon
              className={cn(
                "size-3.5 shrink-0",
                cta.variant === "primary" && "fill-current",
              )}
              aria-hidden
            />
            <span className="max-w-[9rem] truncate sm:max-w-none">
              {fullWidth ? cta.label : shortLabel}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
