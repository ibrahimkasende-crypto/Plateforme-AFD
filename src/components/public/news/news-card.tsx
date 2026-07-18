import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CqCard } from "@/components/public/cards/cq-card";
import type { PublicNewsItem } from "@/lib/queries/public/news";

function formatShortDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function NewsCard({ item }: { item: PublicNewsItem }) {
  const dateLabel = formatShortDate(item.published_at);

  return (
    <CqCard as="article" className="h-full">
      <div className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[18px] border border-[var(--afd-blue)]/12 bg-white shadow-[0_8px_28px_rgba(6,38,83,0.05)] transition duration-250 hover:-translate-y-0.5 hover:border-[var(--afd-blue)]/35 hover:shadow-[0_16px_40px_rgba(6,38,83,0.1)] @min-[280px]/card:rounded-[20px]">
        <Link
          href={`/actualites/${item.slug}`}
          className="relative block aspect-[16/10] bg-[var(--afd-light-blue)]"
        >
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={`Illustration : ${item.title}`}
              fill
              sizes="(max-width:768px) 86vw, (max-width:1024px) 50vw, 33vw"
              className="object-cover transition duration-400 group-hover:scale-[1.025]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--afd-muted)]">
              Image à venir
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col p-4 @min-[260px]/card:p-5 @min-[320px]/card:p-6">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-[0.04em] text-[var(--afd-muted)] uppercase @min-[280px]/card:text-[12px]">
            {item.category ? (
              <span className="rounded-md bg-[var(--afd-blue)]/8 px-2 py-1 text-[var(--afd-blue)] normal-case tracking-normal">
                {item.category}
              </span>
            ) : null}
            {dateLabel ? (
              <time dateTime={item.published_at ?? undefined}>{dateLabel}</time>
            ) : null}
          </div>

          <h3 className="font-heading mt-2.5 text-[16px] font-extrabold leading-[1.3] text-[#062653] @min-[280px]/card:mt-3 @min-[280px]/card:text-[18px] @min-[320px]/card:text-[19px]">
            <Link href={`/actualites/${item.slug}`} className="hover:underline">
              {item.title}
            </Link>
          </h3>

          <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-[1.65] text-[#5F6F83] @min-[280px]/card:mt-3 @min-[280px]/card:text-[14px] @min-[320px]/card:text-[15px]">
            {item.excerpt}
          </p>

          <Link
            href={`/actualites/${item.slug}`}
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--afd-orange)] transition hover:gap-2.5 @min-[280px]/card:mt-5"
          >
            Lire la suite
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </CqCard>
  );
}
