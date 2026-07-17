import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Bénéficiaires"
      description="Gestion des bénéficiaires."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Bénéficiaires" },
      ]}
      eyebrow="Administration"
    />
  );
}
