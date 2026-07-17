import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Newsletter"
      description="Pilotage de la newsletter."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Newsletter" },
      ]}
      eyebrow="Administration"
    />
  );
}
