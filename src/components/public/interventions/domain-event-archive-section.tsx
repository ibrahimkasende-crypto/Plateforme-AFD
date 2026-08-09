import Link from "next/link";
import { Archive, ArrowRight } from "lucide-react";
import type { EventArchive } from "@/config/event-archives";
import type { InterventionDomain } from "@/config/intervention-domains";
import { EventArchiveCard } from "@/components/public/interventions/event-archive-card";

export function DomainEventArchiveSection({
  domain,
  events,
}: {
  domain: InterventionDomain;
  events: EventArchive[];
}) {
  return (
    <section className="mt-12 border-t border-[var(--afd-border)] pt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-[var(--afd-blue)]">
            <Archive className="size-4" aria-hidden />
            Archives du domaine
          </p>
          <h2 className="font-heading mt-2 text-2xl font-extrabold text-[#062653]">
            Événements, images et preuves terrain
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-[1.7] text-[#5F6F83]">
            Chaque archive rattache les photos, les dates et les lieux aux actions
            menées dans le domaine « {domain.title} ».
          </p>
        </div>
        <Link
          href="/actualites"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[var(--afd-blue)]"
        >
          Actualités associées
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      {events.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventArchiveCard key={event.id} event={event} domainSlug={domain.slug} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[18px] border border-dashed border-[var(--afd-blue)]/20 bg-white p-6 text-sm leading-relaxed text-[#5F6F83]">
          Aucune archive publiée pour ce domaine pour le moment. Les prochaines
          activités pourront être ajoutées depuis le dashboard administrateur.
        </div>
      )}
    </section>
  );
}
