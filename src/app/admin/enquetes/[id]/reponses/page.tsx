import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminEnquete } from "@/lib/queries/admin/enquetes";
import { createClientSafe } from "@/lib/supabase/safe";

type PageProps = { params: Promise<{ id: string }> };

export default async function EnqueteReponsesPage({ params }: PageProps) {
  await requirePermission("enquetes:read");
  const { id } = await params;
  const enquete = await getAdminEnquete(id);
  if (!enquete) notFound();

  const supabase = await createClientSafe();
  const { data: reponses } = supabase
    ? await supabase
        .from("reponses_enquete")
        .select("id, statut, province, submitted_at, consentement")
        .eq("enquete_id", id)
        .order("submitted_at", { ascending: false })
    : { data: [] };

  const items = reponses ?? [];

  return (
    <main className="space-y-6 p-6">
      <div>
        <Link href={`/admin/enquetes/${id}`} className="text-sm font-semibold text-[var(--afd-blue)]">
          ← Retour à l’enquête
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Réponses — {enquete.titre}</h1>
        <p className="mt-1 text-sm text-[var(--afd-muted)]">
          Les réponses sensibles sont protégées par RLS. Export CSV à venir dans
          une itération ultérieure si besoin métier.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white p-8 text-sm text-[var(--afd-muted)]">
          Aucune réponse enregistrée pour cette enquête.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-[var(--afd-muted)]">
                <th className="p-3">Date</th>
                <th className="p-3">Province</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Consentement</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="p-3">
                    {row.submitted_at
                      ? new Date(row.submitted_at).toLocaleString("fr-FR")
                      : "—"}
                  </td>
                  <td className="p-3">{row.province ?? "—"}</td>
                  <td className="p-3">{row.statut}</td>
                  <td className="p-3">{row.consentement ? "Oui" : "Non"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
