import { redirect } from "next/navigation";

/** Alias de route demandé par la maquette → formulaire existant. */
export default function AdminProjetNouveauAliasPage() {
  redirect("/admin/projets/nouvelle");
}
