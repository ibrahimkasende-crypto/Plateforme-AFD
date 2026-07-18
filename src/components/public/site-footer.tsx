"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { footerLinks, publicNavigation } from "@/config/public-navigation";
import { homeContent } from "@/config/home-content";
import { siteConfig } from "@/config/site";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { cn } from "@/lib/utils";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M14 8.5V6.8c0-.7.1-1.1 1.1-1.1H16.5V3h-2.3C11.6 3 10.5 4.4 10.5 6.6v1.9H8.5V11h2v10h3.5V11h2.4l.4-2.5H14z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M6.3 9.3H3.6V20h2.7V9.3zM4.9 4C4 4 3.3 4.7 3.3 5.6S4 7.2 4.9 7.2 6.5 6.5 6.5 5.6 5.8 4 4.9 4zM20.4 12.2c0-2.4-1.3-4-3.8-4-1.3 0-2.2.6-2.6 1.3h-.1V9.3h-2.6c0 .8 0 10.7 0 10.7h2.7v-6c0-.3 0-.6.1-.9.3-.6.9-1.3 1.9-1.3 1.4 0 1.9 1 1.9 2.5V20h2.7v-6.3c0-3.2-.7-5.5-4.2-5.5z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M21.6 7.2c-.2-.8-.8-1.4-1.6-1.6C18.4 5.2 12 5.2 12 5.2s-6.4 0-8 .4c-.8.2-1.4.8-1.6 1.6C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.8.8 1.4 1.6 1.6 1.6.4 8 .4 8 .4s6.4 0 8-.4c.8-.2 1.4-.8 1.6-1.6.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15.2V8.8l5.2 3.2L10 15.2z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.16 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.18 8.18 0 0 0 4.76 1.52V6.79a4.85 4.85 0 0 1-1.01-.1z" />
    </svg>
  );
}

const socialItems = [
  { key: "facebook" as const, label: "Facebook", Icon: FacebookIcon },
  { key: "linkedin" as const, label: "LinkedIn", Icon: LinkedInIcon },
  { key: "youtube" as const, label: "YouTube", Icon: YouTubeIcon },
  { key: "tiktok" as const, label: "TikTok", Icon: TikTokIcon },
];

function FooterAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10 md:border-0">
      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between py-2.5 text-left text-[14px] font-semibold uppercase tracking-wide text-[var(--afd-gold)] md:pointer-events-none md:min-h-0 md:cursor-default md:py-0"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {title}
        <ChevronDown
          className={cn(
            "size-4 text-white/70 transition md:hidden",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <div className={cn("pb-3 md:mt-2.5 md:pb-0", !open && "hidden md:block")}>
        {children}
      </div>
    </div>
  );
}

export function SiteFooter() {
  const phoneIsPlaceholder = siteConfig.contact.phone.includes("000 000");

  return (
    <footer className="mt-auto border-t border-[var(--afd-border)] bg-[var(--afd-dark-navy)] pb-[env(safe-area-inset-bottom)] text-white">
      <SiteContainer className="grid gap-6 py-8 md:grid-cols-2 md:gap-6 md:py-10 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:gap-x-8 lg:gap-y-6">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image
              src={siteConfig.logo.src}
              alt={siteConfig.logo.alt}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="font-display text-base font-semibold">
              {siteConfig.shortName}
            </span>
          </Link>
          <p className="mt-3 text-[13px] leading-snug text-white/75">
            {siteConfig.name} — ONG nationale congolaise créée en{" "}
            {homeContent.organization.foundedYear}, engagée auprès des
            communautés vulnérables.
          </p>

          <div className="mt-3 space-y-1 text-[13px] leading-snug text-white/80">
            <p className="text-[14px] font-semibold text-[var(--afd-gold)] md:hidden">
              Contact
            </p>
            <p>{siteConfig.contact.address}</p>
            <p>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex min-h-9 items-center hover:text-white"
              >
                {siteConfig.contact.email}
              </a>
            </p>
            <p>
              {phoneIsPlaceholder ? (
                <span>
                  Téléphone :{" "}
                  <em className="not-italic text-white/55">à renseigner</em>
                </span>
              ) : (
                siteConfig.contact.phone
              )}
            </p>
          </div>

          <ul className="mt-3.5 flex flex-wrap gap-2">
            {socialItems.map(({ key, label, Icon }) => {
              const href = siteConfig.social[key];
              const className = cn(
                "inline-flex size-9 items-center justify-center rounded-full border border-white/25 text-white/90 transition",
                href
                  ? "hover:border-white/55 hover:bg-white/10 hover:text-white"
                  : "cursor-default opacity-55",
              );

              if (href) {
                return (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className={className}
                      aria-label={label}
                      title={label}
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                );
              }

              return (
                <li key={key}>
                  <span
                    className={className}
                    title={`${label} — lien à renseigner`}
                    aria-label={`${label} — lien à renseigner`}
                  >
                    <Icon className="size-4" />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <FooterAccordion title="Liens rapides" defaultOpen>
          <ul className="space-y-0.5 text-[13px] text-white/80">
            {publicNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-9 items-center hover:text-white md:min-h-0 md:py-0.5"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterAccordion>

        <FooterAccordion title="Nos actions">
          <ul className="space-y-0.5 text-[13px] text-white/80">
            {homeContent.pillars.map((pillar) => (
              <li key={pillar.id} className="py-1 md:py-0.5">
                {pillar.title}
              </li>
            ))}
          </ul>
        </FooterAccordion>

        <FooterAccordion title="Ressources">
          <ul className="space-y-0.5 text-[13px] text-white/80">
            {footerLinks.quick.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-9 items-center hover:text-white md:min-h-0 md:py-0.5"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterAccordion>
      </SiteContainer>

      <div className="border-t border-white/10">
        <SiteContainer className="flex flex-col items-center gap-2 py-3 text-center text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} ({siteConfig.shortName}).
            Tous droits réservés.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {footerLinks.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-8 items-center hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </SiteContainer>
      </div>
    </footer>
  );
}
