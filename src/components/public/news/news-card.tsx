import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[20px] border border-[var(--afd-blue)]/12 bg-white shadow-[0_8px_28px_rgba(6,38,83,0.05)] transition duration-250 hover:-translate-y-0.5 hover:border-[var(--afd-blue)]/35 hover:shadow-[0_16px_40px_rgba(6,38,83,0.1)]">
      <Link
        href={`/actualites/${item.slug}`}
        className="relative block aspect-[16/10] bg-[var(--afd-light-blue)]"
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={`Illustration : ${item.title}`}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition duration-400 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--afd-muted)]">
            Image à venir
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-[var(--afd-muted)] uppercase">
          {item.category ? (
            <span className="rounded-md bg-[var(--afd-blue)]/8 px-2 py-1 text-[var(--afd-blue)] normal-case tracking-normal">
              {item.category}
            </span>
          ) : null}
          {dateLabel ? (
            <time dateTime={item.published_at ?? undefined}>{dateLabel}</time>
          ) : null}
        </div>

        <h3 className="font-heading mt-3 text-[18px] font-extrabold leading-[1.3] text-[#062653] sm:text-[19px]">
          <Link href={`/actualites/${item.slug}`} className="hover:underline">
            {item.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 flex-1 text-[14px] leading-[1.65] text-[#5F6F83] sm:text-[15px]">
          {item.excerpt}
        </p>

        <Link
          href={`/actualites/${item.slug}`}
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--afd-orange)] transition hover:gap-2.5"
        >
          Lire la suite
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
