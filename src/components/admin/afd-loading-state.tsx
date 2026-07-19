import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type AfdLoadingStateProps = {
  label?: string;
  className?: string;
};

/** État de chargement plein écran avec logo AFD (remplace le spinner générique). */
export function AfdLoadingState({
  label = "Chargement…",
  className,
}: AfdLoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
      data-afd-loading-state
    >
      <div className="relative">
        <span className="absolute -inset-2 animate-ping rounded-full bg-[var(--admin-primary)]/20" />
        <span className="relative flex size-16 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-[var(--admin-primary)]/15">
          <Image
            src={siteConfig.logo.src}
            alt=""
            width={64}
            height={64}
            className="size-full animate-[afd-logo-breathe_1.8s_ease-in-out_infinite] object-cover"
            priority
          />
        </span>
      </div>
      <p className="font-display text-sm font-semibold text-[var(--admin-text)]">
        {label}
      </p>
    </div>
  );
}
