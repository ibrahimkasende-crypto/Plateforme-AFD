import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function AdminAnalyseRapportsPage() {
  await requirePermission("rapports:read");
  redirect("/admin/rapports/historique");
}
