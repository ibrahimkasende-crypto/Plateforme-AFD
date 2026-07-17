import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Indicateurs et résultats"
      description="Suivi MEAL et indicateurs."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Indicateurs et résultats" },
      ]}
      eyebrow="Administration"
    />
  );
}
