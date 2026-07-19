import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";

const sections = [
  {
    title: "Utilisateurs administrateurs",
    description: "Comptes, rôles et activation.",
    href: "/admin/utilisateurs",
    permission: "users.view" as const,
  },
  {
    title: "Invitations",
    description: "Invitations en attente et historique.",
    href: "/admin/invitations",
    permission: "users.invite" as const,
  },
  {
    title: "Rôles et permissions",
    description: "Matrice des droits par rôle.",
    href: "/admin/permissions",
    permission: "roles:manage" as const,
  },
  {
    title: "Journal d'activité",
    description: "Actions administratives tracées.",
    href: "/admin/journal-activite",
    permission: "journal:read" as const,
  },
  {
    title: "Sessions et sécurité",
    description: "Événements de sécurité et sessions.",
    href: "/admin/securite/sessions",
    permission: "users.view_security" as const,
  },
  {
    title: "Mon profil",
    description: "Informations de votre compte.",
    href: "/admin/mon-profil",
    permission: "users.view" as const,
  },
];

export default async function AdminAccesPage() {
  await requirePermission("users.view");

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Accès et identité"
        description="Hub de gestion des utilisateurs, rôles et sécurité."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded border bg-white p-4 transition hover:border-[var(--afd-blue)]"
          >
            <h2 className="font-semibold">{section.title}</h2>
            <p className="mt-1 text-sm text-[var(--afd-muted)]">{section.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
