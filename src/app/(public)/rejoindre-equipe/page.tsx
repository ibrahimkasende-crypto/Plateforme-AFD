import { PublicPageShell } from "@/components/public/PublicPageShell";
import { ApplicationForm } from "@/components/public/opportunites/application-form";
import { siteConfig } from "@/config/site";

export default function RejoindreEquipePage() {
  return (
    <PublicPageShell eyebrow="Carrières" title="Rejoindre l’équipe AFD" description="Consultez les opportunités publiées ou, lorsque cette option est ouverte, envoyez une candidature spontanée." breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Rejoindre l’équipe" }]}>
      {siteConfig.features.spontaneousApplications ? <ApplicationForm spontaneous /> : <p className="rounded-xl border border-[var(--afd-border)] bg-white p-5 text-[var(--afd-muted)]">Les candidatures spontanées ne sont pas ouvertes actuellement. Consultez les opportunités publiées.</p>}
    </PublicPageShell>
  );
}
