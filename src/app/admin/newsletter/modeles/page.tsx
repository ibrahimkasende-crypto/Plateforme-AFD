import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { saveModele } from "@/features/newsletter/actions/manage-newsletter";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminModeles } from "@/lib/queries/admin/newsletter-admin";

export default async function AdminNewsletterModelesPage() {
  await requirePermission("newsletter:read");
  const items = await getAdminModeles();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Modèles newsletter" description="Modèles réutilisables pour les campagnes." />
      <form action={saveModele} className="space-y-4 rounded border bg-white p-4">
        <input required name="title" placeholder="Titre du modèle" className="w-full rounded border p-3" />
        <textarea required name="body" placeholder="Corps HTML ou texte" className="min-h-40 w-full rounded border p-3" />
        <label className="inline-flex items-center gap-2 text-sm">
          <input name="active" type="checkbox" defaultChecked />
          Actif
        </label>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Créer un modèle
        </button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucun modèle"
          description="Créez des modèles pour accélérer vos campagnes."
          createHref="/admin/newsletter/modeles"
          createLabel="Créer ci-dessus"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Titre</th>
                <th>Actif</th>
                <th>Créé</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.title}</td>
                  <td>{item.active ? "Oui" : "Non"}</td>
                  <td>{item.created_at?.slice(0, 10) ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
