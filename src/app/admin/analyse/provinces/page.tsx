import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-permission";

const PROVINCES = [
  "Kinshasa",
  "Nord-Kivu",
  "Ituri",
  "Kwilu",
  "Haut-Katanga",
  "Tshopo",
  "Kwango",
  "Tshuapa",
];

export default async function AdminAnalyseProvincesPage() {
  await requirePermission("projets:read");
  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold">
          Analyse par province
        </h1>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">
          Sélectionnez une province pour ouvrir la fiche analytique.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PROVINCES.map((name) => {
          const slug = name.toLowerCase().replace(/\s+/g, "-");
          return (
            <li key={slug}>
              <Link
                href={`/admin/provinces/${slug}/analyse`}
                className="block rounded-2xl border border-[var(--admin-border)] bg-white p-4 font-medium hover:border-[var(--admin-primary)]/40"
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
