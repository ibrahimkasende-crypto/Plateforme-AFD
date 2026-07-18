import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";

type PageProps = { params: Promise<{ id: string }> };

export default async function ModifierActualitePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <PublicationModuleShell
      title="Modifier l’actualité"
      description={`Édition de l’actualité ${id}. Prévisualisation, brouillon et publication via Supabase.`}
    >
      <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm text-[var(--afd-muted)]">
        Formulaire d’édition en cours de finalisation. Identifiant :{" "}
        <code className="rounded bg-[var(--afd-surface)] px-1.5 py-0.5 text-[12px]">
          {id}
        </code>
      </div>
    </PublicationModuleShell>
  );
}
