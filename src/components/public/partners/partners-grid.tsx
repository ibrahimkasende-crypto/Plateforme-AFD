import { PartnerLogoCard } from "@/components/public/partners/partner-logo-card";
import type { PublicPartner } from "@/lib/queries/partenaires";
import { cn } from "@/lib/utils";

type PartnersGridProps = {
  partners: PublicPartner[];
  className?: string;
  /** Bandeau défilement automatique (accueil) */
  autoScroll?: boolean;
  size?: "md" | "lg";
  /** Blocs blancs vides sans logos */
  emptyBlocks?: boolean;
};

export function PartnersGrid({
  partners,
  className,
  autoScroll = false,
  size = "md",
  emptyBlocks = false,
}: PartnersGridProps) {
  if (partners.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-black/10 bg-white px-6 py-12 text-center">
        <p className="text-base font-semibold text-[var(--afd-navy)]">
          Partenaires à publier
        </p>
        <p className="mt-2 text-sm text-[var(--afd-muted)]">
          Les logos des organisations partenaires apparaîtront ici dès leur
          publication.
        </p>
      </div>
    );
  }

  if (autoScroll) {
    const loop = [...partners, ...partners];

    return (
      <div className={cn("relative w-full overflow-hidden", className)}>
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-16"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-16"
          aria-hidden
        />
        <div
          className="afd-partners-track flex w-max gap-6 sm:gap-8 md:gap-10"
          role="list"
          aria-label="Logos des partenaires"
        >
          {loop.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              role="listitem"
              className="w-[11.5rem] min-w-[11.5rem] shrink-0 sm:w-[13.5rem] sm:min-w-[13.5rem] md:w-[15rem] md:min-w-[15rem]"
            >
              <PartnerLogoCard
                partner={partner}
                size={size}
                empty={emptyBlocks}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4",
        className,
      )}
    >
      {partners.map((partner) => (
        <PartnerLogoCard
          key={partner.id}
          partner={partner}
          size={size}
          empty={emptyBlocks}
        />
      ))}
    </div>
  );
}
