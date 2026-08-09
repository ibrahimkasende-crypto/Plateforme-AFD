import { redirect } from "next/navigation";

/** Alias demandé : /admin/utilisateurs/invitations → /admin/invitations */
export default function UtilisateursInvitationsRedirect() {
  redirect("/admin/invitations");
}
