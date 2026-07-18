import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";

export default function NouvelleActualitePage() {
  return (
    <PublicationModuleShell
      title="Nouvelle actualité"
      description="Formulaire éditorial connecté à Supabase. Les champs incertains peuvent rester vides."
    >
      <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm leading-relaxed text-[var(--afd-muted)]">
        Le formulaire complet (éditeur riche, MediaPicker, SEO, relations) sera
        branché sur les Server Actions dès que la migration
        <code className="mx-1 rounded bg-[var(--afd-surface)] px-1.5 py-0.5 text-[12px]">
          20260718_008_publication_studio_foundations.sql
        </code>
        est appliquée sur le projet Supabase. Aucune donnée fictive n’est
        enregistrée automatiquement.
      </div>
    </PublicationModuleShell>
  );
}
