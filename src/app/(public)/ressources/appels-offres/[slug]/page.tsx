import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AppelOffreDetailPage(props: PageProps) {
  await props.params;
  notFound();
}
