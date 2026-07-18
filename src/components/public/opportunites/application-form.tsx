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
    <form action={formAction} encType="multipart/form-data" className="space-y-4 rounded-2xl border border-[var(--afd-border)] bg-white p-6">
      {opportunityId ? <input type="hidden" name="opportuniteId" value={opportunityId} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <input required name="prenom" placeholder="Prénom" className="rounded-lg border p-3" />
        <input required name="nom" placeholder="Nom" className="rounded-lg border p-3" />
      </div>
      <input required name="email" type="email" placeholder="E-mail" className="w-full rounded-lg border p-3" />
      <input name="telephone" placeholder="Téléphone (facultatif)" className="w-full rounded-lg border p-3" />
      <div className="grid gap-4 sm:grid-cols-2"><input name="pays" placeholder="Pays (facultatif)" className="rounded-lg border p-3" /><input name="ville" placeholder="Ville / province (facultatif)" className="rounded-lg border p-3" /></div>
      <input name="niveau_etudes" placeholder="Niveau d’études (facultatif)" className="w-full rounded-lg border p-3" />
      <input name="experience" placeholder="Expérience (facultatif)" className="w-full rounded-lg border p-3" />
      {spontaneous ? <><input name="domaine_souhaite" placeholder="Domaine souhaité" className="w-full rounded-lg border p-3" /><input name="localisation" placeholder="Type de collaboration souhaité / localisation" className="w-full rounded-lg border p-3" /></> : null}
      <textarea required name="lettreMotivation" minLength={30} rows={6} placeholder="Lettre de motivation" className="w-full rounded-lg border p-3" />
      <label className="block text-sm text-[var(--afd-muted)]">CV {spontaneous ? "(facultatif mais recommandé)" : ""}<input required={!spontaneous} name="cv" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="mt-1 block w-full" /></label>
      <label className="block text-sm text-[var(--afd-muted)]">Lettre en pièce jointe (facultatif)<input name="lettre" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="mt-1 block w-full" /></label>
      <label className="flex gap-2 text-sm text-[var(--afd-muted)]"><input required name="consentement" type="checkbox" /> J’accepte le traitement de mes données pour cette candidature.</label>
      {state.message ? <p role="status" className={state.ok ? "text-green-700" : "text-red-700"}>{state.message}</p> : null}
      <button disabled={pending} className="rounded-lg bg-[var(--afd-blue)] px-5 py-3 font-semibold text-white disabled:opacity-60">
        {pending ? "Envoi…" : "Envoyer ma candidature"}
      </button>
    </form>
  );
}
