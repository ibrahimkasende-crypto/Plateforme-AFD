import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function HistoireDetailPage(props: PageProps) {
  // Table histoires_impact non encore créée — aucune histoire inventée.
  await props.params;
  notFound();
}
