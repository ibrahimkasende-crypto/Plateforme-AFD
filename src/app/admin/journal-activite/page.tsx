import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Journal d’activité"
      description="Audit et traçabilité."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Journal d’activité" },
      ]}
      eyebrow="Administration"
    />
  );
}
