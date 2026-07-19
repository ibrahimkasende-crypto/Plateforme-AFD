import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminFormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function AdminFormSection({
  title,
  description,
  children,
  className,
}: AdminFormSectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[var(--admin-border)] bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="mb-4 border-b border-slate-100 pb-3">
        <h2 className="font-display text-base font-bold text-[var(--admin-text)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-[var(--admin-muted)]">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
