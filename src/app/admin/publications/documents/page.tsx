import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";

export default function Page() {
  return (
    <PublicationModuleShell
      title="Documents"
      description="Centre documentaire public."
      createHref="/admin/documents/nouveau"
      createLabel="Nouveau document"
    >
      <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm leading-relaxed text-[var(--afd-muted)]">
        Seuls les documents publies sont consultables et telechargeables par le
        public.
      </div>
    </PublicationModuleShell>
  );
}
