"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export function NewsExpandablePreview({
  slug,
  preview,
  className,
}: {
  slug: string;
  preview: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const reactId = useId();
  const contentId = `news-preview-${slug}-${reactId}`;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={className}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[var(--afd-blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--afd-blue)]"
          aria-expanded={open}
          aria-controls={contentId}
        >
          {open ? "Réduire" : "Lire le résumé"}
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-250 motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent
        id={contentId}
        className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
      >
        <p className="mt-3 max-w-[65ch] font-[family-name:var(--font-body)] text-[14px] leading-[1.65] text-[#5F6F83] sm:text-[15px]">
          {preview}
        </p>
        <Link
          href={`/actualites/${slug}`}
          className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-[var(--afd-orange)] underline-offset-4 hover:underline"
        >
          Ouvrir l’article complet
        </Link>
      </CollapsibleContent>
    </Collapsible>
  );
}
