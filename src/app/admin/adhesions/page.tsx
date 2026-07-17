import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Adhésions"
      description="Demandes d’adhésion."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Adhésions" },
      ]}
      eyebrow="Administration"
    />
  );
}
