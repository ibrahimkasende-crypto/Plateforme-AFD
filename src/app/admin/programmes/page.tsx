import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Programmes"
      description="Gestion des programmes institutionnels."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Programmes" },
      ]}
      eyebrow="Administration"
    />
  );
}
