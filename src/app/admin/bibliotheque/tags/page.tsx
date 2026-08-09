import { AdminLibraryShell } from "@/components/admin/bibliotheque/admin-library-shell";
import { listLibraryActivities } from "@/lib/queries/public/bibliotheque";

export default async function AdminBibliothequeTagsPage() {
  const activities = await listLibraryActivities();
  const tags = new Map<string, number>();
  for (const activity of activities) {
    for (const tag of activity.tags) {
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    }
  }
  const list = [...tags.entries()].sort((a, b) =>
    a[0].localeCompare(b[0], "fr"),
  );

  return (
    <AdminLibraryShell
      title="Tags"
      description="Tags issus des activités publiées."
      current="/admin/bibliotheque/tags"
    >
      {list.length === 0 ? (
        <p className="rounded-xl border bg-white p-6 text-sm text-slate-600">
          Aucun tag pour le moment.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {list.map(([tag, count]) => (
            <li
              key={tag}
              className="rounded-full border bg-white px-3 py-1.5 text-sm"
            >
              {tag} <span className="text-slate-500">({count})</span>
            </li>
          ))}
        </ul>
      )}
    </AdminLibraryShell>
  );
}
