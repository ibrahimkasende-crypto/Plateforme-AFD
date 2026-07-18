import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function AdminStatistiquesPage() {
  await requirePermission("statistiques:read");
  redirect("/admin");
}
