import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Statistiques"
      description="Tableaux de bord analytiques."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Statistiques" },
      ]}
      eyebrow="Administration"
    />
  );
}
