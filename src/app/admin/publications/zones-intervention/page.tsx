import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";

export default function Page() {
  return (
    <PublicationModuleShell
      title="Zones d'intervention"
      description="Huit provinces AFD, localites principales et donnees cartographiques."
    >
      <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm leading-relaxed text-[var(--afd-muted)]">
        Provinces couvertes : Kinshasa, Kwilu, Kwango, Haut-Katanga, Ituri,
        Tshopo, Tshuapa, Nord-Kivu. Les valeurs de demonstration portent le
        drapeau is_demo et un badge public.
      </div>
    </PublicationModuleShell>
  );
}
