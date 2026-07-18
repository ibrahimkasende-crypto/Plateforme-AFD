import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function AdminAppelsOffresPage() {
  await requirePermission("appels-offres:read");
  redirect("/admin/publications/appels-offres");
}
