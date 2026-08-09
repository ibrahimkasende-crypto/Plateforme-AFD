import { AdminLibraryShell } from "@/components/admin/bibliotheque/admin-library-shell";
import { getLibraryCategories } from "@/lib/queries/public/bibliotheque";

export default async function AdminBibliothequeCategoriesPage() {
  const categories = await getLibraryCategories();

  return (
    <AdminLibraryShell
      title="Catégories"
      description="Catégories dérivées des activités (base + catalogue). Une seule source pour les filtres publics."
      current="/admin/bibliotheque/categories"
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <li
            key={category.slug}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <p className="font-semibold text-slate-900">{category.label}</p>
            <p className="mt-1 text-xs text-slate-500">
              {category.activityCount} activité
              {category.activityCount > 1 ? "s" : ""} · {category.photoCount}{" "}
              photo{category.photoCount > 1 ? "s" : ""}
            </p>
          </li>
        ))}
      </ul>
    </AdminLibraryShell>
  );
}
