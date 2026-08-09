"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { roleLabels } from "@/config/roles";

type TabId =
  | "overview"
  | "personnel"
  | "pro"
  | "roles"
  | "activity"
  | "security";

type Props = {
  user: {
    id: string;
    email: string;
    nom_complet: string | null;
    photo_url?: string | null;
    actif: boolean;
    derniere_connexion: string | null;
    created_at?: string | null;
    roles: string[];
  };
  isSelf: boolean;
  canEditRole: boolean;
  selectableRoles: Array<{ value: string; label: string }>;
  primaryRole: string;
  updateAction: (formData: FormData) => void | Promise<void>;
  initialTab?: string;
};

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "overview", label: "Vue d’ensemble" },
  { id: "personnel", label: "Personnel" },
  { id: "pro", label: "Professionnel" },
  { id: "roles", label: "Rôle et permissions" },
  { id: "activity", label: "Activité" },
  { id: "security", label: "Sessions" },
];

export function UserProfileTabs({
  user,
  isSelf,
  canEditRole,
  selectableRoles,
  primaryRole,
  updateAction,
  initialTab,
}: Props) {
  const start = useMemo(() => {
    const match = TABS.find((t) => t.id === initialTab);
    return match?.id ?? "overview";
  }, [initialTab]);
  const [tab, setTab] = useState<TabId>(start);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 sm:flex-row sm:items-center">
        <div className="aspect-square h-20 w-20 overflow-hidden rounded-full bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.photo_url || "/images/avatar-default.svg"}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml," +
                encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect fill='#e2e8f0' width='80' height='80'/><text x='50%' y='54%' text-anchor='middle' fill='#64748b' font-size='28'>${(user.nom_complet || user.email || "?").charAt(0).toUpperCase()}</text></svg>`,
                );
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold">
            {user.nom_complet ?? "Sans nom"}
          </h1>
          <p className="truncate text-sm text-slate-600">{user.email}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span
              className={`rounded-full px-2 py-1 font-semibold ${
                user.actif
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-amber-50 text-amber-900"
              }`}
            >
              {user.actif ? "Actif" : "Suspendu / inactif"}
            </span>
            {user.roles.map((role) => (
              <span
                key={role}
                className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700"
              >
                {roleLabels[role as keyof typeof roleLabels] ?? role}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${
              tab === item.id
                ? "bg-[var(--afd-blue)] text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-3 rounded-xl border bg-white p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">E-mail</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Dernière connexion</dt>
            <dd className="font-medium">
              {user.derniere_connexion
                ? new Date(user.derniere_connexion).toLocaleString("fr-FR")
                : "Jamais"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Créé le</dt>
            <dd className="font-medium">
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString("fr-FR")
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Rôles</dt>
            <dd className="font-medium">
              {user.roles.length
                ? user.roles
                    .map((r) => roleLabels[r as keyof typeof roleLabels] ?? r)
                    .join(", ")
                : "Aucun"}
            </dd>
          </div>
        </dl>
      ) : null}

      {tab === "personnel" || tab === "pro" || tab === "roles" ? (
        <form action={updateAction} className="space-y-4 rounded-xl border bg-white p-4">
          <input type="hidden" name="id" value={user.id} />
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Nom complet</span>
            <input
              required
              name="nom_complet"
              defaultValue={user.nom_complet ?? ""}
              className="w-full rounded border p-3"
            />
          </label>
          {tab === "roles" && canEditRole && !isSelf ? (
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Rôle principal</span>
              <select
                name="role"
                defaultValue={primaryRole}
                className="w-full rounded border p-3"
              >
                {selectableRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {isSelf ? (
            <p className="rounded border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
              Vous ne pouvez pas modifier votre propre rôle.
            </p>
          ) : null}
          {tab === "roles" ? (
            <label className="inline-flex items-center gap-2 text-sm">
              <input name="actif" type="checkbox" defaultChecked={user.actif} />
              Compte actif (décocher = suspension + révocation des sessions)
            </label>
          ) : (
            <input type="hidden" name="actif" value={user.actif ? "on" : ""} />
          )}
          <button
            type="submit"
            className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white"
          >
            Enregistrer
          </button>
        </form>
      ) : null}

      {tab === "activity" ? (
        <div className="rounded-xl border bg-white p-4 text-sm">
          <p className="text-slate-600">
            Consultez le journal détaillé des actions de cet utilisateur.
          </p>
          <Link
            href={`/admin/utilisateurs/${user.id}/activite`}
            className="mt-3 inline-block font-semibold text-[var(--afd-blue)]"
          >
            Ouvrir l’activité →
          </Link>
        </div>
      ) : null}

      {tab === "security" ? (
        <div className="rounded-xl border bg-white p-4 text-sm space-y-2">
          <p>
            Les sessions actives sont révoquées automatiquement lors d’une
            suspension.
          </p>
          <Link
            href="/admin/securite/sessions"
            className="inline-block font-semibold text-[var(--afd-blue)]"
          >
            Gérer les sessions →
          </Link>
          <Link
            href="/admin/mon-profil"
            className="ml-4 inline-block font-semibold text-[var(--afd-blue)]"
          >
            Photo de profil →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
