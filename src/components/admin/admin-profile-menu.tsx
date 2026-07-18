"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Database, ExternalLink, KeyRound, LogOut } from "lucide-react";
import { signOut } from "@/actions/auth";
import { PresentationDataDialog } from "@/components/admin/presentation-data-dialog";
import type { AdminViewer } from "@/features/statistiques/types/dashboard";

type AdminProfileMenuProps = {
  viewer: AdminViewer;
};

export function AdminProfileMenu({ viewer }: AdminProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const [presentationOpen, setPresentationOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isSuperAdmin = viewer.role === "super_admin";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-100"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-[#0d254e] text-xs font-semibold text-white">
          {viewer.initials}
        </span>
        <span className="hidden text-left md:block">
          <span className="block text-sm font-medium text-slate-900">
            {viewer.displayName}
          </span>
          <span className="block text-xs text-slate-500">{viewer.roleLabel}</span>
        </span>
        <ChevronDown className="hidden size-4 text-slate-400 md:block" aria-hidden />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          <Link
            href="/"
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="size-4" aria-hidden />
            Voir le site
          </Link>
          {isSuperAdmin ? (
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setOpen(false);
                setPresentationOpen(true);
              }}
            >
              <Database className="size-4" aria-hidden />
              Gérer les données de présentation
            </button>
          ) : null}
          <Link
            href="/nouveau-mot-de-passe"
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            <KeyRound className="size-4" aria-hidden />
            Changer le mot de passe
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              <LogOut className="size-4" aria-hidden />
              Déconnexion
            </button>
          </form>
        </div>
      ) : null}

      <PresentationDataDialog
        open={presentationOpen}
        onClose={() => setPresentationOpen(false)}
      />
    </div>
  );
}
