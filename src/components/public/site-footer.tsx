import Image from "next/image";
import Link from "next/link";
import { footerLinks, publicNavigation } from "@/config/public-navigation";
import { homeContent } from "@/config/home-content";
import { siteConfig } from "@/config/site";
import { SiteContainer } from "@/components/shared/SiteContainer";

export function SiteFooter() {
  const phoneIsPlaceholder = siteConfig.contact.phone.includes("000 000");

  return (
    <footer className="mt-auto border-t border-[var(--afd-border)] bg-[var(--afd-ink)] text-white">
      <SiteContainer className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src={siteConfig.logo.src}
              alt={siteConfig.logo.alt}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <span className="font-display text-lg font-semibold">
              {siteConfig.shortName}
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            {siteConfig.name} — ONG nationale congolaise créée en{" "}
            {homeContent.organization.foundedYear}, engagée auprès des
            communautés vulnérables.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--afd-gold)]">
            Navigation
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {publicNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--afd-gold)]">
            Domaines
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {homeContent.pillars.slice(0, 6).map((pillar) => (
              <li key={pillar.id}>{pillar.title}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--afd-gold)]">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>{siteConfig.contact.address}</li>
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              {phoneIsPlaceholder ? (
                <span>
                  Téléphone :{" "}
                  <em className="not-italic text-white/55">
                    à renseigner
                  </em>
                </span>
              ) : (
                siteConfig.contact.phone
              )}
            </li>
          </ul>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-[var(--afd-gold)]">
            Accès rapide
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {footerLinks.quick.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </SiteContainer>

      <div className="border-t border-white/10">
        <SiteContainer className="flex flex-col gap-3 py-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Tous droits
            réservés.
          </p>
          <ul className="flex flex-wrap gap-4">
            {footerLinks.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
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
