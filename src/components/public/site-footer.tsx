"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.88c0 2.1.55 4.14 1.59 5.95L0 24l6.34-1.66a11.9 11.9 0 0 0 5.7 1.45h.01c6.54 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.16-3.41-8.43zM12.05 21.7h-.01a9.8 9.8 0 0 1-5-.1l-.36-.13-3.76.99 1-3.67-.24-.38a9.82 9.82 0 0 1-1.51-5.25c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.11 1.03 6.97 2.89a9.8 9.8 0 0 1 2.88 6.97c0 5.43-4.42 9.85-9.83 9.85z" />
    </svg>
  );
}

const socialItems = [
  {
    key: "facebook" as const,
    label: "Facebook",
    Icon: FacebookIcon,
    className:
      "bg-[#1877F2] text-white shadow-[0_8px_20px_rgba(24,119,242,0.35)] hover:bg-[#166fe5] hover:shadow-[0_10px_24px_rgba(24,119,242,0.45)]",
  },
  {
    key: "whatsapp" as const,
    label: "WhatsApp",
    Icon: WhatsAppIcon,
    className:
      "bg-[#25D366] text-white shadow-[0_8px_20px_rgba(37,211,102,0.4)] hover:bg-[#1ebe57] hover:shadow-[0_10px_24px_rgba(37,211,102,0.5)]",
  },
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    Icon: LinkedInIcon,
    className:
      "bg-[#0A66C2] text-white shadow-[0_8px_20px_rgba(10,102,194,0.35)] hover:bg-[#095bb0] hover:shadow-[0_10px_24px_rgba(10,102,194,0.45)]",
  },
  {
    key: "youtube" as const,
    label: "YouTube",
    Icon: YouTubeIcon,
    className:
      "bg-[#FF0000] text-white shadow-[0_8px_20px_rgba(255,0,0,0.28)] hover:bg-[#e60000] hover:shadow-[0_10px_24px_rgba(255,0,0,0.4)]",
  },
  {
    key: "tiktok" as const,
    label: "TikTok",
    Icon: TikTokIcon,
    className:
      "bg-[#111111] text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)] ring-1 ring-white/15 hover:bg-black hover:shadow-[0_10px_24px_rgba(0,0,0,0.45)]",
  },
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
        className="flex min-h-11 w-full items-center justify-between py-2.5 text-left text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--afd-gold)] md:pointer-events-none md:min-h-0 md:cursor-default md:py-0"
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
      <div className={cn("pb-3 md:mt-4 md:pb-0", !open && "hidden md:block")}>
        {children}
      </div>
    </div>
  );
}

function FooterEngageBar() {
  return (
    <div className="mt-8 border-t border-white/10 pt-7 md:mt-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <p className="w-full text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--afd-gold)] sm:w-auto sm:mr-1">
            Suivez-nous
          </p>
          <ul className="flex flex-wrap items-center gap-2.5">
            {socialItems.map(({ key, label, Icon, className: brandClass }) => {
              const href = siteConfig.social[key];
              const baseClass = cn(
                "inline-flex size-11 items-center justify-center rounded-2xl transition duration-200 sm:size-12",
                "hover:-translate-y-1 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                brandClass,
                !href && "opacity-80",
              );

              if (href) {
                return (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={baseClass}
                      aria-label={`Suivre l’AFD sur ${label}`}
                      title={label}
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                );
              }

              return (
                <li key={key}>
                  <span
                    className={cn(baseClass, "cursor-default")}
                    title={`${label} — lien à renseigner`}
                    aria-label={`${label} — lien à renseigner`}
                  >
                    <Icon className="size-5" />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Link
            href="/soutenir"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--afd-orange)] px-4 text-sm font-semibold text-white transition hover:brightness-110 sm:px-5"
          >
            Soutenir l’AFD
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 px-4 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5 sm:px-5"
          >
            Nous contacter
          </Link>
          <Link
            href="/ressources/newsletter"
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-3 text-sm font-semibold text-white/80 transition hover:bg-white/5 hover:text-white sm:px-4"
          >
            Newsletter
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  const phoneIsPlaceholder = siteConfig.contact.phone.includes("000 000");
  const actionLinks =
    publicNavigation.find((item) => item.href === "/actions")?.children ?? [];

  return (
    <footer className="mt-auto bg-[var(--afd-dark-navy)] pb-[env(safe-area-inset-bottom)] text-white">
      <div
        className="h-1 w-full bg-gradient-to-r from-[var(--afd-blue)] via-[var(--afd-gold)] to-[var(--afd-orange)]"
        aria-hidden
      />

      <SiteContainer className="py-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src={siteConfig.logo.src}
                alt={siteConfig.logo.alt}
                width={48}
                height={48}
                className="rounded-full object-cover ring-2 ring-white/15"
              />
              <span className="font-display text-lg font-semibold tracking-tight">
                {siteConfig.shortName}
              </span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-white/75">
              {siteConfig.name} — ONG nationale congolaise créée en{" "}
              {homeContent.organization.foundedYear}, engagée auprès des
              communautés vulnérables.
            </p>

            <ul className="mt-5 space-y-2.5 text-sm text-white/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--afd-gold)]" aria-hidden />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-[var(--afd-gold)]" aria-hidden />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="min-h-9 hover:text-white"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-[var(--afd-gold)]" aria-hidden />
                {phoneIsPlaceholder ? (
                  <span>
                    Téléphone :{" "}
                    <em className="not-italic text-white/50">à renseigner</em>
                  </span>
                ) : (
                  <span>{siteConfig.contact.phone}</span>
                )}
              </li>
            </ul>
          </div>

          <FooterAccordion title="Explorer" defaultOpen>
            <ul className="space-y-1 text-sm text-white/78">
              {publicNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center transition hover:text-white md:min-h-0 md:py-1"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          <FooterAccordion title="Nos actions">
            <ul className="space-y-1 text-sm text-white/78">
              {(actionLinks.length > 0
                ? actionLinks
                : homeContent.pillars.map((pillar) => ({
                    label: pillar.title,
                    href: "/actions",
                  }))
              ).map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  {"href" in item && item.href ? (
                    <Link
                      href={item.href}
                      className="inline-flex min-h-9 items-center transition hover:text-white md:min-h-0 md:py-1"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="inline-flex py-1">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </FooterAccordion>

          <FooterAccordion title="S’engager">
            <ul className="space-y-1 text-sm text-white/78">
              {footerLinks.quick.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-9 items-center transition hover:text-white md:min-h-0 md:py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>
        </div>

        <FooterEngageBar />
      </SiteContainer>

      <div className="border-t border-white/10 bg-black/20">
        <SiteContainer className="flex flex-col items-center gap-3 py-4 text-center text-xs text-white/55 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} (
            {siteConfig.shortName}). Tous droits réservés.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {footerLinks.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-8 items-center transition hover:text-white"
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
