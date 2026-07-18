import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Nouveau bénéficiaire"
      description="Ajout d’un enregistrement bénéficiaire (agrégats et fiches)."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Bénéficiaires", href: "/admin/beneficiaires" },
        { label: "Nouveau" },
      ]}
      eyebrow="Administration"
    />
  );
}
