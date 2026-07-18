import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "./responsive-container";

/** Shell de contenu page publique — colonne unique mobile, sidebar optionnelle desktop. */
export function MobileContentShell({
  children,
  sidebar,
  className,
}: {
  children: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}) {
  return (
    <ResponsiveContainer className={cn("py-[var(--section-space-mobile)] md:py-12", className)}>
      <div
        className={cn(
          "grid gap-8",
          sidebar && "lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start lg:gap-10",
        )}
      >
        <div className="min-w-0">{children}</div>
        {sidebar ? (
          <aside className="min-w-0 order-first space-y-4 lg:order-none lg:sticky lg:top-24">
            {sidebar}
          </aside>
        ) : null}
      </div>
    </ResponsiveContainer>
  );
}
