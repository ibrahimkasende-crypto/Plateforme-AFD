"use client";

import { Download, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";

export function LibraryShareActions({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Lien copié dans le presse-papiers.");
    } catch {
      toast.error("Impossible de partager pour le moment.");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => void share()}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        <Share2 className="size-4" aria-hidden />
        Partager
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        <Printer className="size-4" aria-hidden />
        Imprimer
      </button>
      <a
        href={url}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        download
      >
        <Download className="size-4" aria-hidden />
        Télécharger la fiche
      </a>
    </div>
  );
}
