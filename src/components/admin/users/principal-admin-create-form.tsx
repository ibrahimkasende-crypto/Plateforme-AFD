"use client";

import { useMemo, useState } from "react";
import { ProfilePhotoPicker } from "@/components/admin/profile/profile-photo-picker";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  inviteAvailable: boolean;
};

const fieldClass = "mt-1 w-full rounded-lg border px-3 py-2 text-sm";

export function PrincipalAdminCreateForm({ action, inviteAvailable }: Props) {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const initials = useMemo(
    () => `${prenom.charAt(0)}${nom.charAt(0)}` || "AP",
    [prenom, nom],
  );

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="role" value="admin_principal" />
      <input
        type="hidden"
        name="redirect_to"
        value="/admin/administrateur-principal"
      />

      <section className="space-y-4 rounded-2xl border bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
          Photo
        </h2>
        <ProfilePhotoPicker name="photo" initials={initials} disabled={!inviteAvailable} />
      </section>

      <section className="space-y-4 rounded-2xl border bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
          Identité
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-semibold">Prénom *</span>
            <input
              name="prenom"
              required
              className={fieldClass}
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              disabled={!inviteAvailable}
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Deuxième prénom</span>
            <input name="deuxieme_prenom" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Nom *</span>
            <input
              name="nom"
              required
              className={fieldClass}
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              disabled={!inviteAvailable}
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Postnom</span>
            <input name="postnom" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Sexe</span>
            <select name="sexe" className={fieldClass} defaultValue="" disabled={!inviteAvailable}>
              <option value="">—</option>
              <option value="F">Féminin</option>
              <option value="M">Masculin</option>
              <option value="X">Autre</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Date de naissance</span>
            <input type="date" name="date_naissance" className={fieldClass} disabled={!inviteAvailable} />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
          Contact
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold">E-mail professionnel *</span>
            <input
              name="email"
              type="email"
              required
              className={fieldClass}
              disabled={!inviteAvailable}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold">E-mail personnel</span>
            <input name="email_personnel" type="email" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Téléphone principal</span>
            <input name="telephone" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Téléphone secondaire</span>
            <input name="telephone_secondaire" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold">Adresse</span>
            <input name="adresse" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Commune</span>
            <input name="commune" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Ville</span>
            <input name="ville" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Province</span>
            <input name="province" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Pays</span>
            <input name="pays" defaultValue="RD Congo" className={fieldClass} disabled={!inviteAvailable} />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
          Informations professionnelles
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-semibold">Département</span>
            <input name="departement" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Service</span>
            <input name="service" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Fonction</span>
            <input
              name="fonction"
              defaultValue="Administrateur principal AFD"
              className={fieldClass}
              disabled={!inviteAvailable}
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Poste</span>
            <input name="poste" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Date de prise de fonction</span>
            <input type="date" name="date_prise_fonction" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Type de contrat</span>
            <select name="type_contrat" className={fieldClass} defaultValue="cdi" disabled={!inviteAvailable}>
              <option value="cdi">CDI</option>
              <option value="cdd">CDD</option>
              <option value="consultant">Consultant</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Bureau</span>
            <input name="bureau" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Province d&apos;affectation</span>
            <input name="province_affectation" className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold">Biographie</span>
            <textarea name="biographie" rows={3} className={fieldClass} disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Compétences</span>
            <input name="competences" className={fieldClass} placeholder="séparées par des virgules" disabled={!inviteAvailable} />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">Langues</span>
            <input name="langues" className={fieldClass} placeholder="fr, ln, en…" disabled={!inviteAvailable} />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
          Accès
        </h2>
        <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          Rôle imposé : <strong>Administrateur principal</strong> (
          <code>admin_principal</code>). Statut initial : <code>invited</code>.
        </p>
        <label className="inline-flex items-center gap-2 text-sm">
          <input name="require_mfa" type="checkbox" defaultChecked disabled={!inviteAvailable} />
          MFA obligatoire
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Niveau de confidentialité</span>
          <select
            name="niveau_confidentialite"
            className={fieldClass}
            defaultValue="strictement_confidentiel"
            disabled={!inviteAvailable}
          >
            <option value="sensible">Sensible</option>
            <option value="strictement_confidentiel">
              Strictement confidentiel
            </option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Expiration du compte (facultatif)</span>
          <input type="date" name="compte_expire_le" className={fieldClass} disabled={!inviteAvailable} />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Justification *</span>
          <textarea
            name="reason"
            required
            minLength={8}
            rows={3}
            className={fieldClass}
            placeholder="Motif de la désignation…"
            disabled={!inviteAvailable}
          />
        </label>
      </section>

      <button
        type="submit"
        disabled={!inviteAvailable}
        className="w-full rounded-lg bg-[var(--admin-primary)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40 sm:w-auto"
      >
        Créer et envoyer l’invitation
      </button>
    </form>
  );
}
