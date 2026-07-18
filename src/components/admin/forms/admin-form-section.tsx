import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AdminFormSectionProps = {
  title?: string;
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
        "space-y-4 rounded-xl border border-[var(--admin-border)] bg-white p-4 md:p-5",
        className,
      )}
    >
      {title ? (
        <header className="space-y-1">
          <h2 className="text-base font-semibold text-[var(--admin-text)]">{title}</h2>
          {description ? (
            <p className="text-sm text-[var(--admin-muted)]">{description}</p>
          ) : null}
        </header>
      ) : null}
      <div className="space-y-4">{children}</div>
    </section>
  );
}
