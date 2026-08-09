import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Images, MapPin } from "lucide-react";
import type { EventArchive } from "@/config/event-archives";
import {
  formatEventDate,
  formatEventLocation,
  formatEventTime,
} from "@/components/public/interventions/event-archive-format";

export function EventArchiveCard({
  event,
  domainSlug,
}: {
  event: EventArchive;
  domainSlug: string;
}) {
  const href = `/actions/domaines-intervention/${domainSlug}/archives/${event.slug}`;
  const location = formatEventLocation(event);
  const time = formatEventTime(event.startTime);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[var(--afd-blue)]/15 bg-white shadow-[0_10px_28px_rgba(6,38,83,0.05)] transition hover:border-[var(--afd-blue)]/35 hover:shadow-[0_16px_36px_rgba(6,38,83,0.08)]">
      <Link href={href} className="relative block aspect-[16/10] bg-[var(--afd-light-blue)]">
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt={event.images[0]?.alt ?? event.title}
            fill
            sizes="(max-width:768px) 92vw, (max-width:1024px) 45vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--afd-muted)]">
            Image à venir
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1 text-[12px] font-bold text-[var(--afd-blue)] shadow-sm">
          <Images className="size-3.5" aria-hidden />
          {event.images.length}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2 text-[12px] font-semibold text-[#5F6F83]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-[var(--afd-blue)]" aria-hidden />
            {formatEventDate(event.eventDate)}
            {time ? ` · ${time}` : ""}
          </span>
          {location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-[var(--afd-orange)]" aria-hidden />
              {location}
            </span>
          ) : null}
        </div>

        <h3 className="font-heading mt-3 text-[18px] font-extrabold leading-tight text-[#062653]">
          <Link href={href} className="hover:underline">
            {event.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-[14px] leading-[1.65] text-[#5F6F83]">
          {event.summary}
        </p>

        {event.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[var(--afd-blue)]/6 px-2.5 py-1 text-[12px] font-semibold text-[var(--afd-blue)]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <Link
          href={href}
          className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[var(--afd-blue)]"
        >
          Voir l’archive
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
