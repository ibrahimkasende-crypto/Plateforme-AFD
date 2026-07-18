import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";

export default function Page() {
  return (
    <PublicationModuleShell
      title="Histoires d'impact"
      description="Recits avec consentement de publication obligatoire."
      createHref="/admin/publications/histoires-impact/nouvelle"
      createLabel="Nouvelle histoire"
    >
      <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm leading-relaxed text-[var(--afd-muted)]">
        Une histoire ne peut pas etre publiee si le consentement est marque
        comme absent. Les contenus restent en brouillon jusqu&apos;a validation.
      </div>
    </PublicationModuleShell>
  );
}
