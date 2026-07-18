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

export function NewsCard({
  item,
  expandable = false,
}: {
  item: PublicNewsItem;
  expandable?: boolean;
}) {
  const dateLabel = formatDate(item.published_at);

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[18px] border border-[var(--afd-blue)]/15 bg-white shadow-[0_8px_24px_rgba(6,38,83,0.04)] transition duration-200 hover:border-[var(--afd-blue)]/35">
      <Link href={`/actualites/${item.slug}`} className="relative block aspect-[16/10] bg-[var(--afd-light-blue)]">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={`Illustration de l’actualité : ${item.title}`}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--afd-muted)]">
            Image à venir
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.04em] text-[var(--afd-muted)] sm:text-[13px]">
          {item.category ? (
            <span className="text-[var(--afd-blue)]">{item.category}</span>
          ) : null}
          {dateLabel ? <time dateTime={item.published_at ?? undefined}>{dateLabel}</time> : null}
        </div>
        <h3 className="font-heading mt-2 text-[18px] font-bold leading-[1.3] text-[#062653] sm:text-[20px]">
          <Link href={`/actualites/${item.slug}`} className="hover:underline">
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 font-[family-name:var(--font-body)] text-[14px] leading-[1.65] text-[#5F6F83] sm:text-[15px]">
          {item.excerpt}
        </p>
        {expandable && item.preview ? (
          <NewsExpandablePreview
            slug={item.slug}
            preview={item.preview}
            className="mt-3"
          />
        ) : (
          <Link
            href={`/actualites/${item.slug}`}
            className="afd-btn-text mt-auto inline-flex min-h-10 items-center gap-2 pt-4 text-[var(--afd-blue)]"
          >
            Lire l’article
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        )}
      </div>
    </article>
  );
}
