import Link from "next/link";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/bibliotheque", label: "Vue d’ensemble" },
  { href: "/bibliotheque/phototheque", label: "Photothèque" },
  { href: "/bibliotheque/videotheque", label: "Vidéothèque" },
  { href: "/bibliotheque/rapports", label: "Rapports" },
  { href: "/bibliotheque/documents", label: "Documents" },
  { href: "/bibliotheque/archives", label: "Archives" },
] as const;

export function LibrarySectionNav({
  current,
  className,
}: {
  current?: string;
  className?: string;
}) {
  return (
    <nav
      aria-label="Sections de la bibliothèque"
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {LINKS.map((link) => {
        const active =
          current === link.href ||
          (link.href !== "/bibliotheque" && current?.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
              active
                ? "border-[var(--afd-blue)] bg-[var(--afd-blue)] text-white"
                : "border-[var(--afd-border)] bg-white text-[var(--afd-ink)] hover:border-[var(--afd-blue)]/40",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
