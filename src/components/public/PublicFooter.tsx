import Link from "next/link";
import { footerLinks } from "@/config/public-navigation";
import { siteConfig } from "@/config/site";
import { SiteContainer } from "@/components/shared/SiteContainer";

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--afd-border)] bg-[var(--afd-ink)] text-white">
      <SiteContainer className="grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-semibold">{siteConfig.shortName}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/75">
            {siteConfig.description}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--afd-gold)]">
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
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--afd-gold)]">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>{siteConfig.contact.address}</li>
            <li>{siteConfig.contact.email}</li>
            <li>{siteConfig.contact.phone}</li>
          </ul>
          <ul className="mt-6 space-y-2 text-sm text-white/70">
            {footerLinks.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </SiteContainer>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
