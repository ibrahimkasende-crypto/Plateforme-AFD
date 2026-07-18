import { HorizontalCardRail } from "@/components/mobile/horizontal-card-rail";
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
  const gridItems = featured ? rest : items;

  return (
    <div className="space-y-6">
      {featured && main ? (
        <FadeIn>
          <FeaturedNewsCard item={main} expandable={false} />
        </FadeIn>
      ) : null}

      <HorizontalCardRail
        label="Actualités"
        desktopClassName="md:grid-cols-2 lg:grid-cols-3 md:gap-5"
        className="-mx-4 md:mx-0"
      >
        {gridItems.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </HorizontalCardRail>
    </div>
  );
}

/** Accueil : grille moderne de 3 actualités. */
export function HomeNewsComposition({ items }: { items: PublicNewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <HorizontalCardRail
      label="Actualités récentes"
      desktopClassName="md:grid-cols-2 lg:grid-cols-3 lg:gap-6 md:gap-5"
      className="-mx-4 md:mx-0"
    >
      {items.slice(0, 3).map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </HorizontalCardRail>
  );
}
