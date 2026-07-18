import Link from "next/link";
import { notFound } from "next/navigation";
import { saveQuestion } from "@/features/enquetes/actions/manage-enquete";
import { requirePermission } from "@/lib/auth/require-permission";
import {
  getAdminEnquete,
  getAdminQuestions,
} from "@/lib/queries/admin/enquetes";

type PageProps = { params: Promise<{ id: string }> };

export default async function EnqueteDetailPage({ params }: PageProps) {
  await requirePermission("enquetes:read");
  const { id } = await params;
  const enquete = await getAdminEnquete(id);
  if (!enquete) notFound();
  const questions = await getAdminQuestions(id);

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{enquete.titre}</h1>
          <p className="mt-1 text-sm text-[var(--afd-muted)]">
            {enquete.statut} · {enquete.visibilite} · /enquetes/{enquete.slug}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/enquetes/${id}/modifier`}
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
          >
            Modifier
          </Link>
          <Link
            href={`/admin/enquetes/${id}/reponses`}
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
          >
            Réponses
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Questions</h2>
        {questions.length === 0 ? (
          <p className="text-sm text-[var(--afd-muted)]">Aucune question pour le moment.</p>
        ) : (
          <ol className="space-y-3">
            {questions.map((question, index) => (
              <li key={question.id} className="rounded-lg border p-3 text-sm">
                <span className="font-semibold">{index + 1}. </span>
                {question.libelle}
                <span className="ml-2 text-[var(--afd-muted)]">
                  ({question.type_question}
                  {question.obligatoire ? ", obligatoire" : ""})
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="max-w-xl rounded-2xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Ajouter une question</h2>
        <form action={saveQuestion} className="space-y-3">
          <input type="hidden" name="enquete_id" value={id} />
          <input required name="libelle" placeholder="Libellé" className="w-full rounded-lg border p-3" />
          <select name="type_question" defaultValue="texte_court" className="w-full rounded-lg border p-3">
            <option value="texte_court">Texte court</option>
            <option value="texte_long">Texte long</option>
            <option value="nombre">Nombre</option>
            <option value="date">Date</option>
            <option value="telephone">Téléphone</option>
            <option value="email">Email</option>
            <option value="choix_unique">Choix unique</option>
            <option value="choix_multiple">Choix multiple</option>
            <option value="liste">Liste déroulante</option>
            <option value="oui_non">Oui / Non</option>
            <option value="note">Note</option>
            <option value="echelle">Échelle</option>
            <option value="fichier">Fichier</option>
            <option value="photo">Photo</option>
            <option value="localisation">Localisation</option>
          </select>
          <input name="ordre" type="number" defaultValue={questions.length} className="w-full rounded-lg border p-3" />
          <label className="flex items-center gap-2 text-sm">
            <input name="obligatoire" type="checkbox" /> Obligatoire
          </label>
          <button type="submit" className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 text-sm font-semibold text-white">
            Ajouter
          </button>
        </form>
      </section>
    </main>
  );
}
