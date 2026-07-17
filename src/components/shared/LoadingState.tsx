import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({
  label = "Chargement…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 py-16 text-[var(--adf-muted)]",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="size-5 animate-spin" aria-hidden />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
