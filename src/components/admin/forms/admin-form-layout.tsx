import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AdminFormLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
};

export function AdminFormLayout({
  children,
  title,
  description,
  className,
}: AdminFormLayoutProps) {
  return (
    <div className={cn("mx-auto w-full max-w-3xl space-y-6", className)}>
      {title ? (
        <header className="space-y-1">
          <h1 className="font-display text-2xl font-semibold text-[var(--admin-text)]">
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-[var(--admin-muted)]">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </div>
  );
}
