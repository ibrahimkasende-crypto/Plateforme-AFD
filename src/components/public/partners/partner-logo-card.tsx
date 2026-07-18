import Image from "next/image";
import type { PublicPartner } from "@/lib/queries/partenaires";
import { cn } from "@/lib/utils";

type PartnerLogoCardProps = {
  partner: PublicPartner;
  className?: string;
  size?: "md" | "lg";
  /** Bloc blanc vide (sans image) — utile si besoin d’un placeholder */
  empty?: boolean;
};

function PartnerMark({
  partner,
  size,
}: {
  partner: PublicPartner;
  size: "md" | "lg";
}) {
  if (partner.logo_url) {
    return (
      <Image
        src={partner.logo_url}
        alt={`Logo ${partner.name}`}
        width={size === "lg" ? 280 : 220}
        height={size === "lg" ? 180 : 140}
        className={cn(
          "w-auto max-w-full object-contain opacity-95 transition duration-200 group-hover:opacity-100 group-hover:-translate-y-0.5",
          size === "lg"
            ? "max-h-[7.5rem] sm:max-h-36 md:max-h-40"
            : "max-h-24 sm:max-h-28",
        )}
      />
    );
  }

  const label = partner.acronyme || partner.name;
  return (
    <span
      className={cn(
        "px-3 text-center font-semibold uppercase tracking-wide text-[var(--afd-navy)]/80",
        size === "lg" ? "text-sm sm:text-base" : "text-xs sm:text-sm",
      )}
    >
      {label}
    </span>
  );
}

export function PartnerLogoCard({
  partner,
  className,
  size = "md",
  empty = false,
}: PartnerLogoCardProps) {
  const content = (
    <div
      className={cn(
        "group flex w-full flex-col items-center justify-center transition duration-200",
        empty
          ? "rounded-lg border border-black/[0.06] bg-white"
          : "bg-transparent",
        size === "lg"
          ? "h-[11.5rem] px-4 py-4 sm:h-[13rem]"
          : "h-36 px-3 py-3 sm:h-40",
        className,
      )}
    >
      {empty ? (
        <span className="sr-only">{partner.name}</span>
      ) : (
        <>
          <div
            className={cn(
              "flex w-full items-center justify-center",
              size === "lg" ? "h-[7.5rem] sm:h-36 md:h-40" : "h-24 sm:h-28",
            )}
          >
            <PartnerMark partner={partner} size={size} />
          </div>
          <p className="sr-only">{partner.name}</p>
        </>
      )}
    </div>
  );

  if (partner.website_url && !empty) {
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
