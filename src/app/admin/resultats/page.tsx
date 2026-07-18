import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function AdminResultatsPage() {
  await requirePermission("indicateurs:read");
  redirect("/admin/indicateurs");
}
