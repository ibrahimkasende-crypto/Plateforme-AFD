import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-permission";

const LINKS = [
  {
    href: "/admin/rapports/nouveau",
    title: "Nouveau rapport",
    description: "Créer un rapport personnalisé.",
  },
  {
    href: "/admin/rapports/historique",
    title: "Historique",
    description: "Consulter les rapports générés.",
  },
  {
    href: "/admin/rapports/modeles",
    title: "Modèles",
    description: "Gérer les modèles de rapport.",
  },
  {
    href: "/admin/analyse/rapports",
    title: "Analyse",
    description: "Vue analytique des rapports.",
  },
];

export default async function AdminRapportsHubPage() {
  await requirePermission("rapports:read");

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Rapports</h1>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">
          Hub des rapports institutionnels AFD.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-2xl border border-[var(--admin-border)] bg-white p-5 hover:border-[var(--admin-primary)]/40"
            >
              <p className="font-display font-bold">{link.title}</p>
              <p className="mt-1 text-sm text-[var(--admin-muted)]">
                {link.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
