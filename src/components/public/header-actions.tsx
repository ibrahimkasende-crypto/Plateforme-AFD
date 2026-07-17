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
        "flex items-center gap-3",
        fullWidth && "w-full flex-col",
        className,
      )}
    >
      {publicCtas.map((cta) => {
        if (cta.variant === "secondary" && !showJoin) return null;
        if (cta.variant === "primary" && !showSupport) return null;

        const Icon = cta.icon === "heart" ? Heart : UserRound;

        return (
          <Link
            key={cta.href}
            href={cta.href}
            onClick={onNavigate}
            className={cn(
              "afd-btn-text inline-flex items-center justify-center gap-2 rounded-lg transition-colors duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)] focus-visible:ring-offset-2",
              compact ? "min-h-10 px-3.5 py-2" : "min-h-11 px-5 py-2.5",
              fullWidth && "w-full",
              cta.variant === "secondary" &&
                "border border-[var(--afd-blue)] bg-white text-[var(--afd-blue)] hover:bg-[var(--afd-light-blue)]",
              cta.variant === "primary" &&
                "bg-[var(--afd-orange)] text-white hover:bg-[var(--afd-orange-hover)]",
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0",
                cta.variant === "primary" && "fill-current",
              )}
              aria-hidden
            />
            <span>
              {compact && cta.variant === "primary" ? "Soutenir" : cta.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
