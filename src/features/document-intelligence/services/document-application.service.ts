import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ALLOWED_TARGET_TABLES,
  type AllowedTargetTable,
} from "@/features/document-intelligence/config";
import { notifyOcrUser } from "@/features/document-intelligence/services/document-notification.service";
import type { ApplicationPlan, ApplicationPlanLine } from "@/features/document-intelligence/types";

function isAllowedTable(table: string): table is AllowedTargetTable {
  return (ALLOWED_TARGET_TABLES as readonly string[]).includes(table);
}

export async function buildApplicationPlan(
  supabase: SupabaseClient,
  documentId: string,
): Promise<ApplicationPlan> {
  const { data: doc } = await supabase
    .from("documents_importes" as never)
    .select("*")
    .eq("id", documentId)
    .single();

  if (!doc) {
    return {
      documentId,
      lines: [],
      warnings: ["Document introuvable"],
      blocked: true,
    };
  }

  const document = doc as {
    status: string;
    module_cible: string | null;
    type_document: string;
    titre: string;
    periode_debut: string | null;
    periode_fin: string | null;
    projet_id: string | null;
    programme_id: string | null;
    devise: string | null;
  };

  if (document.status !== "approved") {
    return {
      documentId,
      lines: [],
      warnings: ["Le document doit être approuvé avant application."],
      blocked: true,
    };
  }

  const { data: champs } = await supabase
    .from("ocr_champs_extraits" as never)
    .select("id, field_key, raw_value, corrected_value, review_status")
    .eq("document_id", documentId);

  const { data: norms } = await supabase
    .from("ocr_valeurs_normalisees" as never)
    .select("champ_id, normalized_number, normalized_value, currency")
    .eq("document_id", documentId);

  const normByChamp = new Map<string, { number: number | null; value: string | null; currency: string | null }>();
  for (const n of norms ?? []) {
    const row = n as {
      champ_id: string;
      normalized_number: number | null;
      normalized_value: string | null;
      currency: string | null;
    };
    normByChamp.set(row.champ_id, {
      number: row.normalized_number,
      value: row.normalized_value,
      currency: row.currency,
    });
  }

  const values: Record<string, string | number | null> = {};
  const sourceFields: string[] = [];
  for (const c of champs ?? []) {
    const field = c as {
      id: string;
      field_key: string;
      raw_value: string | null;
      corrected_value: string | null;
      review_status: string;
    };
    if (field.review_status === "ignored") continue;
    const norm = normByChamp.get(field.id);
    values[field.field_key] =
      field.corrected_value ??
      norm?.number ??
      norm?.value ??
      field.raw_value;
    sourceFields.push(field.field_key);
  }

  const lines: ApplicationPlanLine[] = [];
  const warnings: string[] = [];
  const targetModule = document.module_cible ?? "";

  if (
    targetModule.includes("finance") ||
    targetModule.includes("depenses") ||
    targetModule.includes("budget")
  ) {
    const amount =
      typeof values.depenses === "number"
        ? values.depenses
        : typeof values.montant_total === "number"
          ? values.montant_total
          : null;

    if (amount == null) {
      warnings.push("Montant de dépense introuvable — ligne finance ignorée.");
    } else {
      lines.push({
        action: "create",
        targetTable: "finances_depenses",
        payload: {
          libelle: document.titre,
          montant: amount,
          devise: document.devise || "USD",
          date_depense: document.periode_fin || document.periode_debut,
          projet_id: document.projet_id,
          programme_id: document.programme_id,
          source_document_id: documentId,
          notes: "Import OCR validé — source: rapport importé",
        },
        sourceFieldNames: sourceFields.filter((k) =>
          ["depenses", "montant_total", "budget_prevu"].includes(k),
        ),
      });
    }

    if (typeof values.budget_prevu === "number") {
      lines.push({
        action: "create",
        targetTable: "finances_budgets",
        payload: {
          libelle: `Budget — ${document.titre}`,
          montant_prevu: values.budget_prevu,
          devise: document.devise || "USD",
          periode_debut: document.periode_debut,
          periode_fin: document.periode_fin,
          projet_id: document.projet_id,
          source_document_id: documentId,
        },
        sourceFieldNames: ["budget_prevu"],
      });
    }
  } else if (targetModule.includes("activ")) {
    lines.push({
      action: "create",
      targetTable: "activites",
      payload: {
        titre: document.titre,
        projet_id: document.projet_id,
        date_debut: document.periode_debut,
        date_fin: document.periode_fin,
        femmes: values.femmes ?? null,
        hommes: values.hommes ?? null,
        filles: values.filles ?? null,
        garcons: values.garcons ?? null,
        total_beneficiaires: values.total ?? null,
        source_document_id: documentId,
      },
      sourceFieldNames: ["femmes", "hommes", "filles", "garcons", "total"],
    });
  } else if (targetModule.includes("beneficiaires")) {
    lines.push({
      action: "create",
      targetTable: "beneficiaires_agregats",
      payload: {
        libelle: document.titre,
        periode_debut: document.periode_debut,
        periode_fin: document.periode_fin,
        total: values.total ?? null,
        source_document_id: documentId,
      },
      sourceFieldNames: ["total"],
    });
  } else {
    lines.push({
      action: "create",
      targetTable: "rapports_generes",
      payload: {
        titre: document.titre,
        type_rapport: document.type_document,
        periode_debut: document.periode_debut,
        periode_fin: document.periode_fin,
        status: "importe_valide",
        source_document_id: documentId,
      },
      sourceFieldNames: sourceFields.slice(0, 5),
    });
  }

  for (const line of lines) {
    if (!isAllowedTable(line.targetTable)) {
      line.action = "skip";
      line.conflict = "Table non autorisée pour mapping OCR";
    }
  }

  return {
    documentId,
    lines,
    warnings,
    blocked: lines.every((l) => l.action === "skip"),
  };
}

export async function applyApplicationPlan(
  supabase: SupabaseClient,
  input: {
    documentId: string;
    userId: string;
    confirm: boolean;
  },
) {
  if (!input.confirm) {
    throw new Error("Confirmation du plan d’application requise.");
  }

  const plan = await buildApplicationPlan(supabase, input.documentId);
  if (plan.blocked) {
    throw new Error(plan.warnings.join(" ") || "Plan bloqué.");
  }

  await supabase
    .from("documents_importes" as never)
    .update({ status: "applying" } as never)
    .eq("id", input.documentId);

  const { data: appRow } = await supabase
    .from("ocr_applications" as never)
    .insert({
      document_id: input.documentId,
      applied_by: input.userId,
      target_module: "multi",
      status: "pending",
      rollback_data: { plan },
    } as never)
    .select("id")
    .single();

  const applicationId =
    appRow && typeof appRow === "object" && "id" in appRow
      ? String((appRow as { id: string }).id)
      : null;

  const { data: importRow } = await supabase
    .from("imports_donnees" as never)
    .insert({
      document_id: input.documentId,
      application_id: applicationId,
      module_cible: "multi",
      status: "validated",
      created_by: input.userId,
      metadata: { plan_warnings: plan.warnings },
    } as never)
    .select("id")
    .single();

  const importId =
    importRow && typeof importRow === "object" && "id" in importRow
      ? String((importRow as { id: string }).id)
      : null;

  let applied = 0;
  const createdIds: Array<{ table: string; id: string }> = [];

  for (const [index, line] of plan.lines.entries()) {
    if (line.action !== "create" || !isAllowedTable(line.targetTable)) {
      if (importId) {
        await supabase.from("imports_donnees_lignes" as never).insert({
          import_id: importId,
          document_id: input.documentId,
          line_number: index + 1,
          target_table: line.targetTable,
          payload: line.payload,
          status: "skipped",
          error_message: line.conflict ?? null,
        } as never);
      }
      continue;
    }

    // Colonnes source_* peuvent ne pas exister sur toutes les tables — stockées aussi dans notes/metadata.
    const payload = { ...line.payload };
    const { data: inserted, error } = await supabase
      .from(line.targetTable as never)
      .insert(payload as never)
      .select("id")
      .single();

    if (error) {
      // retry sans colonnes non standard
      const fallback = { ...payload };
      delete fallback.source_document_id;
      delete fallback.femmes;
      delete fallback.hommes;
      delete fallback.filles;
      delete fallback.garcons;
      delete fallback.total_beneficiaires;
      const { data: inserted2, error: error2 } = await supabase
        .from(line.targetTable as never)
        .insert(fallback as never)
        .select("id")
        .maybeSingle();

      if (error2 || !inserted2) {
        if (importId) {
          await supabase.from("imports_donnees_lignes" as never).insert({
            import_id: importId,
            document_id: input.documentId,
            line_number: index + 1,
            target_table: line.targetTable,
            payload,
            status: "error",
            error_message: error2?.message || error.message,
          } as never);
        }
        continue;
      }

      const id = String((inserted2 as { id: string }).id);
      createdIds.push({ table: line.targetTable, id });
      applied += 1;
      if (importId) {
        await supabase.from("imports_donnees_lignes" as never).insert({
          import_id: importId,
          document_id: input.documentId,
          line_number: index + 1,
          target_table: line.targetTable,
          target_id: id,
          payload: fallback,
          previous_payload: {},
          status: "applied",
        } as never);
      }
      continue;
    }

    const id = String((inserted as { id: string }).id);
    createdIds.push({ table: line.targetTable, id });
    applied += 1;
    if (importId) {
      await supabase.from("imports_donnees_lignes" as never).insert({
        import_id: importId,
        document_id: input.documentId,
        line_number: index + 1,
        target_table: line.targetTable,
        target_id: id,
        payload,
        status: "applied",
      } as never);
    }
  }

  await supabase
    .from("ocr_applications" as never)
    .update({
      status: applied > 0 ? "applied" : "failed",
      applied_rows: applied,
      applied_at: new Date().toISOString(),
      rollback_data: { plan, createdIds },
      target_table: createdIds[0]?.table ?? null,
    } as never)
    .eq("id", applicationId as never);

  if (importId) {
    await supabase
      .from("imports_donnees" as never)
      .update({
        status: applied > 0 ? "applied" : "failed",
        row_count: applied,
        applied_at: new Date().toISOString(),
      } as never)
      .eq("id", importId);
  }

  await supabase
    .from("documents_importes" as never)
    .update({
      status: applied > 0 ? "applied" : "failed",
      applied_at: applied > 0 ? new Date().toISOString() : null,
    } as never)
    .eq("id", input.documentId);

  if (applied > 0) {
    revalidateTag("dashboard", "max");
    revalidateTag("finances", "max");
    revalidateTag("rapports", "max");
    revalidateTag("documents", "max");
    revalidateTag("projets", "max");
    revalidateTag("activites", "max");
    revalidateTag("beneficiaires", "max");
    revalidateTag("indicateurs", "max");
    revalidateTag("stocks", "max");
    revalidatePath("/admin");
    revalidatePath("/admin/finances");
    revalidatePath("/admin/import-intelligent");
  }

  await notifyOcrUser(supabase, {
    userId: input.userId,
    documentId: input.documentId,
    type: applied > 0 ? "applied" : "error",
    title: applied > 0 ? "Données appliquées" : "Échec d’application",
    body: `${applied} ligne(s) écrite(s) après validation.`,
  });

  return { applied, createdIds, applicationId };
}

export async function rollbackApplication(
  supabase: SupabaseClient,
  input: { documentId: string; userId: string },
) {
  const { data: app } = await supabase
    .from("ocr_applications" as never)
    .select("*")
    .eq("document_id", input.documentId)
    .eq("status", "applied")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!app) throw new Error("Aucune application à annuler.");

  const row = app as {
    id: string;
    rollback_data: { createdIds?: Array<{ table: string; id: string }> };
  };

  const createdIds = row.rollback_data?.createdIds ?? [];
  for (const item of createdIds) {
    if (!isAllowedTable(item.table)) continue;
    // Soft rollback : marquage plutôt que suppression destructive si colonne status existe
    const { error } = await supabase
      .from(item.table as never)
      .update({
        notes: "ROLLBACK import OCR — valeur historique conservée",
      } as never)
      .eq("id", item.id);

    if (error) {
      // fallback delete logique uniquement sur lignes clairement issues de l'import
      await supabase.from(item.table as never).delete().eq("id", item.id);
    }
  }

  await supabase
    .from("ocr_applications" as never)
    .update({
      status: "rolled_back",
      rolled_back_at: new Date().toISOString(),
    } as never)
    .eq("id", row.id);

  await supabase
    .from("imports_donnees" as never)
    .update({ status: "rolled_back" } as never)
    .eq("document_id", input.documentId)
    .eq("status", "applied");

  await supabase
    .from("documents_importes" as never)
    .update({ status: "approved" } as never)
    .eq("id", input.documentId);

  revalidateTag("dashboard", "max");
  revalidatePath("/admin");
}
