import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Finances"
      description="Budgets, dépenses et suivi financier."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Finances" },
      ]}
      eyebrow="Administration"
    />
  );
}
