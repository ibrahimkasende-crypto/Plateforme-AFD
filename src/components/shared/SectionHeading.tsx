import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  eyebrow,
  align = "left",
  className,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 max-w-3xl space-y-3",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--adf-accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--adf-ink)] md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-[var(--adf-muted)] md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
