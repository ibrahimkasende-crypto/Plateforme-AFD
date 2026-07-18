import { FadeIn } from "@/components/motion/FadeIn";
import { FeaturedNewsCard } from "@/components/public/news/featured-news-card";
import { NewsCard } from "@/components/public/news/news-card";
import type { PublicNewsItem } from "@/lib/queries/public/news";

export function NewsGrid({
  items,
  featured = true,
  expandablePreview = false,
}: {
  items: PublicNewsItem[];
  featured?: boolean;
  expandablePreview?: boolean;
}) {
  if (items.length === 0) return null;

  const [main, ...rest] = items;

  return (
    <div className="space-y-6">
      {featured && main ? (
        <FadeIn>
          <FeaturedNewsCard item={main} expandable={expandablePreview} />
        </FadeIn>
      ) : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {(featured ? rest : items).map((item, index) => (
          <FadeIn key={item.id} delay={0.04 * index} className="min-w-0">
            <NewsCard item={item} expandable={expandablePreview && !featured} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

/** Composition accueil : 1 mise en avant + 2 secondaires. */
export function HomeNewsComposition({ items }: { items: PublicNewsItem[] }) {
  if (items.length === 0) return null;

  const [main, ...secondary] = items;

  return (
    <div className="space-y-5">
      {main ? (
        <FadeIn>
          <FeaturedNewsCard item={main} expandable />
        </FadeIn>
      ) : null}
      {secondary.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {secondary.slice(0, 2).map((item, index) => (
            <FadeIn key={item.id} delay={0.04 * (index + 1)} className="min-w-0">
              <NewsCard item={item} expandable />
            </FadeIn>
          ))}
        </div>
      ) : null}
    </div>
  );
}
