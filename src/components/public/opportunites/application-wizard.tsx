"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { submitOpportunityApplication } from "@/features/opportunites/actions/submit-opportunity-application";
import { cn } from "@/lib/utils";

const personalSchema = z.object({
  prenom: z.string().trim().min(1).max(100),
  nom: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  telephone: z.string().trim().min(6).max(50),
  pays: z.string().trim().min(1).max(100),
  province: z.string().trim().max(120).optional(),
  ville: z.string().trim().min(1).max(160),
});

const profileSchema = z.object({
  niveau_etudes: z.string().trim().max(160).optional(),
  experience: z.string().trim().max(500).optional(),
  competences: z.string().trim().max(1000).optional(),
});

const motivationSchema = z.object({
  lettreMotivation: z.string().trim().min(30).max(6000),
  disponibilite: z.string().trim().max(300).optional(),
});

const steps = [
  "Informations personnelles",
  "Profil professionnel",
  "Motivation",
  "Documents",
  "Vérification",
] as const;

type WizardProps = {
  opportunityId: string;
  opportunitySlug: string;
  opportunityTitle: string;
  localisation: string | null;
  dateLimite: string | null;
  closed: boolean;
};

export function ApplicationWizard({
  opportunityId,
  opportunitySlug,
  opportunityTitle,
  localisation,
  dateLimite,
  closed,
}: WizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(false);
  const [exactitude, setExactitude] = useState(false);
  const [cv, setCv] = useState<File | null>(null);
  const [lettre, setLettre] = useState<File | null>(null);
  const [values, setValues] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    pays: "RDC",
    province: "",
    ville: "",
    niveau_etudes: "",
    experience: "",
    competences: "",
    lettreMotivation: "",
    disponibilite: "",
  });

  const progress = useMemo(
    () => Math.round(((step + 1) / steps.length) * 100),
    [step],
  );

  function update<K extends keyof typeof values>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validateCurrentStep(): string | null {
    if (step === 0) {
      const parsed = personalSchema.safeParse(values);
      return parsed.success ? null : "Complétez les informations personnelles.";
    }
    if (step === 1) {
      const parsed = profileSchema.safeParse(values);
      return parsed.success ? null : "Vérifiez le profil professionnel.";
    }
    if (step === 2) {
      const parsed = motivationSchema.safeParse(values);
      return parsed.success
        ? null
        : "La motivation doit contenir au moins 30 caractères.";
    }
    if (step === 3) {
      if (!cv) return "Le CV est obligatoire (PDF ou DOCX, 5 Mo max).";
      if (cv.size > 5 * 1024 * 1024) return "Le CV dépasse 5 Mo.";
      return null;
    }
    if (step === 4) {
      if (!consent || !exactitude) {
        return "Confirmez le consentement et l’exactitude des informations.";
      }
    }
    return null;
  }

  function next() {
    const error = validateCurrentStep();
    if (error) {
      toast.error(error);
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function back() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function submit() {
    const error = validateCurrentStep();
    if (error) {
      toast.error(error);
      return;
    }
    if (!cv) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.set("opportuniteId", opportunityId);
      formData.set("prenom", values.prenom);
      formData.set("nom", values.nom);
      formData.set("email", values.email);
      formData.set("telephone", values.telephone);
      formData.set("pays", values.pays);
      formData.set("ville", values.ville);
      formData.set(
        "localisation",
        [values.province, values.ville].filter(Boolean).join(", "),
      );
      formData.set("niveau_etudes", values.niveau_etudes);
      formData.set("experience", values.experience);
      formData.set(
        "lettreMotivation",
        [
          values.lettreMotivation,
          values.competences
            ? `\n\nCompétences : ${values.competences}`
            : "",
          values.disponibilite
            ? `\n\nDisponibilité : ${values.disponibilite}`
            : "",
        ].join(""),
      );
      formData.set("consentement", "on");
      formData.set("website", honeypot);
      formData.set("cv", cv);
      if (lettre) formData.set("lettre", lettre);

      const result = await submitOpportunityApplication(formData);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push(
        `/ressources/opportunites/candidature-confirmee?ref=${encodeURIComponent(result.reference ?? "")}&slug=${encodeURIComponent(opportunitySlug)}`,
      );
    });
  }

  if (closed) {
    return (
      <div className="rounded-2xl border border-[var(--afd-border)] bg-white p-6">
        <p className="text-[var(--afd-muted)]">
          Les candidatures sont fermées pour cette offre.
        </p>
        <Link
          href="/ressources/opportunites"
          className="mt-4 inline-flex text-sm font-semibold text-[var(--afd-blue)]"
        >
          Voir les autres opportunités
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[22px] border border-[var(--afd-border)] bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6">
        <p className="text-sm font-semibold text-[var(--afd-navy)]">
          {opportunityTitle}
        </p>
        <p className="mt-1 text-sm text-[var(--afd-muted)]">
          {[localisation, dateLimite ? `Limite : ${dateLimite}` : null]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--afd-surface)]">
          <div
            className="h-full rounded-full bg-[var(--afd-blue)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-[12px] font-medium text-[var(--afd-muted)]">
          Étape {step + 1}/{steps.length} — {steps[step]}
        </p>
      </div>

      <div className="sr-only" aria-hidden>
        <label htmlFor="application-website">Site web</label>
        <input
          id="application-website"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {step === 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["prenom", "Prénom"],
              ["nom", "Nom"],
              ["email", "E-mail"],
              ["telephone", "Téléphone"],
              ["pays", "Pays"],
              ["province", "Province (facultatif)"],
              ["ville", "Ville"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm sm:col-span-1">
              <span className="mb-1 block font-semibold text-[var(--afd-navy)]">
                {label}
              </span>
              <input
                value={values[key]}
                onChange={(event) => update(key, event.target.value)}
                className="min-h-11 w-full rounded-xl border border-[var(--afd-border)] px-3"
                type={key === "email" ? "email" : "text"}
              />
            </label>
          ))}
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-[var(--afd-navy)]">
              Niveau d’études (facultatif)
            </span>
            <input
              value={values.niveau_etudes}
              onChange={(event) => update("niveau_etudes", event.target.value)}
              className="min-h-11 w-full rounded-xl border border-[var(--afd-border)] px-3"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-[var(--afd-navy)]">
              Expérience (facultatif)
            </span>
            <input
              value={values.experience}
              onChange={(event) => update("experience", event.target.value)}
              className="min-h-11 w-full rounded-xl border border-[var(--afd-border)] px-3"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-[var(--afd-navy)]">
              Compétences principales (facultatif)
            </span>
            <textarea
              value={values.competences}
              onChange={(event) => update("competences", event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-[var(--afd-border)] px-3 py-2"
            />
          </label>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-[var(--afd-navy)]">
              Motivation
            </span>
            <textarea
              value={values.lettreMotivation}
              onChange={(event) =>
                update("lettreMotivation", event.target.value)
              }
              rows={7}
              className="w-full rounded-xl border border-[var(--afd-border)] px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-[var(--afd-navy)]">
              Disponibilité (facultatif)
            </span>
            <input
              value={values.disponibilite}
              onChange={(event) => update("disponibilite", event.target.value)}
              className="min-h-11 w-full rounded-xl border border-[var(--afd-border)] px-3"
            />
          </label>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-[var(--afd-navy)]">
              CV (PDF ou DOCX, max. 5 Mo) *
            </span>
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => setCv(event.target.files?.[0] ?? null)}
              className="block w-full text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-[var(--afd-navy)]">
              Lettre de motivation (fichier, facultatif)
            </span>
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => setLettre(event.target.files?.[0] ?? null)}
              className="block w-full text-sm"
            />
          </label>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-4 text-sm text-[var(--afd-muted)]">
          <div className="rounded-xl bg-[var(--afd-surface)] p-4">
            <p>
              <strong className="text-[var(--afd-navy)]">Candidat·e :</strong>{" "}
              {values.prenom} {values.nom}
            </p>
            <p className="mt-1">
              <strong className="text-[var(--afd-navy)]">E-mail :</strong>{" "}
              {values.email}
            </p>
            <p className="mt-1">
              <strong className="text-[var(--afd-navy)]">Téléphone :</strong>{" "}
              {values.telephone}
            </p>
            <p className="mt-1">
              <strong className="text-[var(--afd-navy)]">CV :</strong>{" "}
              {cv?.name ?? "—"}
            </p>
          </div>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={exactitude}
              onChange={(event) => setExactitude(event.target.checked)}
              className="mt-1"
            />
            <span>
              Je confirme l’exactitude des informations fournies dans cette
              candidature.
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1"
            />
            <span>
              J’accepte le traitement de mes données pour cette candidature,
              conformément à la{" "}
              <Link
                href="/politique-confidentialite"
                className="font-semibold text-[var(--afd-blue)] underline"
              >
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="min-h-11 rounded-xl border border-[var(--afd-border)] px-4 text-sm font-semibold"
          >
            Retour
          </button>
        ) : null}
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="min-h-11 rounded-xl bg-[var(--afd-blue)] px-5 text-sm font-semibold text-white"
          >
            Continuer
          </button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={submit}
            className={cn(
              "min-h-11 rounded-xl bg-[var(--afd-orange)] px-5 text-sm font-semibold text-white disabled:opacity-60",
            )}
          >
            {pending ? "Envoi…" : "Envoyer ma candidature"}
          </button>
        )}
      </div>
    </div>
  );
}
