import { cn } from "@/lib/utils";

export function ContentSkeleton({
  rows = 3,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("animate-pulse space-y-3", className)} aria-hidden>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-4 rounded bg-[var(--adf-border)]"
          style={{ width: `${100 - index * 12}%` }}
        />
      ))}
    </div>
  );
}
