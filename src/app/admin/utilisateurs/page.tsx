import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Utilisateurs"
      description="Gestion des comptes."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Utilisateurs" },
      ]}
      eyebrow="Administration"
    />
  );
}
