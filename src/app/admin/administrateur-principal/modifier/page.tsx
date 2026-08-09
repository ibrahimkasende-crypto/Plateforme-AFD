import Link from "next/link";
import { redirect } from "next/navigation";
import { isSuperActor } from "@/features/identity/security/privilege-guards";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function ModifierAdministrateurPrincipalPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session = await requireAdmin();
  if (!isSuperActor(session.roles)) {
    redirect("/acces-refuse");
  }
  const { id } = await searchParams;
  if (!id) redirect("/admin/administrateur-principal");

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 p-4 md:p-6">
      <Link
        href="/admin/administrateur-principal"
        className="text-sm text-[var(--admin-primary)]"
      >
        ← Retour
      </Link>
      <h1 className="text-2xl font-bold">Modifier l’Administrateur principal</h1>
      <p className="text-sm text-slate-600">
        Les informations détaillées se gèrent sur la fiche utilisateur.
      </p>
      <Link
        href={`/admin/utilisateurs/${id}`}
        className="inline-flex rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white"
      >
        Ouvrir la fiche
      </Link>
    </main>
  );
}
