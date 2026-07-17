import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PublicEntityCard({
  title,
  description,
  href,
  imageUrl,
  meta,
  className,
}: {
  title: string;
  description?: string;
  href: string;
  imageUrl?: string | null;
  meta?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface-elevated)] transition hover:border-[var(--afd-blue)]/40 hover:shadow-sm",
        className,
      )}
    >
      <div className="relative aspect-[16/10] bg-[var(--afd-light-blue)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-[var(--afd-muted)]">
            Image à venir
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {meta ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--afd-accent)]">
            {meta}
          </p>
        ) : null}
        <h3 className="font-display text-lg font-semibold text-[var(--afd-ink)]">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--afd-muted)]">
            {description}
          </p>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--afd-blue)]">
          En savoir plus
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function PublicHubCard({
  title,
  description,
  href,
  className,
}: {
  title: string;
  description: string;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-[var(--afd-border)] bg-white p-6 transition hover:border-[var(--afd-blue)]/40 hover:shadow-sm",
        className,
      )}
    >
      <h3 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--afd-muted)]">
        {description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--afd-blue)]">
        Explorer
        <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
