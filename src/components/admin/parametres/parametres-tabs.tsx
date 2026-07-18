"use client";

import { useState } from "react";
import { saveSiteParameters } from "@/features/parametres/actions/manage-parametres";

type TabDef = {
  id: string;
  label: string;
  fields: Array<{ key: string; label: string; type?: "text" | "textarea" | "checkbox" }>;
};

const TABS: TabDef[] = [
  {
    id: "general",
    label: "Général",
    fields: [
      { key: "org.name", label: "Nom de l'organisation" },
      { key: "org.slogan", label: "Slogan" },
      { key: "org.founded_year", label: "Année de fondation" },
    ],
  },
  {
    id: "identite",
    label: "Identité",
    fields: [
      { key: "org.mission", label: "Mission", type: "textarea" },
      { key: "org.vision", label: "Vision", type: "textarea" },
      { key: "org.values", label: "Valeurs", type: "textarea" },
    ],
  },
  {
    id: "coordonnees",
    label: "Coordonnées",
    fields: [
      { key: "contact.email", label: "E-mail principal" },
      { key: "contact.phone", label: "Téléphone" },
      { key: "contact.address", label: "Adresse", type: "textarea" },
    ],
  },
  {
    id: "reseaux",
    label: "Réseaux",
    fields: [
      { key: "social.facebook", label: "Facebook" },
      { key: "social.twitter", label: "X / Twitter" },
      { key: "social.linkedin", label: "LinkedIn" },
      { key: "social.youtube", label: "YouTube" },
    ],
  },
  {
    id: "newsletter",
    label: "Newsletter",
    fields: [
      { key: "newsletter.sender_name", label: "Nom expéditeur" },
      { key: "newsletter.sender_email", label: "E-mail expéditeur" },
      { key: "newsletter.reply_to", label: "Répondre à" },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    fields: [
      { key: "notifications.admin_email", label: "E-mail alertes admin" },
      { key: "notifications.new_message", label: "Notifier nouveaux messages", type: "checkbox" },
      { key: "notifications.new_adhesion", label: "Notifier nouvelles adhésions", type: "checkbox" },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    fields: [
      { key: "documents.default_footer", label: "Pied de page documents", type: "textarea" },
      { key: "documents.watermark", label: "Filigrane" },
    ],
  },
  {
    id: "paiements",
    label: "Paiements",
    fields: [
      { key: "payments.enabled", label: "Paiements en ligne activés", type: "checkbox" },
      { key: "payments.currency_default", label: "Devise par défaut" },
      { key: "payments.provider", label: "Fournisseur" },
    ],
  },
  {
    id: "securite",
    label: "Sécurité",
    fields: [
      { key: "security.session_days", label: "Durée session (jours)" },
      { key: "security.mfa_required", label: "MFA obligatoire", type: "checkbox" },
    ],
  },
  {
    id: "integrations",
    label: "Intégrations",
    fields: [
      { key: "integrations.analytics_id", label: "ID Analytics" },
      { key: "integrations.maps_key", label: "Clé Google Maps" },
    ],
  },
  {
    id: "dashboard",
    label: "Dashboard",
    fields: [
      { key: "dashboard.default_period", label: "Période par défaut" },
      { key: "dashboard.demo_mode", label: "Mode démo", type: "checkbox" },
    ],
  },
];

type ParametresTabsProps = {
  values: Record<string, string>;
};

export function ParametresTabs({ values }: ParametresTabsProps) {
  const [activeTab, setActiveTab] = useState(TABS[0]?.id ?? "general");
  const current = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={
              activeTab === tab.id
                ? "rounded bg-[var(--afd-blue)] px-3 py-1.5 text-sm text-white"
                : "rounded border px-3 py-1.5 text-sm"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {current ? (
        <form action={saveSiteParameters} className="max-w-2xl space-y-4">
          <input type="hidden" name="tab" value={current.id} />
          {current.fields.map((field) => (
            <label key={field.key} className="block space-y-1">
              <span className="text-sm font-medium">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  name={field.key}
                  defaultValue={values[field.key] ?? ""}
                  className="min-h-24 w-full rounded border p-3"
                />
              ) : field.type === "checkbox" ? (
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={field.key}
                    value="true"
                    defaultChecked={values[field.key] === "true"}
                  />
                  Activé
                </span>
              ) : (
                <input
                  name={field.key}
                  defaultValue={values[field.key] ?? ""}
                  className="w-full rounded border p-3"
                />
              )}
            </label>
          ))}
          <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
            Enregistrer {current.label.toLowerCase()}
          </button>
        </form>
      ) : null}
    </div>
  );
}
