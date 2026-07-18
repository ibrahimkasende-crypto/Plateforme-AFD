"use client";

import { useActionState } from "react";
import {
  submitApplication,
  type ApplicationActionState,
} from "@/features/opportunites/actions/submit-application";
import { submitSpontaneousApplication } from "@/features/opportunites/actions/submit-spontaneous";

const initialState: ApplicationActionState = { ok: false, message: "" };

export function ApplicationForm({
  opportunityId,
  spontaneous = false,
}: {
  opportunityId?: string;
  spontaneous?: boolean;
}) {
  const action = spontaneous ? submitSpontaneousApplication : submitApplication;
  const [state, formAction, pending] = useActionState(action, initialState);
  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-[var(--afd-border)] bg-white p-6">
      {opportunityId ? <input type="hidden" name="opportuniteId" value={opportunityId} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <input required name="prenom" placeholder="Prénom" className="rounded-lg border p-3" />
        <input required name="nom" placeholder="Nom" className="rounded-lg border p-3" />
      </div>
      <input required name="email" type="email" placeholder="E-mail" className="w-full rounded-lg border p-3" />
      <input name="telephone" placeholder="Téléphone (facultatif)" className="w-full rounded-lg border p-3" />
      <input name="localisation" placeholder="Localisation (facultatif)" className="w-full rounded-lg border p-3" />
      <textarea required name="lettreMotivation" minLength={30} rows={6} placeholder="Lettre de motivation" className="w-full rounded-lg border p-3" />
      <label className="flex gap-2 text-sm text-[var(--afd-muted)]"><input required name="consentement" type="checkbox" /> J’accepte le traitement de mes données pour cette candidature.</label>
      {state.message ? <p role="status" className={state.ok ? "text-green-700" : "text-red-700"}>{state.message}</p> : null}
      <button disabled={pending} className="rounded-lg bg-[var(--afd-blue)] px-5 py-3 font-semibold text-white disabled:opacity-60">
        {pending ? "Envoi…" : "Envoyer ma candidature"}
      </button>
    </form>
  );
}
