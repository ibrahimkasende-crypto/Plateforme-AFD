import { HomeSectionSkeleton } from "@/components/public/home/home-section-skeleton";

export default function PublicLoading() {
  return (
    <>
      <div className="border-b border-[var(--afd-border)] bg-[var(--afd-navy)] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl animate-pulse space-y-4 text-center">
            <div className="mx-auto h-3 w-24 rounded bg-white/20" />
            <div className="mx-auto h-10 w-3/4 rounded bg-white/20" />
            <div className="mx-auto h-4 w-full rounded bg-white/15" />
          </div>
        </div>
      </div>
      <HomeSectionSkeleton cards={3} />
    </>
  );
}
