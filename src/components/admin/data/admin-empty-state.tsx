import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type AdminEmptyStateProps = ComponentProps<typeof EmptyState>;

export function AdminEmptyState({ className, ...props }: AdminEmptyStateProps) {
  return (
    <EmptyState
      className={cn(
        "border-[var(--admin-border)] bg-white",
        className,
      )}
      {...props}
    />
  );
}
