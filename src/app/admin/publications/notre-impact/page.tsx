import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";

export default function Page() {
  return (
    <PublicationModuleShell
      title="Notre impact"
      description="Indicateurs valides uniquement pour affichage public."
    >
      <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm leading-relaxed text-[var(--afd-muted)]">
        Table chiffres_impact : une valeur non validee ne doit jamais etre
        presentee comme officielle sur le site public.
      </div>
    </PublicationModuleShell>
  );
}
