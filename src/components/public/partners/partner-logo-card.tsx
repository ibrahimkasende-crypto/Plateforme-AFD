import Image from "next/image";
import type { PublicPartner } from "@/lib/queries/partenaires";
import { cn } from "@/lib/utils";

type PartnerLogoCardProps = {
  partner: PublicPartner;
  className?: string;
};

function PartnerMark({ partner }: { partner: PublicPartner }) {
  if (partner.logo_url) {
    return (
      <Image
        src={partner.logo_url}
        alt={`Logo ${partner.name}`}
        width={200}
        height={120}
        className="max-h-16 w-auto max-w-full object-contain transition duration-200 group-hover:opacity-100 sm:max-h-20"
      />
    );
  }

  const label = partner.acronyme || partner.name;
  return (
    <span
      className="px-2 text-center text-xs font-semibold uppercase tracking-wide text-[var(--afd-navy)]/70 sm:text-sm"
      aria-hidden={false}
    >
      {label}
    </span>
  );
}

export function PartnerLogoCard({ partner, className }: PartnerLogoCardProps) {
  const content = (
    <div
      className={cn(
        "group flex h-28 w-full flex-col items-center justify-center gap-2 rounded-md border border-black/5 bg-white px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-black/10",
        className,
      )}
    >
      <div className="flex h-16 w-full items-center justify-center sm:h-20">
        <PartnerMark partner={partner} />
      </div>
      <p className="line-clamp-2 text-center text-[11px] font-medium text-[var(--afd-muted)] opacity-0 transition duration-200 group-hover:opacity-100 sm:text-xs">
        {partner.name}
      </p>
    </div>
  );

  if (partner.website_url) {
    return (
      <a
        href={partner.website_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Site officiel de ${partner.name} (nouvel onglet)`}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--afd-blue)]"
      >
        {content}
      </a>
    );
  }

  return content;
}
