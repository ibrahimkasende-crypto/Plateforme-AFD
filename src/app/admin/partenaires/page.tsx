import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Partenaires"
      description="Gestion des partenaires."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Partenaires" },
      ]}
      eyebrow="Administration"
    />
  );
}
