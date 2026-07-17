import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité et traitement des données personnelles par l’AFD.",
  alternates: { canonical: `${siteConfig.url}/politique-confidentialite` },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <PublicPageShell
      eyebrow="Données personnelles"
      title="Politique de confidentialité"
      description="Comment l’AFD collecte, utilise et protège vos données personnelles."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Politique de confidentialité" },
      ]}
    >
      <div className="max-w-none space-y-8 text-sm leading-relaxed text-[var(--afd-muted)]">
        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Responsable du traitement
          </h2>
          <p className="mt-3">
            {siteConfig.name} ({siteConfig.acronym}), {siteConfig.country}. Contact :{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-[var(--afd-blue)]">
              {siteConfig.contact.email}
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Données collectées
          </h2>
          <p className="mt-3">
            Selon les formulaires que vous utilisez, nous pouvons collecter :
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Identité et coordonnées (nom, e-mail, téléphone, adresse)</li>
            <li>Contenu de vos messages et demandes</li>
            <li>Informations relatives à une demande d’adhésion ou de partenariat</li>
            <li>Préférences newsletter et centres d’intérêt (facultatifs)</li>
            <li>Informations relatives à une intention de don (montant, devise, type de soutien)</li>
            <li>Données techniques minimales (logs, horodatage) pour la sécurité du service</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Formulaires de contact, adhésion et partenariat
          </h2>
          <p className="mt-3">
            Les données transmises via les formulaires de contact, d’adhésion et de partenariat
            sont utilisées exclusivement pour traiter votre demande, vous recontacter et assurer le
            suivi institutionnel. La base légale est votre consentement explicite, matérialisé par
            la case à cocher dédiée.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Newsletter
          </h2>
          <p className="mt-3">
            L’inscription à la newsletter repose sur votre consentement. Votre adresse e-mail est
            utilisée pour vous envoyer des informations sur les actions, publications et
            opportunités de l’AFD. Vous pouvez vous désinscrire à tout moment via le lien prévu dans
            chaque envoi ou en nous contactant.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Intentions de don
          </h2>
          <p className="mt-3">
            Les données relatives aux intentions de soutien sont enregistrées pour permettre le
            traitement de votre demande par l’équipe AFD. Tant que le paiement en ligne SerdiPay
            n’est pas activé, aucune transaction financière n’est effectuée via la plateforme. Les
            informations de paiement ne sont pas collectées sur ce formulaire.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Durée de conservation
          </h2>
          <p className="mt-3">
            Les données sont conservées pendant la durée nécessaire au traitement de votre demande,
            puis archivées ou supprimées conformément aux obligations légales et aux procédures
            internes de l’AFD.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Destinataires et sous-traitants
          </h2>
          <p className="mt-3">
            Vos données sont accessibles aux équipes habilitées de l’AFD et, le cas échéant, à des
            prestataires techniques agissant pour le compte de l’organisation (hébergement,
            messagerie, base de données), dans le respect de la confidentialité.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Vos droits
          </h2>
          <p className="mt-3">
            Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation et
            d’opposition concernant vos données personnelles. Pour exercer ces droits, contactez-nous
            à{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-[var(--afd-blue)]">
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Cookies et mesure d’audience
          </h2>
          <p className="mt-3">
            La plateforme peut utiliser des cookies strictement nécessaires au fonctionnement du
            site. Toute mesure d’audience ou cookie non essentiel fera l’objet d’une information
            dédiée lors de son activation.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Mise à jour
          </h2>
          <p className="mt-3">
            Cette politique peut être mise à jour pour refléter l’évolution des services ou de la
            réglementation. La date de dernière mise à jour sera indiquée lors des révisions
            institutionnelles. Pour toute question :{" "}
            <Link href="/contact" className="text-[var(--afd-blue)] hover:underline">
              formulaire de contact
            </Link>
            .
          </p>
        </section>
      </div>
    </PublicPageShell>
  );
}
