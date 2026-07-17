import Link from "next/link";
import { cn } from "@/lib/utils";

type CardBaseProps = {
  title: string;
  description?: string;
  href?: string;
  meta?: string;
  className?: string;
};

function CardShell({
  title,
  description,
  href,
  meta,
  className,
}: CardBaseProps) {
  const content = (
    <article
      className={cn(
        "h-full rounded-2xl border border-[var(--afd-border)] bg-white p-5 transition hover:border-[var(--afd-accent)]/40 hover:shadow-sm",
        className,
      )}
    >
      {meta ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--afd-accent)]">
          {meta}
        </p>
      ) : null}
      <h3 className="font-display text-lg font-semibold text-[var(--afd-ink)]">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
          {description}
        </p>
      ) : null}
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

export function ProgramCard(props: CardBaseProps) {
  return <CardShell {...props} />;
}

export function ProjectCard(props: CardBaseProps) {
  return <CardShell {...props} />;
}

export function NewsCard(props: CardBaseProps) {
  return <CardShell {...props} />;
}

export function ImpactStoryCard(props: CardBaseProps) {
  return <CardShell {...props} />;
}

export function PartnerCard(props: CardBaseProps) {
  return <CardShell {...props} />;
}
