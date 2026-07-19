import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  calculatePayroll,
  type LegalRule,
} from "@/features/payroll/engine/calculate";
import { appendAuditLog } from "@/features/identity/services/audit.service";
import { buildPayslipPdf } from "@/features/payroll/services/payslip-pdf";

const PAYSLIPS_BUCKET = "hr-payslips-private";

export async function createPayrollPeriod(
  supabase: SupabaseClient,
  input: {
    label: string;
    dateDebut: string;
    dateFin: string;
    currency?: string;
    userId: string;
    isDemo?: boolean;
  },
) {
  const { data, error } = await supabase
    .from("payroll_periods" as never)
    .insert({
      label: input.label,
      date_debut: input.dateDebut,
      date_fin: input.dateFin,
      currency: input.currency || "USD",
      statut: "draft",
      created_by: input.userId,
      is_demo: input.isDemo ?? false,
    } as never)
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message || "Échec période");
  const id = String((data as { id: string }).id);

  await appendAuditLog(supabase, {
    action: "payroll.period.create",
    module: "payroll",
    entityType: "payroll_periods",
    entityId: id,
    newValues: { label: input.label },
    sensitivity: "sensible",
  });

  return id;
}

export async function calculatePeriodRun(
  supabase: SupabaseClient,
  periodId: string,
  options?: { allowUnverifiedRules?: boolean },
) {
  const { data: period } = await supabase
    .from("payroll_periods" as never)
    .select("*")
    .eq("id", periodId)
    .single();

  if (!period) throw new Error("Période introuvable");
  const p = period as { statut: string; date_fin: string; currency: string };
  if (p.statut === "closed") {
    throw new Error("Une période clôturée ne peut plus être calculée.");
  }

  const { data: rules } = await supabase
    .from("legal_payroll_rules" as never)
    .select(
      "code, rule_type, rate, formula, statut_validation, effective_from, effective_to",
    );

  const { data: employes } = await supabase
    .from("hr_employes" as never)
    .select("id, matricule, nom_affichage, poste_id, departement_id")
    .in("statut", ["actif", "essai"]);

  const { data: contrats } = await supabase
    .from("hr_contrats" as never)
    .select("employe_id, salaire_base, devise")
    .eq("statut", "actif");

  const salaireByEmploye = new Map<string, number>();
  for (const c of contrats ?? []) {
    const row = c as {
      employe_id: string;
      salaire_base: number;
    };
    salaireByEmploye.set(row.employe_id, Number(row.salaire_base) || 0);
  }

  const { data: runRow, error: runError } = await supabase
    .from("payroll_runs" as never)
    .insert({
      period_id: periodId,
      statut: "calculated",
      calculated_at: new Date().toISOString(),
    } as never)
    .select("id")
    .single();

  if (runError || !runRow || typeof runRow !== "object" || !("id" in runRow)) {
    throw new Error(runError?.message || "Échec création run de paie");
  }
  const runId = String((runRow as { id: string }).id);
  const legalRules = (rules ?? []) as LegalRule[];

  for (const emp of employes ?? []) {
    const employeId = String((emp as { id: string }).id);
    const base = salaireByEmploye.get(employeId) ?? 0;
    const result = calculatePayroll({
      baseSalary: base,
      transport: 50,
      rules: legalRules,
      asOf: p.date_fin,
      allowUnverifiedRules: options?.allowUnverifiedRules ?? true,
    });

    const { data: re, error: reError } = await supabase
      .from("payroll_run_employees" as never)
      .insert({
        run_id: runId,
        employe_id: employeId,
        brut: result.brut,
        retenues: result.retenues,
        net: result.net,
        cout_employeur: result.coutEmployeur,
        currency: p.currency,
        anomalies: result.anomalies,
        statut: result.anomalies.some((a) => a.includes("négatif"))
          ? "blocked"
          : "calculated",
      } as never)
      .select("id")
      .single();

    if (reError || !re || typeof re !== "object" || !("id" in re)) {
      throw new Error(reError?.message || "Échec ligne employé paie");
    }
    const reId = String((re as { id: string }).id);
    if (result.lines.length) {
      await supabase.from("payroll_lines" as never).insert(
        result.lines.map((line) => ({
          run_employee_id: reId,
          component_code: line.code,
          kind: line.kind,
          base_amount: line.baseAmount ?? null,
          rate: line.rate ?? null,
          amount: line.amount,
          formula_used: line.formulaUsed,
          metadata: { ruleCode: line.ruleCode },
        })) as never,
      );
    }

    const empRow = emp as {
      id: string;
      matricule?: string | null;
      nom_affichage?: string | null;
    };
    const reference = `PS-${periodId.slice(0, 8)}-${employeId.slice(0, 6)}`;
    const storagePath = `hr/${employeId}/payroll/${reference}.pdf`;
    const pdf = buildPayslipPdf({
      organisation: "Alliance des Femmes pour le Développement — AFD ASBL",
      employeNom: empRow.nom_affichage || employeId,
      matricule: empRow.matricule || "—",
      poste: "—",
      departement: "—",
      periodeLabel: (period as { label?: string }).label || periodId,
      reference,
      brut: result.brut,
      retenues: result.retenues,
      net: result.net,
      currency: p.currency,
      lines: result.lines.map((line) => ({
        label: line.code,
        kind: line.kind,
        amount: line.amount,
      })),
      generatedAt: new Date().toISOString(),
    });

    await supabase.storage.from(PAYSLIPS_BUCKET).upload(storagePath, pdf, {
      contentType: "application/pdf",
      upsert: true,
    });

    await supabase.from("payslips" as never).insert({
      run_employee_id: reId,
      employe_id: employeId,
      period_id: periodId,
      reference,
      brut: result.brut,
      net: result.net,
      currency: p.currency,
      bucket: PAYSLIPS_BUCKET,
      storage_path: storagePath,
    } as never);
  }

  await supabase
    .from("payroll_periods" as never)
    .update({ statut: "calculated" } as never)
    .eq("id", periodId);

  await appendAuditLog(supabase, {
    action: "payroll.calculate",
    module: "payroll",
    entityType: "payroll_runs",
    entityId: runId,
    sensitivity: "strictement_confidentiel",
  });

  return runId;
}

export async function advancePayrollStatus(
  supabase: SupabaseClient,
  periodId: string,
  next: string,
  actorId: string,
) {
  const { data: period } = await supabase
    .from("payroll_periods" as never)
    .select("statut")
    .eq("id", periodId)
    .single();
  if (!period) throw new Error("Période introuvable");
  const current = String((period as { statut: string }).statut);
  if (current === "closed") {
    throw new Error("Période clôturée — modification interdite.");
  }

  const patch: Record<string, unknown> = { statut: next };
  if (next === "closed") patch.closed_at = new Date().toISOString();

  await supabase
    .from("payroll_periods" as never)
    .update(patch as never)
    .eq("id", periodId);

  await appendAuditLog(supabase, {
    action: `payroll.status.${next}`,
    module: "payroll",
    entityType: "payroll_periods",
    entityId: periodId,
    oldValues: { statut: current },
    newValues: { statut: next, by: actorId },
    sensitivity: "strictement_confidentiel",
  });
}
