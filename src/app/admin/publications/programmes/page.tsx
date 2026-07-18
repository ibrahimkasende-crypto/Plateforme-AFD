import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";

export default function Page() {
  return (
    <PublicationModuleShell
      title="Programmes"
      description="Gérez les fiches programmes et leurs images Supabase."
      createHref="/admin/publications/programmes/nouveau"
      createLabel="Nouveau programme"
    >
      <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm leading-relaxed text-[var(--afd-muted)]">
        Module du Studio de publication. Les images de couverture doivent être
        sélectionnées depuis la médiathèque Supabase.
      </div>
    </PublicationModuleShell>
  );
}
