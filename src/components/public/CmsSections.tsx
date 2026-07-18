import type { CmsPageSection } from "@/lib/queries/public/pages";

export function CmsSections({ sections }: { sections: CmsPageSection[] }) {
  if (sections.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-6 text-sm text-[var(--afd-muted)]">
        Aucun contenu n’est actuellement publié dans cette section. Les
        prochaines informations seront affichées après validation par l’AFD.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.id} className="space-y-3">
          {section.titre ? (
            <h2 className="text-xl font-semibold text-[var(--afd-ink)]">
              {section.titre}
            </h2>
          ) : null}
          {section.sous_titre ? (
            <p className="text-sm font-medium text-[var(--afd-blue)]">
              {section.sous_titre}
            </p>
          ) : null}
          {section.contenu ? (
            <div className="whitespace-pre-wrap text-base leading-relaxed text-[var(--afd-muted)]">
              {section.contenu}
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
