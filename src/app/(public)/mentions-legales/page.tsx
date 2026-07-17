import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de la plateforme institutionnelle de l’AFD.",
  alternates: { canonical: `${siteConfig.url}/mentions-legales` },
};

export default function MentionsLegalesPage() {
  return (
    <PublicPageShell
      eyebrow="Informations légales"
      title="Mentions légales"
      description="Informations légales relatives à la plateforme institutionnelle de l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Mentions légales" },
      ]}
    >
      <div className="prose prose-neutral max-w-none space-y-8 text-[var(--afd-muted)] dark:prose-invert">
        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Éditeur du site
          </h2>
          <ul className="mt-3 space-y-1 text-sm leading-relaxed">
            <li>
              <strong className="text-[var(--afd-ink)]">Dénomination :</strong>{" "}
              {siteConfig.name}
            </li>
            <li>
              <strong className="text-[var(--afd-ink)]">Sigle :</strong> {siteConfig.acronym}
            </li>
            <li>
              <strong className="text-[var(--afd-ink)]">Forme :</strong> ASBL / ONG nationale
            </li>
            <li>
              <strong className="text-[var(--afd-ink)]">Pays :</strong> {siteConfig.country}
            </li>
            <li>
              <strong className="text-[var(--afd-ink)]">E-mail :</strong>{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="text-[var(--afd-blue)]">
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <strong className="text-[var(--afd-ink)]">Siège social :</strong>{" "}
              Information institutionnelle à compléter par l’AFD
            </li>
            <li>
              <strong className="text-[var(--afd-ink)]">Numéro d’identification :</strong>{" "}
              Information institutionnelle à compléter par l’AFD
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Directeur de la publication
          </h2>
          <p className="mt-3 text-sm leading-relaxed">
            Information institutionnelle à compléter par l’AFD (nom et fonction du responsable
            habilité).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Hébergement
          </h2>
          <p className="mt-3 text-sm leading-relaxed">
            Information institutionnelle à compléter par l’AFD (nom de l’hébergeur, adresse et
            coordonnées).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Propriété intellectuelle
          </h2>
          <p className="mt-3 text-sm leading-relaxed">
            L’ensemble des contenus présents sur {siteConfig.appName} (textes, visuels, logos,
            documents) est protégé par le droit d’auteur. Toute reproduction, représentation ou
            diffusion, totale ou partielle, sans autorisation préalable de {siteConfig.shortName}{" "}
            est interdite, sauf usage privé et non commercial.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Limitation de responsabilité
          </h2>
          <p className="mt-3 text-sm leading-relaxed">
            {siteConfig.shortName} s’efforce d’assurer l’exactitude des informations publiées.
            Toutefois, l’organisation ne saurait être tenue responsable des erreurs, omissions ou
            indisponibilités temporaires du service. Les liens vers des sites tiers n’engagent pas
            la responsabilité de l’AFD quant à leur contenu.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Données personnelles
          </h2>
          <p className="mt-3 text-sm leading-relaxed">
            Pour toute information relative au traitement de vos données personnelles, consultez
            notre{" "}
            <Link href="/politique-confidentialite" className="text-[var(--afd-blue)] hover:underline">
              politique de confidentialité
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Contact
          </h2>
          <p className="mt-3 text-sm leading-relaxed">
            Pour toute question relative aux mentions légales :{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-[var(--afd-blue)]">
              {siteConfig.contact.email}
            </a>
          </p>
        </section>
      </div>
    </PublicPageShell>
  );
}
