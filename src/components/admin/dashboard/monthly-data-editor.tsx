"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import {
  saveMonthlyActivities,
  saveMonthlyBeneficiaries,
  saveMonthlyBudget,
} from "@/features/dashboard/actions/manage-monthly-data";
import {
  ACTIVITY_CATEGORIES,
  RDC_PROVINCES,
  type ActivityMonthRow,
  type BeneficiaryMonthRow,
  type BudgetMonthRow,
} from "@/features/dashboard/types/monthly-data";

type Tab = "beneficiaires" | "activites" | "budget";

type Props = {
  initialYearMonth: string;
  availableMonths: string[];
  beneficiaries: BeneficiaryMonthRow[];
  activities: ActivityMonthRow[];
  budget: BudgetMonthRow;
  canEdit: boolean;
};

type DraftBeneficiary = {
  key: string;
  id?: string | null;
  province: string;
  femmes: number;
  hommes: number;
  enfants: number;
  jeunes: number;
  delete?: boolean;
};

function monthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return ym;
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function MonthlyDataEditor({
  initialYearMonth,
  availableMonths,
  beneficiaries,
  activities,
  budget,
  canEdit,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("beneficiaires");
  const [yearMonth, setYearMonth] = useState(initialYearMonth);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const [draftBenef, setDraftBenef] = useState<DraftBeneficiary[]>(() =>
    beneficiaries.map((row) => ({
      key: row.id,
      id: row.id,
      province: row.province,
      femmes: row.femmes,
      hommes: row.hommes,
      enfants: row.enfants,
      jeunes: row.jeunes,
    })),
  );

  const [draftActivities, setDraftActivities] = useState(() =>
    activities.map((row) => ({
      id: row.id,
      category: row.category,
      value: row.value,
    })),
  );

  const [draftBudget, setDraftBudget] = useState({
    id: budget.id,
    prevu: budget.prevu,
    depense: budget.depense,
    currency: budget.currency as "USD" | "EUR" | "CDF",
  });

  const visibleBenef = useMemo(
    () => draftBenef.filter((r) => !r.delete),
    [draftBenef],
  );

  function changeMonth(next: string) {
    setYearMonth(next);
    router.push(`/admin/dashboard/donnees-mensuelles?mois=${next}`);
  }

  function addBeneficiaryRow() {
    setDraftBenef((rows) => [
      ...rows,
      {
        key: `new-${Date.now()}`,
        id: null,
        province: "Kinshasa",
        femmes: 0,
        hommes: 0,
        enfants: 0,
        jeunes: 0,
      },
    ]);
  }

  function saveBeneficiaries() {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveMonthlyBeneficiaries({
        yearMonth,
        rows: draftBenef.map((row) => ({
          id: row.id || undefined,
          province: row.province,
          femmes: row.femmes,
          hommes: row.hommes,
          enfants: row.enfants,
          jeunes: row.jeunes,
          delete: Boolean(row.delete),
        })),
      });
      setFeedback(result);
      if (result.ok) router.refresh();
    });
  }

  function saveActivities() {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveMonthlyActivities({
        yearMonth,
        rows: draftActivities,
      });
      setFeedback(result);
      if (result.ok) router.refresh();
    });
  }

  function saveBudget() {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveMonthlyBudget({
        yearMonth,
        id: draftBudget.id,
        prevu: draftBudget.prevu,
        depense: draftBudget.depense,
        currency: draftBudget.currency,
      });
      setFeedback(result);
      if (result.ok) router.refresh();
    });
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-900 focus:border-[var(--admin-primary,#0d254e)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary,#0d254e)]/20";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-800">Mois</span>
          <input
            type="month"
            value={yearMonth}
            onChange={(e) => changeMonth(e.target.value)}
            className={inputClass}
          />
        </label>
        <div className="space-y-1 text-sm">
          <span className="font-semibold text-slate-800">Mois existants</span>
          <select
            className={inputClass}
            value={availableMonths.includes(yearMonth) ? yearMonth : ""}
            onChange={(e) => {
              if (e.target.value) changeMonth(e.target.value);
            }}
          >
            <option value="">Choisir…</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {monthLabel(m)}
              </option>
            ))}
          </select>
        </div>
        <p className="pb-2 text-sm text-slate-500">
          Affichage : <strong>{monthLabel(yearMonth)}</strong>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["beneficiaires", "Bénéficiaires"],
            ["activites", "Activités"],
            ["budget", "Budget"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              tab === id
                ? "bg-[var(--admin-primary,#0d254e)] text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {feedback ? (
        <div
          role="status"
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedback.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      {!canEdit ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Lecture seule — seuls les administrateurs principaux peuvent modifier.
        </div>
      ) : null}

      {tab === "beneficiaires" ? (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Bénéficiaires par province
            </h2>
            {canEdit ? (
              <button
                type="button"
                onClick={addBeneficiaryRow}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Plus className="size-3.5" />
                Ajouter une province
              </button>
            ) : null}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-2 py-2">Province</th>
                  <th className="px-2 py-2">Femmes</th>
                  <th className="px-2 py-2">Hommes</th>
                  <th className="px-2 py-2">Enfants</th>
                  <th className="px-2 py-2">Jeunes</th>
                  <th className="px-2 py-2">Total</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {visibleBenef.map((row) => {
                  const total =
                    row.femmes + row.hommes + row.enfants + row.jeunes;
                  return (
                    <tr key={row.key} className="border-b border-slate-100">
                      <td className="px-2 py-2">
                        <select
                          disabled={!canEdit}
                          className={inputClass}
                          value={row.province}
                          onChange={(e) =>
                            setDraftBenef((rows) =>
                              rows.map((r) =>
                                r.key === row.key
                                  ? { ...r, province: e.target.value }
                                  : r,
                              ),
                            )
                          }
                        >
                          {[row.province, ...RDC_PROVINCES]
                            .filter(
                              (v, i, arr) =>
                                v && arr.indexOf(v) === i,
                            )
                            .map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                        </select>
                      </td>
                      {(
                        ["femmes", "hommes", "enfants", "jeunes"] as const
                      ).map((field) => (
                        <td key={field} className="px-2 py-2">
                          <input
                            type="number"
                            min={0}
                            disabled={!canEdit}
                            className={inputClass}
                            value={row[field]}
                            onChange={(e) =>
                              setDraftBenef((rows) =>
                                rows.map((r) =>
                                  r.key === row.key
                                    ? {
                                        ...r,
                                        [field]: Number(e.target.value) || 0,
                                      }
                                    : r,
                                ),
                              )
                            }
                          />
                        </td>
                      ))}
                      <td className="px-2 py-2 font-semibold tabular-nums">
                        {total}
                      </td>
                      <td className="px-2 py-2">
                        {canEdit ? (
                          <button
                            type="button"
                            className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
                            aria-label="Supprimer"
                            onClick={() =>
                              setDraftBenef((rows) =>
                                rows.map((r) =>
                                  r.key === row.key
                                    ? { ...r, delete: true }
                                    : r,
                                ),
                              )
                            }
                          >
                            <Trash2 className="size-4" />
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {canEdit ? (
            <button
              type="button"
              disabled={pending}
              onClick={saveBeneficiaries}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-primary,#0d254e)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Enregistrer les bénéficiaires
            </button>
          ) : null}
        </section>
      ) : null}

      {tab === "activites" ? (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Activités du mois
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {ACTIVITY_CATEGORIES.map((category) => {
              const row = draftActivities.find((r) => r.category === category);
              return (
                <label key={category} className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">{category}</span>
                  <input
                    type="number"
                    min={0}
                    disabled={!canEdit}
                    className={inputClass}
                    value={row?.value ?? 0}
                    onChange={(e) =>
                      setDraftActivities((rows) =>
                        rows.map((r) =>
                          r.category === category
                            ? { ...r, value: Number(e.target.value) || 0 }
                            : r,
                        ),
                      )
                    }
                  />
                </label>
              );
            })}
          </div>
          {canEdit ? (
            <button
              type="button"
              disabled={pending}
              onClick={saveActivities}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-primary,#0d254e)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Enregistrer les activités
            </button>
          ) : null}
        </section>
      ) : null}

      {tab === "budget" ? (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Budget du mois
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Prévu</span>
              <input
                type="number"
                min={0}
                disabled={!canEdit}
                className={inputClass}
                value={draftBudget.prevu}
                onChange={(e) =>
                  setDraftBudget((b) => ({
                    ...b,
                    prevu: Number(e.target.value) || 0,
                  }))
                }
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Dépensé</span>
              <input
                type="number"
                min={0}
                disabled={!canEdit}
                className={inputClass}
                value={draftBudget.depense}
                onChange={(e) =>
                  setDraftBudget((b) => ({
                    ...b,
                    depense: Number(e.target.value) || 0,
                  }))
                }
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Devise</span>
              <select
                disabled={!canEdit}
                className={inputClass}
                value={draftBudget.currency}
                onChange={(e) =>
                  setDraftBudget((b) => ({
                    ...b,
                    currency: e.target.value as "USD" | "EUR" | "CDF",
                  }))
                }
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CDF">CDF</option>
              </select>
            </label>
          </div>
          {canEdit ? (
            <button
              type="button"
              disabled={pending}
              onClick={saveBudget}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-primary,#0d254e)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Enregistrer le budget
            </button>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
