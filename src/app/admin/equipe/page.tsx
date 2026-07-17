import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Équipe et RH"
      description="Gestion de l’équipe."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Équipe et RH" },
      ]}
      eyebrow="Administration"
    />
  );
}
