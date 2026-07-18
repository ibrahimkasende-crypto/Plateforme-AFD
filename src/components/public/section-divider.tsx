import { cn } from "@/lib/utils";

export type SectionDividerVariant =
  | "wave-soft"
  | "curve"
  | "diagonal"
  | "line"
  | "none";

export function SectionDivider({
  variant = "line",
  className,
  from = "var(--afd-background)",
  to = "var(--afd-surface)",
}: {
  variant?: SectionDividerVariant;
  className?: string;
  from?: string;
  to?: string;
}) {
  if (variant === "none") return null;

  if (variant === "line") {
    return (
      <div
        aria-hidden
        className={cn("mx-auto h-px w-[min(100%,42rem)] bg-[var(--afd-border)]/70", className)}
      />
    );
  }

  if (variant === "diagonal") {
    return (
      <div
        aria-hidden
        className={cn("relative h-10 w-full overflow-hidden", className)}
        style={{ background: from }}
      >
        <div
          className="absolute inset-0 origin-top-left scale-y-[1.02]"
          style={{
            background: to,
            clipPath: "polygon(0 55%, 100% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>
    );
  }

  if (variant === "curve") {
    return (
      <div aria-hidden className={cn("relative h-12 w-full", className)} style={{ background: from }}>
        <svg
          className="absolute inset-x-0 bottom-0 h-12 w-full"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          fill={to}
        >
          <path d="M0,24 C360,48 1080,0 1440,24 L1440,48 L0,48 Z" />
        </svg>
      </div>
    );
  }

  // wave-soft
  return (
    <div aria-hidden className={cn("relative h-14 w-full", className)} style={{ background: from }}>
      <svg
        className="absolute inset-x-0 bottom-0 h-14 w-full text-[color:var(--wave-fill)]"
        style={{ ["--wave-fill" as string]: to }}
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,28 C240,52 480,4 720,28 C960,52 1200,8 1440,28 L1440,56 L0,56 Z" />
      </svg>
    </div>
  );
}
