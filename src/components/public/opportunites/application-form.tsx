"use client";

import { useActionState } from "react";
import {
  checkboxClassName,
  errorClassName,
  fieldClassName,
  fileClassName,
  formClassName,
  formShellClassName,
  submitClassName,
  textareaClassName,
} from "@/components/ui/form-styles";
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
    <div className={formShellClassName}>
      <form
        action={formAction}
        encType="multipart/form-data"
        className={formClassName}
      >
        {opportunityId ? (
          <input type="hidden" name="opportuniteId" value={opportunityId} />
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            required
            name="prenom"
            placeholder="Prénom"
            className={fieldClassName}
          />
          <input
            required
            name="nom"
            placeholder="Nom"
            className={fieldClassName}
          />
        </div>
        <input
          required
          name="email"
          type="email"
          placeholder="E-mail"
          className={fieldClassName}
        />
        <input
          name="telephone"
          placeholder="Téléphone (facultatif)"
          className={fieldClassName}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="pays"
            placeholder="Pays (facultatif)"
            className={fieldClassName}
          />
          <input
            name="ville"
            placeholder="Ville / province (facultatif)"
            className={fieldClassName}
          />
        </div>
        <input
          name="niveau_etudes"
          placeholder="Niveau d’études (facultatif)"
          className={fieldClassName}
        />
        <input
          name="experience"
          placeholder="Expérience (facultatif)"
          className={fieldClassName}
        />
        {spontaneous ? (
          <>
            <input
              name="domaine_souhaite"
              placeholder="Domaine souhaité"
              className={fieldClassName}
            />
            <input
              name="localisation"
              placeholder="Type de collaboration souhaité / localisation"
              className={fieldClassName}
            />
          </>
        ) : null}
        <textarea
          required
          name="lettreMotivation"
          minLength={30}
          rows={6}
          placeholder="Lettre de motivation"
          className={textareaClassName}
        />
        <label className="block text-sm text-[var(--afd-muted)]">
          CV {spontaneous ? "(facultatif mais recommandé)" : ""}
          <input
            required={!spontaneous}
            name="cv"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className={fileClassName}
          />
        </label>
        <label className="block text-sm text-[var(--afd-muted)]">
          Lettre en pièce jointe (facultatif)
          <input
            name="lettre"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className={fileClassName}
          />
        </label>
        <label className="flex items-start gap-3 text-sm text-[var(--afd-muted)]">
          <input
            required
            name="consentement"
            type="checkbox"
            className={checkboxClassName}
          />
          <span>
            J’accepte le traitement de mes données pour cette candidature.
          </span>
        </label>
        {state.message ? (
          <p
            role="status"
            className={state.ok ? "text-[var(--afd-success)]" : errorClassName}
          >
            {state.message}
          </p>
        ) : null}
        <button disabled={pending} className={submitClassName}>
          {pending ? "Envoi…" : "Envoyer ma candidature"}
        </button>
      </form>
    </div>
  );
}
