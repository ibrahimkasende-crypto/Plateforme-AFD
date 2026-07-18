import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Nouvelle campagne newsletter"
      description="Préparation et envoi d’une campagne newsletter."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Newsletter", href: "/admin/newsletter" },
        { label: "Campagnes", href: "/admin/newsletter/campagnes" },
        { label: "Nouvelle" },
      ]}
      eyebrow="Administration"
    />
  );
}
