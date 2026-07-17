import { ContentSkeleton } from "@/components/shared/ContentSkeleton";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { cn } from "@/lib/utils";

export function HomeSectionSkeleton({
  cards = 3,
  className,
}: {
  cards?: number;
  className?: string;
}) {
  return (
    <div className={cn("py-12 md:py-16", className)} aria-hidden>
      <SiteContainer>
        <div className="mb-8 max-w-xl space-y-3">
          <div className="h-3 w-28 animate-pulse rounded bg-[var(--afd-border)]" />
          <div className="h-8 w-72 animate-pulse rounded bg-[var(--afd-border)]" />
          <ContentSkeleton rows={2} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-2xl bg-[var(--afd-border)]/70"
            />
          ))}
        </div>
      </SiteContainer>
    </div>
  );
}
