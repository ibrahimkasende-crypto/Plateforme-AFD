import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Droplets,
  HeartPulse,
  LifeBuoy,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import { InterventionDomainContent } from "@/components/public/interventions/intervention-domain-content";
import { SecondaryPageBack } from "@/components/public/secondary-page-back";
import type { InterventionDomain } from "@/config/intervention-domains";

const iconMap: Record<string, LucideIcon> = {
  HeartPulse,
  Shield,
  Briefcase,
  Users,
  Droplets,
  LifeBuoy,
};

export function InterventionDomainDetail({
  domain,
  related = [],
}: {
  domain: InterventionDomain;
  related?: InterventionDomain[];
}) {
  const Icon = iconMap[domain.icon] ?? HeartPulse;

  return (
    <div className="space-y-10">
      <SecondaryPageBack
        href="/actions/domaines-intervention"
        label="Retour aux domaines"
        variant="light"
      />

      <div className="overflow-hidden rounded-[22px] border border-[var(--afd-blue)]/15 bg-white shadow-[0_12px_36px_rgba(6,38,83,0.06)]">
        <div className="relative aspect-[21/10] min-h-[220px] bg-[var(--afd-light-blue)] sm:min-h-[280px] lg:min-h-[360px]">
          {domain.imageSrc ? (
            <Image
              src={domain.imageSrc}
              alt={domain.imageAlt}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 1100px"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--afd-navy)]/75 via-[var(--afd-navy)]/15 to-transparent" />
          <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
            <SecondaryPageBack
              href="/actions/domaines-intervention"
              label="Retour aux domaines d’intervention"
              variant="overlay"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-9">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold tracking-wide text-white backdrop-blur-sm">
              <Icon className="size-3.5" aria-hidden />
              Domaine d’intervention
            </div>
            <h1 className="font-heading mt-3 max-w-3xl text-[28px] font-extrabold leading-[1.15] text-white sm:text-[34px] lg:text-[40px]">
              {domain.title}
            </h1>
            {domain.subtitle ? (
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-base">
                {domain.subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[720px]">
        <p className="text-[17px] leading-[1.8] text-[#5F6F83] sm:text-[18px]">
          {domain.summary}
        </p>
        <p className="mt-5 text-[16px] leading-[1.8] text-[var(--afd-text)] sm:text-[17px]">
          {domain.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {domain.keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-md bg-[var(--afd-blue)]/8 px-3 py-1.5 text-[13px] font-semibold text-[var(--afd-blue)]"
            >
              {keyword}
            </span>
          ))}
        </div>

        <div className="mt-10">
          <InterventionDomainContent domain={domain} showProgrammesLink />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/actions/domaines-intervention"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--afd-border)] px-4 text-sm font-semibold text-[var(--afd-blue)]"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Tous les domaines
          </Link>
          <Link
            href="/actions/programmes"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--afd-orange)] px-4 text-sm font-bold text-white"
          >
            Voir les programmes
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="border-t border-[var(--afd-border)] pt-10">
          <h2 className="font-heading text-xl font-extrabold text-[#062653]">
            Autres domaines
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/actions/domaines-intervention/${item.slug}`}
                  className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-[var(--afd-blue)]/15 bg-white px-4 py-3 text-sm font-semibold text-[var(--afd-navy)] transition hover:border-[var(--afd-blue)]/40"
                >
                  <span className="line-clamp-2">{item.title}</span>
                  <ArrowRight className="size-4 shrink-0 text-[var(--afd-blue)]" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
