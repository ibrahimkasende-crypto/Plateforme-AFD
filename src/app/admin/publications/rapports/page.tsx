import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";

export default function Page() {
  return (
    <PublicationModuleShell
      title="Rapports"
      description="Rapports publics telechargeables."
      createHref="/admin/rapports/nouveau"
      createLabel="Nouveau rapport"
    >
      <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm leading-relaxed text-[var(--afd-muted)]">
        Couverture, resume, annee, langue et confidentialite geres depuis le
        Studio.
      </div>
    </PublicationModuleShell>
  );
}
