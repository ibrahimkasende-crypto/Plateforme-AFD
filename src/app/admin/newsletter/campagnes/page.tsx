import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { markCampagneSent } from "@/features/newsletter/actions/manage-newsletter";
import { isEmailProviderConfigured } from "@/features/newsletter/providers/resolve-provider";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminCampagnes } from "@/lib/queries/admin/newsletter-admin";

export default async function AdminNewsletterCampagnesPage() {
  await requirePermission("newsletter:read");
  const items = await getAdminCampagnes();
  const providerReady = isEmailProviderConfigured();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Campagnes newsletter"
        description="Campagnes e-mail programmées ou envoyées."
        createHref="/admin/newsletter/campagnes/nouvelle"
        createLabel="Nouvelle campagne"
      />

      {!providerReady ? (
        <div
          role="status"
          className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
        >
          <p className="font-semibold">Configuration requise</p>
          <p className="mt-1">
            L’envoi réel est bloqué tant que{" "}
            <code className="font-mono text-xs">EMAIL_PROVIDER</code>,{" "}
            <code className="font-mono text-xs">EMAIL_API_KEY</code> et{" "}
            <code className="font-mono text-xs">EMAIL_FROM</code> ne sont pas configurés.
            La création et l’aperçu des campagnes restent disponibles. Statut module :{" "}
            <strong>bloque_integration_externe</strong>.
          </p>
          <p className="mt-2">
            Voir <Link href="/admin/newsletter" className="underline">documentation intégrations</Link>{" "}
            (<code className="font-mono text-xs">docs/PLATFORM_AFD_EXTERNAL_INTEGRATIONS.md</code>.
          </p>
        </div>
      ) : null}

      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucune campagne"
          description="Créez une campagne pour informer vos abonnés."
          createHref="/admin/newsletter/campagnes/nouvelle"
          createLabel="Nouvelle campagne"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Titre</th>
                <th>Objet</th>
                <th>Statut</th>
                <th>Programmée</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.title}</td>
                  <td>{item.subject}</td>
                  <td>{item.status}</td>
                  <td>{item.scheduled_at?.slice(0, 10) ?? "—"}</td>
                  <td className="p-3 text-right">
                    {item.status !== "envoyee" ? (
                      <form action={markCampagneSent.bind(null, item.id)} className="inline">
                        <button
                          type="submit"
                          className="text-[var(--afd-blue)]"
                          title={
                            providerReady
                              ? "Envoyer via le fournisseur"
                              : "Configuration requise — envoi bloqué"
                          }
                        >
                          {providerReady ? "Envoyer" : "Tenter l’envoi (bloqué)"}
                        </button>
                      </form>
                    ) : (
                      <span className="text-[var(--afd-muted)]">Envoyée</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
