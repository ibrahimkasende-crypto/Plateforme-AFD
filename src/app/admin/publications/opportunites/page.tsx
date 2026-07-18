import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";

export default function Page() {
  return (
    <PublicationModuleShell
      title="Opportunites"
      description="Offres publiees — documents dans le bucket opportunites."
      createHref="/admin/opportunites/nouvelle"
      createLabel="Nouvelle opportunite"
    >
      <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm leading-relaxed text-[var(--afd-muted)]">
        Les candidatures et CV restent dans le bucket prive candidatures-privees.
      </div>
    </PublicationModuleShell>
  );
}
