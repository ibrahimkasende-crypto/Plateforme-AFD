import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogIn, LogOut, ShieldAlert } from "lucide-react";
import { signOut } from "@/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Accès refusé",
  description: "Vous n’avez pas les droits nécessaires pour accéder à l’administration AFD.",
  robots: { index: false, follow: false },
};

type AccesRefusePageProps = {
  searchParams: Promise<{ raison?: string }>;
};

const RAISON_MESSAGES: Record<string, { title: string; description: string }> =
  {
    profil: {
      title: "Profil administrateur introuvable",
      description:
        "Votre compte utilisateur existe, mais aucun profil administrateur actif n’y est associé. Contactez la direction ou les ressources humaines pour obtenir un accès.",
    },
    desactive: {
      title: "Compte désactivé",
      description:
        "Votre compte administrateur a été désactivé. Pour toute question, contactez la direction générale de l’AFD.",
    },
    role: {
      title: "Rôle administrateur manquant",
      description:
        "Votre profil existe, mais aucun rôle administrateur ne lui a été attribué. Un super administrateur doit vous assigner un rôle pour accéder à l’espace de gestion.",
    },
  };

export default async function AccesRefusePage({
  searchParams,
}: AccesRefusePageProps) {
  const params = await searchParams;
  const raison = params.raison ?? "";
  const content =
    RAISON_MESSAGES[raison] ?? {
      title: "Accès refusé",
      description:
        "Vous n’avez pas les autorisations nécessaires pour accéder à l’administration de la Plateforme AFD.",
    };

  return (
    <AuthShell title={content.title}>
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert className="size-7" aria-hidden />
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          {content.description}
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-[#0d254e] transition hover:border-[#2563eb]/40 hover:bg-slate-50"
          >
            <ExternalLink className="size-4" aria-hidden />
            Voir le site public
          </Link>

          <Link
            href="/connexion"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
          >
            <LogIn className="size-4" aria-hidden />
            Retour à la connexion
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            >
              <LogOut className="size-4" aria-hidden />
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}
