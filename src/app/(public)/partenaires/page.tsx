import type { Metadata } from "next";
import Link from "next/link";
import { PartnersGrid } from "@/components/public/partners/partners-grid";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { getActivePublicPartners } from "@/lib/queries/partenaires";

export const metadata: Metadata = {
  title: "Nos partenaires",
  description:
    "Organisations partenaires de l’Alliance des Femmes pour le Développement (AFD ASBL).",
};

const CATEGORY_LABELS: Record<string, string> = {
  gouvernement: "Institutionnel",
  international: "International",
  ong: "ONG",
};

export default async function PartenairesPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  const partners = await getActivePublicPartners();
  const categories = Array.from(
    new Set(
      partners
        .map((p) => p.category)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const filtered = categorie
    ? partners.filter((p) => p.category === categorie)
    : partners;

  return (
    <main className="bg-[var(--afd-background)] pb-20 pt-10">
      <SiteContainer>
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--afd-blue)]">
            Ils nous font confiance
          </p>
          <h1 className="afd-h1 mt-3">Nos partenaires</h1>
          <p className="mt-4 text-base text-[var(--afd-muted)]">
            Découvrez les organisations partenaires de l’AFD ASBL. Les
            informations affichées sont limitées à celles vérifiées et publiées.
          </p>
        </header>

        {categories.length > 0 ? (
          <nav
            aria-label="Filtrer par catégorie"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            <Link
              href="/partenaires"
              className={`rounded-md px-3 py-2 text-sm ${
                !categorie
                  ? "bg-[var(--afd-navy)] text-white"
                  : "bg-white text-[var(--afd-navy)]"
              }`}
            >
              Tous
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/partenaires?categorie=${encodeURIComponent(cat)}`}
                className={`rounded-md px-3 py-2 text-sm ${
                  categorie === cat
                    ? "bg-[var(--afd-navy)] text-white"
                    : "bg-white text-[var(--afd-navy)]"
                }`}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="mt-10">
          <PartnersGrid partners={filtered} size="lg" />
        </div>

        {filtered.length > 0 ? (
          <ul className="mx-auto mt-12 max-w-3xl space-y-4">
            {filtered.map((partner) => (
              <li
                key={`detail-${partner.id}`}
                className="border-b border-black/5 pb-4"
              >
                <p className="font-semibold text-[var(--afd-navy)]">
                  {partner.name}
                  {partner.acronyme ? (
                    <span className="ml-2 text-sm font-normal text-[var(--afd-muted)]">
                      ({partner.acronyme})
                    </span>
                  ) : null}
                </p>
                {partner.category ? (
                  <p className="mt-1 text-sm text-[var(--afd-muted)]">
                    {CATEGORY_LABELS[partner.category] ?? partner.category}
                  </p>
                ) : null}
                {partner.description ? (
                  <p className="mt-2 text-sm text-[var(--afd-navy)]/80">
                    {partner.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        <section className="mx-auto mt-16 max-w-2xl text-center">
          <h2 className="text-xl font-semibold text-[var(--afd-navy)]">
            Devenir partenaire
          </h2>
          <p className="mt-3 text-sm text-[var(--afd-muted)]">
            Vous représentez une institution, une ONG ou un réseau et souhaitez
            collaborer avec l’AFD ASBL ?
          </p>
          <Link
            href="/partenariat"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--afd-blue)] px-5 text-sm font-semibold text-white"
          >
            Proposer un partenariat
          </Link>
        </section>
      </SiteContainer>
    </main>
  );
}
