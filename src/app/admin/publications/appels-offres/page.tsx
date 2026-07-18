import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";

export default function Page() {
  return (
    <PublicationModuleShell
      title="Appels d'offres"
      description="AO publics et documents Storage associes."
      createHref="/admin/publications/appels-offres/nouveau"
      createLabel="Nouvel appel d'offres"
    >
      <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm leading-relaxed text-[var(--afd-muted)]">
        Documents (TdR, cahier des charges, formulaires) dans Supabase Storage.
      </div>
    </PublicationModuleShell>
  );
}
