import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Nouveau rapport"
      description="Création d’un rapport."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Nouveau rapport" },
      ]}
      eyebrow="Administration"
    />
  );
}
