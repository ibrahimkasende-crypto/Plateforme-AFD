import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { User } from "lucide-react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { getActiveTeamMembers } from "@/lib/queries/public/equipe";

export const metadata: Metadata = {
  title: "Équipe",
  description:
    "Découvrez les membres de l’équipe de l’Alliance des Femmes pour le Développement.",
};

export default async function EquipePage() {
  const members = await getActiveTeamMembers();

  return (
    <PublicPageShell
      title="Équipe"
      eyebrow="Qui sommes-nous"
      description="Les profils et compétences des personnes qui portent l’action de l’AFD au quotidien."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
        { label: "Équipe" },
      ]}
    >
      {members.length === 0 ? (
        <EmptyState
          title="Aucun profil d’équipe publié"
          description="Les profils de l’équipe AFD seront affichés ici dès leur validation institutionnelle. Vous pouvez contacter l’organisation pour toute question."
          action={
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center rounded-lg bg-[var(--afd-blue)] px-5 text-base font-semibold text-white transition hover:bg-[var(--afd-blue)]/90"
            >
              Nous contacter
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article
              key={member.id}
              className="overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)]"
            >
              <div className="relative aspect-[4/3] bg-[var(--afd-accent-soft)]">
                {member.photo_url ? (
                  <Image
                    src={member.photo_url}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--afd-accent)]">
                    <User className="size-16" aria-hidden />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-display text-lg font-semibold text-[var(--afd-ink)]">
                  {member.name}
                </h2>
                <p className="mt-1 text-sm font-medium text-[var(--afd-blue)]">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--afd-muted)]">
                  {member.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </PublicPageShell>
  );
}
