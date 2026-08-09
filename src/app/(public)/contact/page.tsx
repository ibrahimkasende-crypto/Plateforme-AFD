import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/public/forms/contact-form";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";
import { getResolvedPublicSiteSettings } from "@/lib/queries/public/site-settings";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l’Alliance des Femmes pour le Développement pour toute question, collaboration ou demande d’information.",
  alternates: { canonical: `${siteConfig.url}/contact` },
};

function isPhonePlaceholder(phone: string): boolean {
  return phone.replace(/\D/g, "").includes("000");
}

export default async function ContactPage() {
  const settings = await getResolvedPublicSiteSettings();
  const contact = settings.contact;
  const phoneIsPlaceholder = isPhonePlaceholder(contact.phone);

  return (
    <PublicPageShell
      eyebrow="Contact"
      title="Nous contacter"
      description="Une question, une proposition de collaboration ou une demande d’information ? L’équipe AFD vous répond."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Contact" },
      ]}
    >
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <aside className="space-y-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
              Coordonnées
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
              Retrouvez les informations de contact institutionnelles de{" "}
              {settings.shortName}.
            </p>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 rounded-xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-4">
              <Mail className="mt-0.5 size-5 shrink-0 text-[var(--afd-blue)]" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-[var(--afd-ink)]">E-mail</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm text-[var(--afd-blue)] hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3 rounded-xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-4">
              <Phone className="mt-0.5 size-5 shrink-0 text-[var(--afd-blue)]" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-[var(--afd-ink)]">Téléphone</p>
                {phoneIsPlaceholder ? (
                  <>
                    <p className="text-sm text-[var(--afd-muted)]">{contact.phone}</p>
                    <p className="mt-1 text-xs text-[var(--afd-muted)]">
                      Numéro provisoire — information institutionnelle à compléter
                      par l’AFD.
                    </p>
                  </>
                ) : (
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="text-sm text-[var(--afd-blue)] hover:underline"
                  >
                    {contact.phone}
                  </a>
                )}
              </div>
            </li>

            <li className="flex items-start gap-3 rounded-xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-[var(--afd-blue)]" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-[var(--afd-ink)]">Adresse</p>
                <p className="text-sm text-[var(--afd-muted)]">{contact.address}</p>
              </div>
            </li>
          </ul>
        </aside>

        <ContactForm />
      </div>
    </PublicPageShell>
  );
}
