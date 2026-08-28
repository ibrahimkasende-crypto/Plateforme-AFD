"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { saveBankCoordinatesAction } from "@/features/dons/actions/manage-bank-coordinates";
import type { Database } from "@/types/database.types";

type Coords = Database["public"]["Tables"]["dons_coordonnees_bancaires"]["Row"];

export function BankCoordinatesForm({ initial }: { initial: Coords }) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    bank_name: initial.bank_name,
    account_holder: initial.account_holder,
    account_usd: initial.account_usd,
    account_cdf: initial.account_cdf,
    swift: initial.swift,
    usd_enabled: initial.usd_enabled,
    cdf_enabled: initial.cdf_enabled,
    instructions: initial.instructions ?? "",
    correspondent_usd_bank: initial.correspondent_usd_bank ?? "",
    correspondent_usd_address: initial.correspondent_usd_address ?? "",
    correspondent_usd_swift: initial.correspondent_usd_swift ?? "",
    correspondent_eur_bank: initial.correspondent_eur_bank ?? "",
    correspondent_eur_address: initial.correspondent_eur_address ?? "",
    correspondent_eur_swift: initial.correspondent_eur_swift ?? "",
    eur_note: initial.eur_note ?? "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      className="max-w-3xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await saveBankCoordinatesAction({
            id: initial.id === "fallback" ? undefined : initial.id,
            ...form,
          });
          if (!res.ok) toast.error(res.message);
          else toast.success(res.message);
        });
      }}
    >
      {(
        [
          ["bank_name", "Nom de banque"],
          ["account_holder", "Titulaire"],
          ["account_usd", "Compte USD"],
          ["account_cdf", "Compte CDF"],
          ["swift", "SWIFT"],
          ["instructions", "Instructions"],
          ["correspondent_usd_bank", "Correspondant USD — banque"],
          ["correspondent_usd_address", "Correspondant USD — adresse"],
          ["correspondent_usd_swift", "Correspondant USD — SWIFT"],
          ["correspondent_eur_bank", "Correspondant EUR — banque (info)"],
          ["correspondent_eur_address", "Correspondant EUR — adresse"],
          ["correspondent_eur_swift", "Correspondant EUR — SWIFT"],
          ["eur_note", "Note EUR"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block space-y-1">
          <span className="text-sm font-medium">{label}</span>
          {key === "instructions" || key === "eur_note" || key.includes("address") ? (
            <textarea
              className="min-h-20 w-full rounded border p-3"
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
            />
          ) : (
            <input
              className="w-full rounded border p-3 font-mono text-sm"
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
            />
          )}
        </label>
      ))}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.usd_enabled}
          onChange={(e) => set("usd_enabled", e.target.checked)}
        />
        Devise USD activée
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.cdf_enabled}
          onChange={(e) => set("cdf_enabled", e.target.checked)}
        />
        Devise CDF activée
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Enregistrer les coordonnées bancaires"}
      </button>
    </form>
  );
}
