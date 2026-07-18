import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Droplets,
  HeartPulse,
  LifeBuoy,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { InterventionDomain } from "@/config/intervention-domains";

const iconMap: Record<string, LucideIcon> = {
  HeartPulse,
  Shield,
  Briefcase,
  Users,
  Droplets,
  LifeBuoy,
};

type Props = {
  domain: InterventionDomain;
  index: number;
};

export function InterventionDomainCard({ domain, index }: Props) {
  const Icon = iconMap[domain.icon] ?? HeartPulse;
  const numberLabel = String(index + 1).padStart(2, "0");
  const href = `/actions/domaines-intervention/${domain.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[var(--afd-blue)]/15 bg-white shadow-[0_8px_28px_rgba(6,38,83,0.04)] transition duration-250 hover:border-[var(--afd-blue)]/40 hover:shadow-[0_14px_36px_rgba(6,38,83,0.08)]">
      <Link href={href} className="relative block aspect-[16/10] bg-[var(--afd-light-blue)]">
        {domain.imageSrc ? (
          <Image
            src={domain.imageSrc}
            alt={domain.imageAlt}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--afd-muted)]">
            Image à venir
          </div>
        )}
        <span
          className="absolute left-3 top-3 inline-flex size-10 items-center justify-center rounded-xl bg-white/95 text-[var(--afd-blue)] shadow-sm backdrop-blur-sm"
          aria-hidden
        >
          <Icon className="size-5" />
        </span>
        <span
          className="absolute right-3 top-3 rounded-md bg-[var(--afd-navy)]/80 px-2 py-1 font-heading text-[11px] font-bold tracking-[0.08em] text-white"
          aria-hidden
        >
          {numberLabel}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-7">
        <h3 className="font-heading text-[19px] font-extrabold leading-[1.25] text-[#062653] sm:text-[21px]">
          <Link href={href} className="hover:underline">
            {domain.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-[1.7] text-[#5F6F83] sm:text-[16px]">
          {domain.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {domain.keywords.slice(0, 3).map((keyword) => (
            <span
              key={keyword}
              className="rounded-md bg-[var(--afd-blue)]/6 px-2.5 py-1 text-[12px] font-semibold tracking-wide text-[var(--afd-blue)]"
            >
              {keyword}
            </span>
          ))}
        </div>

        <Link
          href={href}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--afd-orange)] px-4 text-sm font-bold text-white transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--afd-orange)] sm:w-auto sm:justify-start"
        >
          Lire la suite
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
