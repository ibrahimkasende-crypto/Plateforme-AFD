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
        "mb-[var(--afd-section-gap)] max-w-3xl space-y-3",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="afd-label text-[var(--afd-blue)]">{eyebrow}</p>
      ) : null}
      <h2 className="afd-h2">{title}</h2>
      {description ? (
        <p className="afd-prose text-base md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
