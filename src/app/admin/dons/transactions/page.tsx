import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Transactions"
      description="Transactions de paiement."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Transactions" },
      ]}
      eyebrow="Administration"
    />
  );
}
