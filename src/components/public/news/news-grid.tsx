import { FadeIn } from "@/components/motion/FadeIn";
import { FeaturedNewsCard } from "@/components/public/news/featured-news-card";
import { NewsCard } from "@/components/public/news/news-card";
import type { PublicNewsItem } from "@/lib/queries/public/news";

export function NewsGrid({
  items,
  featured = true,
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
          <FeaturedNewsCard item={main} expandable={false} />
        </FadeIn>
      ) : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {(featured ? rest : items).map((item, index) => (
          <FadeIn key={item.id} delay={0.04 * index} className="min-w-0">
            <NewsCard item={item} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

/** Accueil : grille moderne de 3 actualités. */
export function HomeNewsComposition({ items }: { items: PublicNewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {items.slice(0, 3).map((item, index) => (
        <FadeIn key={item.id} delay={0.04 * index} className="min-w-0">
          <NewsCard item={item} />
        </FadeIn>
      ))}
    </div>
  );
}
