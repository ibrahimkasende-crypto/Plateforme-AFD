"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminSearchProps = {
  className?: string;
};

export function AdminSearch({ className }: AdminSearchProps) {
  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <input
        type="search"
        placeholder="Rechercher des projets, activités, bénéficiaires…"
        className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/20"
        aria-label="Rechercher"
      />
    </div>
  );
}
