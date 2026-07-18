import Link from "next/link";
import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminPages } from "@/lib/queries/admin/pages";

export default async function AdminPagesCmsPage() {
  await requirePermission("pages:write");
  const items = await getAdminPages();

  return (
    <PublicationModuleShell
      title="Pages institutionnelles"
      description="Gérez les titres, résumés, SEO et sections des pages publiques."
      createHref="/admin/publications/pages/nouvelle"
      createLabel="Nouvelle page"
    >
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm text-[var(--afd-muted)]">
          Aucune page CMS enregistrée. Créez les routes institutionnelles puis
          publiez-les pour remplacer les contenus de référence.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--afd-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--afd-border)] text-[var(--afd-muted)]">
                <th className="p-3 font-medium">Route</th>
                <th className="p-3 font-medium">Titre</th>
                <th className="p-3 font-medium">Statut</th>
                <th className="p-3 font-medium">Publié</th>
                <th className="p-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-[var(--afd-border)]">
                  <td className="p-3 font-mono text-xs">{item.route}</td>
                  <td className="p-3 font-medium">{item.titre}</td>
                  <td className="p-3">{item.statut}</td>
                  <td className="p-3">{item.publie ? "Oui" : "Non"}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/publications/pages/${item.id}/modifier`}
                      className="font-semibold text-[var(--afd-blue)]"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PublicationModuleShell>
  );
}
