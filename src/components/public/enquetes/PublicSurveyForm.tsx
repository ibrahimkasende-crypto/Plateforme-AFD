"use client";

import { useActionState } from "react";
import {
  submitPublicSurvey,
  type SurveySubmitState,
} from "@/features/enquetes/actions/submit-public-survey";
import type {
  OptionQuestion,
  QuestionEnquete,
} from "@/features/enquetes/types";

type Question = QuestionEnquete & { options: OptionQuestion[] };

const initialState: SurveySubmitState = { ok: false, message: "" };

export function PublicSurveyForm({
  enqueteId,
  slug,
  consentRequired,
  questions,
}: {
  enqueteId: string;
  slug: string;
  consentRequired: boolean;
  questions: Question[];
}) {
  const [state, action, pending] = useActionState(submitPublicSurvey, initialState);

  return (
    <form action={action} className="afd-form-shell space-y-5">
      <input type="hidden" name="enquete_id" value={enqueteId} />
      <input type="hidden" name="slug" value={slug} />
      <div className="hidden" aria-hidden>
        <label>
          Site web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <label className="block text-sm font-semibold text-[var(--afd-ink)]">
            {question.libelle}
            {question.obligatoire ? " *" : ""}
          </label>
          {question.aide ? (
            <p className="text-xs text-[var(--afd-muted)]">{question.aide}</p>
          ) : null}
          {renderField(question)}
        </div>
      ))}

      {consentRequired ? (
        <label className="flex items-start gap-2 text-sm">
          <input name="consentement" type="checkbox" className="mt-1" required />
          <span>
            J’accepte que mes réponses soient collectées par l’AFD dans le cadre
            de cette enquête.
          </span>
        </label>
      ) : null}

      {state.message ? (
        <p
          className={
            state.ok
              ? "rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
              : "rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          }
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || state.ok}
        className="inline-flex min-h-11 items-center rounded-lg bg-[var(--afd-blue)] px-5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Envoi…" : state.ok ? "Réponse envoyée" : "Envoyer"}
      </button>
    </form>
  );
}

function renderField(question: Question) {
  const name = `q_${question.id}`;
  const required = question.obligatoire;

  switch (question.type_question) {
    case "texte_long":
      return (
        <textarea
          name={name}
          required={required}
          className="afd-field min-h-28 w-full"
        />
      );
    case "nombre":
    case "note":
    case "echelle":
      return (
        <input
          name={name}
          type="number"
          required={required}
          className="afd-field w-full"
        />
      );
    case "date":
      return (
        <input
          name={name}
          type="date"
          required={required}
          className="afd-field w-full"
        />
      );
    case "telephone":
      return (
        <input
          name={name}
          type="tel"
          required={required}
          className="afd-field w-full"
        />
      );
    case "email":
      return (
        <input
          name={name}
          type="email"
          required={required}
          className="afd-field w-full"
        />
      );
    case "oui_non":
      return (
        <select name={name} required={required} className="afd-field w-full">
          <option value="">Choisir</option>
          <option value="oui">Oui</option>
          <option value="non">Non</option>
        </select>
      );
    case "liste":
    case "choix_unique":
      return (
        <select name={name} required={required} className="afd-field w-full">
          <option value="">Choisir</option>
          {question.options.map((option) => (
            <option key={option.id} value={option.valeur}>
              {option.libelle}
            </option>
          ))}
        </select>
      );
    case "choix_multiple":
      return (
        <div className="space-y-2">
          {question.options.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name={name} value={option.valeur} />
              {option.libelle}
            </label>
          ))}
        </div>
      );
    default:
      return (
        <input
          name={name}
          type="text"
          required={required}
          className="afd-field w-full"
        />
      );
  }
}
