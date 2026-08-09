"use client";

import { useState, useTransition } from "react";
import { associateMailboxAction } from "@/features/messagerie/actions/mailbox-actions";

type UserOption = {
  id: string;
  email: string;
  nom_complet: string | null;
};

export function AssociateMailboxForm({ users }: { users: UserOption[] }) {
  const [pending, startTransition] = useTransition();
  const [userId, setUserId] = useState(users[0]?.id ?? "");
  const [emailAddress, setEmailAddress] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const result = await associateMailboxAction({
        userId,
        emailAddress,
        displayName: displayName || undefined,
      });
      setFeedback(result);
      if (result.ok) {
        setEmailAddress("");
        setDisplayName("");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <label className="block text-sm sm:col-span-2">
        <span className="mb-1 block font-medium text-slate-700">Utilisateur</span>
        <select
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {(u.nom_complet || u.email) + ` — ${u.email}`}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">
          Adresse @afd-rdc.org
        </span>
        <input
          type="email"
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          placeholder="prenom.nom@afd-rdc.org"
          required
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">
          Nom affiché (optionnel)
        </span>
        <input
          type="text"
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </label>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending || !userId}
          className="rounded-lg bg-[var(--admin-primary,#0d254e)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Association…" : "Associer la boîte"}
        </button>
        {feedback ? (
          <p
            className={`mt-2 text-sm ${feedback.ok ? "text-emerald-700" : "text-red-700"}`}
          >
            {feedback.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
