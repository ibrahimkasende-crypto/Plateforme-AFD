import { PartnerLogoCard } from "@/components/public/partners/partner-logo-card";
import type { PublicPartner } from "@/lib/queries/partenaires";
import { cn } from "@/lib/utils";

type PartnersGridProps = {
  partners: PublicPartner[];
  className?: string;
  /** Variante mobile : scroll horizontal avec snap */
  mobileScroll?: boolean;
};

export function PartnersGrid({
  partners,
  className,
  mobileScroll = true,
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

  return (
    <div className={cn("w-full", className)}>
      {mobileScroll ? (
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="w-[46%] min-w-[46%] shrink-0 snap-start"
            >
              <PartnerLogoCard partner={partner} />
            </div>
          ))}
        </div>
      ) : null}

      <div
        className={cn(
          "grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
          mobileScroll && "hidden md:grid",
          !mobileScroll && "grid-cols-2",
        )}
      >
        {partners.map((partner) => (
          <PartnerLogoCard key={partner.id} partner={partner} />
        ))}
      </div>
    </div>
  );
}
