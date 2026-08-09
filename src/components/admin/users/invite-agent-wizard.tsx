"use client";

import { useState } from "react";
import {
  employmentTypeCodes,
  employmentTypeLabels,
} from "@/config/afd-staff";
import { roleLabels, type Role } from "@/config/roles";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  selectableRoles: Role[];
  defaultRole: Role;
  inviteAvailable: boolean;
  actorIsPrincipal: boolean;
};

const STEPS = [
  "Identité",
  "Contact",
  "Professionnel",
  "Rôle et accès",
  "Vérification",
] as const;

export function InviteAgentWizard({
  action,
  selectableRoles,
  defaultRole,
  inviteAvailable,
  actorIsPrincipal,
}: Props) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    prenom: "",
    deuxieme_prenom: "",
    nom: "",
    postnom: "",
    sexe: "",
    date_naissance: "",
    matricule: "",
    email: "",
    telephone: "",
    telephone_secondaire: "",
    adresse: "",
    commune: "",
    ville: "",
    province: "",
    pays: "RD Congo",
    fonction: "",
    poste: "",
    employment_type: "employe_permanent",
    date_entree: "",
    bureau: "",
    province_affectation: "",
    territoire: "",
    role: defaultRole,
    require_mfa: false,
    reason: "",
  });

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  const nomComplet = [values.prenom, values.deuxieme_prenom, values.nom, values.postnom]
    .filter(Boolean)
    .join(" ")
    .trim();

  function canNext(): boolean {
    if (step === 0) return Boolean(values.prenom && values.nom);
    if (step === 1) return Boolean(values.email);
    if (step === 3) return Boolean(values.role);
    return true;
  }

  return (
    <div className="space-y-6">
      <ol className="flex flex-wrap gap-2 text-xs sm:text-sm">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={`rounded-full px-3 py-1 font-semibold ${
              index === step
                ? "bg-[var(--afd-blue)] text-white"
                : index < step
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      <form action={action} className="space-y-5">
        <input type="hidden" name="nom_complet" value={nomComplet || values.email} />
        <input type="hidden" name="email" value={values.email} />
        <input type="hidden" name="telephone" value={values.telephone} />
        <input type="hidden" name="fonction" value={values.fonction || values.poste} />
        <input type="hidden" name="role" value={values.role} />
        {values.require_mfa ? <input type="hidden" name="require_mfa" value="on" /> : null}
        <input type="hidden" name="reason" value={values.reason} />

        {step === 0 ? (
          <fieldset className="grid gap-4 rounded-xl border bg-white p-4 sm:grid-cols-2" disabled={!inviteAvailable}>
            <legend className="px-2 text-sm font-semibold">Identité</legend>
            <label className="block space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">Prénom *</span>
              <input
                className="w-full rounded border p-3"
                value={values.prenom}
                onChange={(e) => update("prenom", e.target.value)}
                required
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Deuxième prénom</span>
              <input
                className="w-full rounded border p-3"
                value={values.deuxieme_prenom}
                onChange={(e) => update("deuxieme_prenom", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Nom *</span>
              <input
                className="w-full rounded border p-3"
                value={values.nom}
                onChange={(e) => update("nom", e.target.value)}
                required
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Postnom</span>
              <input
                className="w-full rounded border p-3"
                value={values.postnom}
                onChange={(e) => update("postnom", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Sexe</span>
              <select
                className="w-full rounded border p-3"
                value={values.sexe}
                onChange={(e) => update("sexe", e.target.value)}
              >
                <option value="">—</option>
                <option value="F">Féminin</option>
                <option value="M">Masculin</option>
                <option value="X">Autre / non précisé</option>
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Date de naissance</span>
              <input
                type="date"
                className="w-full rounded border p-3"
                value={values.date_naissance}
                onChange={(e) => update("date_naissance", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">Matricule interne</span>
              <input
                className="w-full rounded border p-3"
                value={values.matricule}
                onChange={(e) => update("matricule", e.target.value)}
              />
            </label>
            <p className="text-xs text-slate-500 sm:col-span-2">
              La photo de profil sera ajoutée par l’utilisateur après activation
              (Mon profil), ou par un administrateur sur sa fiche.
            </p>
          </fieldset>
        ) : null}

        {step === 1 ? (
          <fieldset className="grid gap-4 rounded-xl border bg-white p-4 sm:grid-cols-2" disabled={!inviteAvailable}>
            <legend className="px-2 text-sm font-semibold">Contact</legend>
            <label className="block space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">E-mail professionnel *</span>
              <input
                type="email"
                className="w-full rounded border p-3"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Téléphone principal</span>
              <input
                type="tel"
                className="w-full rounded border p-3"
                value={values.telephone}
                onChange={(e) => update("telephone", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Téléphone secondaire</span>
              <input
                type="tel"
                className="w-full rounded border p-3"
                value={values.telephone_secondaire}
                onChange={(e) => update("telephone_secondaire", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">Adresse</span>
              <input
                className="w-full rounded border p-3"
                value={values.adresse}
                onChange={(e) => update("adresse", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Commune</span>
              <input
                className="w-full rounded border p-3"
                value={values.commune}
                onChange={(e) => update("commune", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Ville</span>
              <input
                className="w-full rounded border p-3"
                value={values.ville}
                onChange={(e) => update("ville", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Province</span>
              <input
                className="w-full rounded border p-3"
                value={values.province}
                onChange={(e) => update("province", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Pays</span>
              <input
                className="w-full rounded border p-3"
                value={values.pays}
                onChange={(e) => update("pays", e.target.value)}
              />
            </label>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className="grid gap-4 rounded-xl border bg-white p-4 sm:grid-cols-2" disabled={!inviteAvailable}>
            <legend className="px-2 text-sm font-semibold">Informations professionnelles</legend>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Fonction</span>
              <input
                className="w-full rounded border p-3"
                value={values.fonction}
                onChange={(e) => update("fonction", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Poste</span>
              <input
                className="w-full rounded border p-3"
                value={values.poste}
                onChange={(e) => update("poste", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">Type d’agent</span>
              <select
                className="w-full rounded border p-3"
                value={values.employment_type}
                onChange={(e) => update("employment_type", e.target.value)}
              >
                {employmentTypeCodes.map((code) => (
                  <option key={code} value={code}>
                    {employmentTypeLabels[code]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Date d’entrée</span>
              <input
                type="date"
                className="w-full rounded border p-3"
                value={values.date_entree}
                onChange={(e) => update("date_entree", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Bureau</span>
              <input
                className="w-full rounded border p-3"
                value={values.bureau}
                onChange={(e) => update("bureau", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Province d’affectation</span>
              <input
                className="w-full rounded border p-3"
                value={values.province_affectation}
                onChange={(e) => update("province_affectation", e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Territoire</span>
              <input
                className="w-full rounded border p-3"
                value={values.territoire}
                onChange={(e) => update("territoire", e.target.value)}
              />
            </label>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className="space-y-4 rounded-xl border bg-white p-4" disabled={!inviteAvailable}>
            <legend className="px-2 text-sm font-semibold">Rôle et accès</legend>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Rôle principal *</span>
              <select
                className="w-full rounded border p-3"
                value={values.role}
                onChange={(e) => update("role", e.target.value as Role)}
              >
                {selectableRoles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.require_mfa}
                onChange={(e) => update("require_mfa", e.target.checked)}
              />
              Exiger MFA à la première connexion
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Justification</span>
              <textarea
                rows={3}
                className="w-full rounded border p-3"
                value={values.reason}
                onChange={(e) => update("reason", e.target.value)}
                placeholder={
                  actorIsPrincipal
                    ? "Motif de création du compte (optionnel)"
                    : "Motif…"
                }
              />
            </label>
            <p className="text-xs text-slate-500">
              Modules, projets et permissions fines pourront être affinés sur la
              fiche utilisateur après l’invitation.
            </p>
          </fieldset>
        ) : null}

        {step === 4 ? (
          <div className="space-y-3 rounded-xl border bg-white p-4 text-sm">
            <h2 className="font-semibold">Résumé de l’invitation</h2>
            <dl className="grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Nom</dt>
                <dd className="font-medium">{nomComplet || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">E-mail</dt>
                <dd className="font-medium">{values.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Rôle</dt>
                <dd className="font-medium">
                  {roleLabels[values.role] ?? values.role}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Type d’agent</dt>
                <dd className="font-medium">
                  {employmentTypeLabels[
                    values.employment_type as keyof typeof employmentTypeLabels
                  ] ?? values.employment_type}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Fonction</dt>
                <dd className="font-medium">{values.fonction || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Province d’affectation</dt>
                <dd className="font-medium">
                  {values.province_affectation || "—"}
                </dd>
              </div>
            </dl>
            <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              Aucun mot de passe n’est défini ici. L’utilisateur recevra une
              invitation et choisira son propre mot de passe. Statut initial :
              invited.
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          {step > 0 ? (
            <button
              type="button"
              className="rounded border px-4 py-2 text-sm font-semibold"
              onClick={() => setStep((s) => s - 1)}
            >
              Précédent
            </button>
          ) : null}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              disabled={!canNext() || !inviteAvailable}
              onClick={() => setStep((s) => s + 1)}
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              disabled={!inviteAvailable || !values.email || !nomComplet}
            >
              Créer l’invitation
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
