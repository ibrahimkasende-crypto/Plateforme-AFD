import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewsExpandablePreview } from "@/components/public/news/news-expandable-preview";
import type { PublicNewsItem } from "@/lib/queries/public/news";

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function FeaturedNewsCard({
  item,
  expandable = true,
}: {
  item: PublicNewsItem;
  expandable?: boolean;
}) {
  const dateLabel = formatDate(item.published_at);

  return (
    <article className="grid overflow-hidden rounded-[22px] border border-[var(--afd-blue)]/15 bg-white shadow-[0_10px_32px_rgba(6,38,83,0.06)] lg:grid-cols-2">
      <Link
        href={`/actualites/${item.slug}`}
        className="relative min-h-[220px] bg-[var(--afd-light-blue)] sm:min-h-[280px]"
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={`Illustration de l’actualité : ${item.title}`}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--afd-muted)]">
            Image à venir
          </div>
        )}
      </Link>
      <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-[var(--afd-muted)] sm:text-[13px]">
          {item.category ? (
            <span className="text-[var(--afd-blue)]">{item.category}</span>
          ) : null}
          {dateLabel ? <time dateTime={item.published_at ?? undefined}>{dateLabel}</time> : null}
        </div>
        <h3 className="font-heading mt-3 text-[25px] font-extrabold leading-[1.2] text-[#062653] sm:text-[28px] lg:text-[31px]">
          <Link href={`/actualites/${item.slug}`} className="hover:underline">
            {item.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 max-w-[65ch] text-[15px] leading-[1.65] text-[#5F6F83] sm:text-[16px]">
          {item.excerpt}
        </p>
        {expandable && item.preview ? (
          <NewsExpandablePreview
            slug={item.slug}
            preview={item.preview}
            className="mt-4"
          />
        ) : null}
        <Link
          href={`/actualites/${item.slug}`}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--afd-orange)] px-4 text-sm font-bold text-white transition hover:opacity-95 sm:w-auto sm:justify-start sm:bg-transparent sm:px-0 sm:text-[var(--afd-orange)]"
        >
          Lire l’article
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
