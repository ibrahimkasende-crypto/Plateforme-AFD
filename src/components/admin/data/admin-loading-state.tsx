import { LoadingState } from "@/components/shared/LoadingState";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type AdminLoadingStateProps = ComponentProps<typeof LoadingState>;

export function AdminLoadingState({ className, ...props }: AdminLoadingStateProps) {
  return (
    <LoadingState
      className={cn("text-[var(--admin-muted)]", className)}
      {...props}
    />
  );
}
