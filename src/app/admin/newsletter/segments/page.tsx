import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Segments newsletter"
      description="Segmentation des audiences."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Segments newsletter" },
      ]}
      eyebrow="Administration"
    />
  );
}
