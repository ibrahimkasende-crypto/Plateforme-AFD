import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";

const LINKS = [
  { href: "/admin/analyse/beneficiaires", label: "Bénéficiaires" },
  { href: "/admin/analyse/projets", label: "Projets" },
  { href: "/admin/analyse/activites", label: "Activités" },
  { href: "/admin/analyse/provinces", label: "Provinces" },
  { href: "/admin/analyse/secteurs", label: "Secteurs" },
  { href: "/admin/analyse/finances", label: "Finances" },
  { href: "/admin/analyse/partenaires", label: "Partenaires" },
  { href: "/admin/analyse/engagement", label: "Engagement" },
  { href: "/admin/analyse/documents", label: "Documents" },
  { href: "/admin/analyse/rapports", label: "Rapports" },
];

export default async function AdminAnalyseIndexPage() {
  await requireAdmin();
  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Analyses</h1>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">
          Écrans analytiques détaillés du tableau de bord AFD.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-2xl border border-[var(--admin-border)] bg-white p-4 font-medium hover:border-[var(--admin-primary)]/40"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
