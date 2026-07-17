import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Messages"
      description="Messages reçus via le formulaire de contact."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Messages" },
      ]}
      eyebrow="Administration"
    />
  );
}
