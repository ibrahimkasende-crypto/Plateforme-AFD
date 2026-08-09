import { AdminLibraryShell } from "@/components/admin/bibliotheque/admin-library-shell";

export default async function AdminBibliothequeParametresPage() {
  return (
    <AdminLibraryShell
      title="Paramètres bibliothèque"
      description="Réglages du centre documentaire institutionnel."
      current="/admin/bibliotheque/parametres"
    >
      <div className="space-y-4 rounded-xl border bg-white p-6 text-sm text-slate-600">
        <p>
          <strong>Publication :</strong> seuls les contenus avec{" "}
          <code>publie = true</code> et statut publié/terminé/archivé sont
          visibles sur le site.
        </p>
        <p>
          <strong>Fichiers privés :</strong> documents{" "}
          <code>niveau_confidentialite ≠ public</code> jamais exposés.
        </p>
        <p>
          <strong>Fallback :</strong> si Supabase est vide, le catalogue JSON
          local alimente le site public.
        </p>
        <p>
          <strong>Seed :</strong>{" "}
          <code>node scripts/seed-bibliotheque-from-catalog.mjs</code>
        </p>
      </div>
    </AdminLibraryShell>
  );
}
