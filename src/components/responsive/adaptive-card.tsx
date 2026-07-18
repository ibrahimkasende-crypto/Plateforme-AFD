import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Carte adaptative par container query :
 * - étroite (< 340px) : image dessus, contenu dessous
 * - moyenne (≥ 340px) : image latérale compacte
 * - large (≥ 480px) : composition éditoriale
 */
export function AdaptiveCard({
  media,
  children,
  className,
  mediaClassName,
  bodyClassName,
  as: Tag = "article",
  /** Empêche le layout image latérale (rails mobiles). */
  stackOnly = false,
}: {
  media?: ReactNode;
  children: ReactNode;
  className?: string;
  mediaClassName?: string;
  bodyClassName?: string;
  as?: "article" | "div" | "li";
  stackOnly?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "@container/card group flex h-full min-w-0 w-full flex-col overflow-hidden",
        "rounded-[18px] border border-[var(--afd-border)] bg-white shadow-[0_8px_28px_rgba(6,38,83,0.05)]",
        !stackOnly && "@min-[340px]/card:flex-row @min-[480px]/card:flex-col",
        className,
      )}
    >
      {media ? (
        <div
          className={cn(
            "relative shrink-0 overflow-hidden w-full",
            !stackOnly &&
              "@min-[340px]/card:w-[38%] @min-[340px]/card:self-stretch @min-[480px]/card:w-full",
            mediaClassName,
          )}
        >
          {media}
        </div>
      ) : null}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col p-4",
          "@min-[280px]/card:p-5 @min-[480px]/card:p-6",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
