"use client";

import { useMemo, useState } from "react";
import { ProfilePhotoPicker } from "@/components/admin/profile/profile-photo-picker";
import {
  employmentTypeCodes,
  employmentTypeLabels,
} from "@/config/afd-staff";
import { roleLabels, type Role } from "@/config/roles";

type RefRow = { id: string; nom?: string; titre?: string };

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  departements: RefRow[];
  postes: RefRow[];
  selectableRoles: Role[];
  defaultRole: Role;
};

const fieldClass = "w-full rounded border p-2.5 text-sm";

export function EmployeeCreateForm({
  action,
  departements,
  postes,
  selectableRoles,
  defaultRole,
}: Props) {
  const [createAccount, setCreateAccount] = useState(false);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");

  const initials = useMemo(() => {
    const a = prenom.trim().charAt(0);
    const b = nom.trim().charAt(0);
    return `${a}${b}` || "?";
  }, [prenom, nom]);

  return (
    <form action={action} className="space-y-6">
      <section className="space-y-4 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
          1. Photo et identité
        </h2>
        <ProfilePhotoPicker name="photo" initials={initials} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Prénom *</span>
            <input
              required
              name="prenom"
              className={fieldClass}
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Deuxième prénom</span>
            <input name="deuxieme_prenom" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Nom *</span>
            <input
              required
              name="nom"
              className={fieldClass}
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Postnom</span>
            <input name="postnom" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Sexe</span>
            <select name="sexe" className={fieldClass} defaultValue="">
              <option value="">—</option>
              <option value="F">Féminin</option>
              <option value="M">Masculin</option>
              <option value="X">Autre / non précisé</option>
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Date de naissance</span>
            <input type="date" name="date_naissance" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">Matricule</span>
            <input name="matricule" className={fieldClass} />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
          2. Contact
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">
              E-mail professionnel {createAccount ? "*" : ""}
            </span>
            <input
              type="email"
              name="email"
              required={createAccount}
              className={fieldClass}
            />
          </label>
          <label className="block space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">E-mail personnel</span>
            <input type="email" name="email_personnel" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Téléphone principal</span>
            <input name="telephone" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Téléphone secondaire</span>
            <input name="telephone_secondaire" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">Adresse</span>
            <input name="adresse" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Commune</span>
            <input name="commune" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Ville</span>
            <input name="ville" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Province</span>
            <input name="province" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Pays</span>
            <input name="pays" defaultValue="RD Congo" className={fieldClass} />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
          3. Informations professionnelles
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Département</span>
            <select name="departement_id" className={fieldClass} defaultValue="">
              <option value="">—</option>
              {departements.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nom}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Service</span>
            <input name="service" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Poste</span>
            <select name="poste_id" className={fieldClass} defaultValue="">
              <option value="">—</option>
              {postes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.titre}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Fonction</span>
            <input name="fonction" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Date d&apos;embauche</span>
            <input type="date" name="date_embauche" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Date de fin</span>
            <input type="date" name="date_fin" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Type de contrat</span>
            <select name="type_contrat" className={fieldClass} defaultValue="cdd">
              <option value="cdd">CDD</option>
              <option value="cdi">CDI</option>
              <option value="stage">Stage</option>
              <option value="consultant">Consultant</option>
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Type d&apos;agent</span>
            <select
              name="type_agent"
              className={fieldClass}
              defaultValue="employe_permanent"
            >
              {employmentTypeCodes.map((code) => (
                <option key={code} value={code}>
                  {employmentTypeLabels[code]}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Bureau</span>
            <input name="bureau" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Province d&apos;affectation</span>
            <input name="province_affectation" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">Territoire d&apos;affectation</span>
            <input name="territoire_affectation" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">Statut professionnel</span>
            <select name="statut" className={fieldClass} defaultValue="actif">
              <option value="actif">Actif</option>
              <option value="essai">Période d&apos;essai</option>
              <option value="suspendu">Suspendu</option>
              <option value="inactif">Inactif</option>
            </select>
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
          4. Compte d&apos;accès
        </h2>
        <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
          <input
            type="checkbox"
            name="create_account"
            value="on"
            checked={createAccount}
            onChange={(e) => setCreateAccount(e.target.checked)}
            className="mt-1"
          />
          <span>
            <span className="font-semibold text-slate-900">
              Créer également un compte d&apos;accès à la plateforme
            </span>
            <span className="mt-1 block text-slate-600">
              Si désactivé : fiche RH uniquement, sans utilisateur Auth ni
              invitation. Si activé : invitation sécurisée — l&apos;utilisateur
              définit son propre mot de passe.
            </span>
          </span>
        </label>

        {createAccount ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">Rôle *</span>
              <select
                name="role"
                className={fieldClass}
                defaultValue={defaultRole}
                required
              >
                {selectableRoles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">Modules accessibles (libellés)</span>
              <input
                name="modules"
                className={fieldClass}
                placeholder="ex. rh, projets, bibliotheque"
              />
            </label>
            <label className="block space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">Projets accessibles</span>
              <input
                name="projets"
                className={fieldClass}
                placeholder="IDs ou codes projets, séparés par des virgules"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Niveau de confidentialité</span>
              <select
                name="niveau_confidentialite"
                className={fieldClass}
                defaultValue="interne"
              >
                <option value="public_interne">Public interne</option>
                <option value="interne">Interne</option>
                <option value="sensible">Sensible</option>
                <option value="strictement_confidentiel">
                  Strictement confidentiel
                </option>
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Expiration du compte</span>
              <input type="date" name="compte_expire_le" className={fieldClass} />
            </label>
            <label className="inline-flex items-center gap-2 text-sm sm:col-span-2">
              <input name="require_mfa" type="checkbox" />
              MFA obligatoire à la première connexion
            </label>
          </div>
        ) : null}
      </section>

      <button
        type="submit"
        className="w-full rounded-lg bg-[var(--afd-blue)] px-4 py-3 text-sm font-semibold text-white sm:w-auto"
      >
        {createAccount
          ? "Créer l’employé et envoyer l’invitation"
          : "Créer l’employé"}
      </button>
    </form>
  );
}
