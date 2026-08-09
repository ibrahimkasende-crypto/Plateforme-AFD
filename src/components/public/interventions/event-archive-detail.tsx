import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, FileText, Images, MapPin } from "lucide-react";
import type { EventArchive } from "@/config/event-archives";
import type { InterventionDomain } from "@/config/intervention-domains";
import {
  formatEventDate,
  formatEventLocation,
  formatEventTime,
} from "@/components/public/interventions/event-archive-format";

export function EventArchiveDetail({
  event,
  domain,
}: {
  event: EventArchive;
  domain: InterventionDomain;
}) {
  const location = formatEventLocation(event);
  const time = formatEventTime(event.startTime);

  return (
    <div className="space-y-8">
      <Link
        href={`/actions/domaines-intervention/${domain.slug}`}
        className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[var(--afd-blue)]"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Retour au domaine
      </Link>

      <article className="overflow-hidden rounded-[22px] border border-[var(--afd-blue)]/15 bg-white shadow-[0_12px_36px_rgba(6,38,83,0.06)]">
        <div className="relative aspect-[21/10] min-h-[240px] bg-[var(--afd-light-blue)]">
          {event.coverImageUrl ? (
            <Image
              src={event.coverImageUrl}
              alt={event.images[0]?.alt ?? event.title}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 1100px"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--afd-navy)]/82 via-[var(--afd-navy)]/18 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-9">
            <p className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
              <Images className="size-3.5" aria-hidden />
              Archive terrain
            </p>
            <h1 className="font-heading mt-3 max-w-4xl text-[28px] font-extrabold leading-tight text-white sm:text-[36px]">
              {event.title}
            </h1>
            <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-white/90 sm:text-base">
              {event.summary}
            </p>
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_320px] lg:p-9">
          <div>
            <p className="text-[16px] leading-[1.8] text-[var(--afd-text)]">
              {event.description}
            </p>

            {event.tags.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-[var(--afd-blue)]/7 px-3 py-1.5 text-[13px] font-semibold text-[var(--afd-blue)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="rounded-[16px] border border-[var(--afd-blue)]/12 bg-[var(--afd-surface)] p-4">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="flex items-center gap-2 font-bold text-[#062653]">
                  <CalendarDays className="size-4 text-[var(--afd-blue)]" aria-hidden />
                  Date et heure
                </dt>
                <dd className="mt-1 text-[#5F6F83]">
                  {formatEventDate(event.eventDate)}
                  {time ? ` · ${time}` : ""}
                  {event.endTime ? `-${formatEventTime(event.endTime)}` : ""}
                </dd>
              </div>
              {location ? (
                <div>
                  <dt className="flex items-center gap-2 font-bold text-[#062653]">
                    <MapPin className="size-4 text-[var(--afd-orange)]" aria-hidden />
                    Lieu
                  </dt>
                  <dd className="mt-1 text-[#5F6F83]">{location}</dd>
                  {event.address ? (
                    <dd className="mt-1 text-[12px] text-[#5F6F83]">{event.address}</dd>
                  ) : null}
                </div>
              ) : null}
              <div>
                <dt className="flex items-center gap-2 font-bold text-[#062653]">
                  <Images className="size-4 text-[var(--afd-blue)]" aria-hidden />
                  Images archivées
                </dt>
                <dd className="mt-1 text-[#5F6F83]">{event.images.length}</dd>
              </div>
              {event.relatedArticleSlug ? (
                <div>
                  <dt className="flex items-center gap-2 font-bold text-[#062653]">
                    <FileText className="size-4 text-[var(--afd-blue)]" aria-hidden />
                    Article lié
                  </dt>
                  <dd className="mt-2">
                    <Link
                      href={`/actualites/${event.relatedArticleSlug}`}
                      className="text-sm font-bold text-[var(--afd-blue)] hover:underline"
                    >
                      {event.relatedArticleTitle ?? "Lire l’article"}
                    </Link>
                  </dd>
                </div>
              ) : null}
            </dl>
          </aside>
        </div>
      </article>

      {event.images.length > 0 ? (
        <section>
          <h2 className="font-heading text-2xl font-extrabold text-[#062653]">
            Galerie de l’activité
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {event.images.map((image) => (
              <figure
                key={image.id}
                className="overflow-hidden rounded-[16px] border border-[var(--afd-blue)]/12 bg-white"
              >
                <div className="relative aspect-[4/3] bg-[var(--afd-light-blue)]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width:768px) 92vw, (max-width:1024px) 45vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="p-4">
                  <p className="text-sm font-bold text-[#062653]">{image.title}</p>
                  {image.caption ? (
                    <p className="mt-1 text-[13px] leading-relaxed text-[#5F6F83]">
                      {image.caption}
                    </p>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
