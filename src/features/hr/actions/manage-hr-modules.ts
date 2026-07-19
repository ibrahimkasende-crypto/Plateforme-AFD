"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

async function getClient() {
  const supabase = await createClientSafe();
  return supabase;
}

function revalidateRh(...paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

export async function createDepartementAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_employees");
  const parsed = z
    .object({
      code: z.string().optional(),
      nom: z.string().min(1),
      description: z.string().optional(),
      centre_cout: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("hr_departements" as never).insert({
    code: parsed.data.code || null,
    nom: parsed.data.nom,
    description: parsed.data.description ?? null,
    centre_cout: parsed.data.centre_cout ?? null,
    actif: true,
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/departements", "/admin/rh/organigramme");
}

export async function createPosteAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_employees");
  const parsed = z
    .object({
      code: z.string().optional(),
      titre: z.string().min(1),
      departement_id: z.string().uuid().optional().or(z.literal("")),
      niveau: z.string().optional(),
      categorie: z.string().optional(),
      description: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("hr_postes" as never).insert({
    code: parsed.data.code || null,
    titre: parsed.data.titre,
    departement_id: parsed.data.departement_id || null,
    niveau: parsed.data.niveau ?? null,
    categorie: parsed.data.categorie ?? null,
    description: parsed.data.description ?? null,
    actif: true,
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/postes", "/admin/rh/departements");
}

export async function createContratAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_contracts");
  const parsed = z
    .object({
      employe_id: z.string().uuid(),
      type_contrat: z.string().min(1),
      date_debut: z.string().min(1),
      date_fin: z.string().optional(),
      salaire_base: z.coerce.number().optional(),
      devise: z.string().optional(),
      horaire: z.string().optional(),
      reference: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("hr_contrats" as never).insert({
    employe_id: parsed.data.employe_id,
    type_contrat: parsed.data.type_contrat,
    date_debut: parsed.data.date_debut,
    date_fin: parsed.data.date_fin || null,
    salaire_base: parsed.data.salaire_base ?? 0,
    devise: parsed.data.devise || "USD",
    horaire: parsed.data.horaire ?? null,
    reference: parsed.data.reference ?? null,
    statut: "actif",
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/contrats", "/admin/rh/horaires");
}

export async function createPresenceAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_attendance");
  const parsed = z
    .object({
      employe_id: z.string().uuid(),
      date_jour: z.string().min(1),
      heure_entree: z.string().optional(),
      heure_sortie: z.string().optional(),
      statut: z.string().optional(),
      commentaire: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("hr_presences" as never).insert({
    employe_id: parsed.data.employe_id,
    date_jour: parsed.data.date_jour,
    heure_entree: parsed.data.heure_entree || null,
    heure_sortie: parsed.data.heure_sortie || null,
    statut: parsed.data.statut || "present",
    commentaire: parsed.data.commentaire ?? null,
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/presences", "/admin/rh/feuilles-temps");
}

export async function createCongeAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_leave");
  const parsed = z
    .object({
      employe_id: z.string().uuid(),
      type_conge: z.string().min(1),
      date_debut: z.string().min(1),
      date_fin: z.string().min(1),
      jours: z.coerce.number().min(0.5),
      motif: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("hr_conges" as never).insert({
    employe_id: parsed.data.employe_id,
    type_conge: parsed.data.type_conge,
    date_debut: parsed.data.date_debut,
    date_fin: parsed.data.date_fin,
    jours: parsed.data.jours,
    motif: parsed.data.motif ?? null,
    statut: "demande",
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/conges");
}

export async function createRecrutementAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_recruitment");
  const parsed = z
    .object({
      titre: z.string().min(1),
      departement_id: z.string().uuid().optional().or(z.literal("")),
      poste_id: z.string().uuid().optional().or(z.literal("")),
      date_limite: z.string().optional(),
      description: z.string().optional(),
      statut: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { data, error } = await supabase
    .from("hr_recrutements" as never)
    .insert({
      titre: parsed.data.titre,
      departement_id: parsed.data.departement_id || null,
      poste_id: parsed.data.poste_id || null,
      date_limite: parsed.data.date_limite || null,
      description: parsed.data.description ?? null,
      statut: parsed.data.statut || "ouvert",
    } as never)
    .select("id")
    .single();

  if (error || !data) return;
  revalidateRh("/admin/rh/recrutement");
  redirect("/admin/rh/recrutement");
}

export async function createCandidatureAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_recruitment");
  const parsed = z
    .object({
      recrutement_id: z.string().uuid(),
      nom: z.string().min(1),
      email: z.string().email().optional().or(z.literal("")),
      telephone: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("hr_candidatures_rh" as never).insert({
    recrutement_id: parsed.data.recrutement_id,
    nom: parsed.data.nom,
    email: parsed.data.email || null,
    telephone: parsed.data.telephone ?? null,
    statut: "recue",
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/candidatures");
}

export async function updateCandidatureStatutAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_recruitment");
  const parsed = z
    .object({
      id: z.string().uuid(),
      statut: z.string().min(1),
      commentaires: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase
    .from("hr_candidatures_rh" as never)
    .update({
      statut: parsed.data.statut,
      commentaires: parsed.data.commentaires ?? null,
    } as never)
    .eq("id", parsed.data.id);

  if (error) return;
  revalidateRh("/admin/rh/candidatures", `/admin/rh/candidatures/${parsed.data.id}`);
}

export async function createOnboardingTacheAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_employees");
  const parsed = z
    .object({
      employe_id: z.string().uuid(),
      titre: z.string().min(1),
      date_limite: z.string().optional(),
      commentaire: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("hr_onboarding_taches" as never).insert({
    employe_id: parsed.data.employe_id,
    titre: parsed.data.titre,
    date_limite: parsed.data.date_limite || null,
    commentaire: parsed.data.commentaire ?? null,
    statut: "a_faire",
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/onboarding");
}

export async function createPerformanceCycleAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_performance");
  const parsed = z
    .object({
      nom: z.string().min(1),
      date_debut: z.string().optional(),
      date_fin: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("hr_performance_cycles" as never).insert({
    nom: parsed.data.nom,
    date_debut: parsed.data.date_debut || null,
    date_fin: parsed.data.date_fin || null,
    statut: "ouvert",
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/performance");
}

export async function createFormationAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_training");
  const parsed = z
    .object({
      titre: z.string().min(1),
      formateur: z.string().optional(),
      date_debut: z.string().optional(),
      date_fin: z.string().optional(),
      cout: z.coerce.number().optional(),
      devise: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("hr_formations" as never).insert({
    titre: parsed.data.titre,
    formateur: parsed.data.formateur ?? null,
    date_debut: parsed.data.date_debut || null,
    date_fin: parsed.data.date_fin || null,
    cout: parsed.data.cout ?? null,
    devise: parsed.data.devise || "USD",
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/formations", "/admin/rh/depenses");
}

export async function createEquipementAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_employees");
  const parsed = z
    .object({
      inventaire: z.string().optional(),
      type_equipement: z.string().min(1),
      employe_id: z.string().uuid().optional().or(z.literal("")),
      date_attribution: z.string().optional(),
      etat: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("hr_equipements" as never).insert({
    inventaire: parsed.data.inventaire || null,
    type_equipement: parsed.data.type_equipement,
    employe_id: parsed.data.employe_id || null,
    date_attribution: parsed.data.date_attribution || null,
    etat: parsed.data.etat || "bon",
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/equipements");
}

export async function createDisciplineAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_discipline");
  const parsed = z
    .object({
      employe_id: z.string().uuid(),
      categorie: z.string().min(1),
      date_fait: z.string().optional(),
      description: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("hr_discipline" as never).insert({
    employe_id: parsed.data.employe_id,
    categorie: parsed.data.categorie,
    date_fait: parsed.data.date_fait || null,
    description: parsed.data.description ?? null,
    statut: "ouvert",
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/discipline", "/admin/rh/reclamations");
}

export async function createDepartAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_offboarding");
  const parsed = z
    .object({
      employe_id: z.string().uuid(),
      type_depart: z.string().min(1),
      date_effet: z.string().min(1),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("hr_departs" as never).insert({
    employe_id: parsed.data.employe_id,
    type_depart: parsed.data.type_depart,
    date_effet: parsed.data.date_effet,
    statut: "en_cours",
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/departs");
}

export async function createAdvanceAction(formData: FormData): Promise<void> {
  await requirePermission("payroll.calculate");
  const parsed = z
    .object({
      employe_id: z.string().uuid(),
      amount: z.coerce.number().positive(),
      currency: z.string().optional(),
      monthly_deduction: z.coerce.number().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("employee_advances" as never).insert({
    employe_id: parsed.data.employe_id,
    amount: parsed.data.amount,
    currency: parsed.data.currency || "USD",
    monthly_deduction: parsed.data.monthly_deduction ?? null,
    balance: parsed.data.amount,
    statut: "demande",
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/avances");
}

export async function createLoanAction(formData: FormData): Promise<void> {
  await requirePermission("payroll.calculate");
  const parsed = z
    .object({
      employe_id: z.string().uuid(),
      amount: z.coerce.number().positive(),
      currency: z.string().optional(),
      monthly_deduction: z.coerce.number().positive(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("employee_loans" as never).insert({
    employe_id: parsed.data.employe_id,
    amount: parsed.data.amount,
    currency: parsed.data.currency || "USD",
    monthly_deduction: parsed.data.monthly_deduction,
    balance: parsed.data.amount,
    statut: "actif",
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/prets");
}

export async function createSalaryComponentAction(formData: FormData): Promise<void> {
  await requirePermission("payroll.manage_components");
  const parsed = z
    .object({
      code: z.string().min(1),
      nom: z.string().min(1),
      kind: z.enum(["earning", "deduction", "employer_charge"]),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("salary_components" as never).insert({
    code: parsed.data.code.toUpperCase(),
    nom: parsed.data.nom,
    kind: parsed.data.kind,
    taxable: true,
    contributory: true,
    fixed_or_variable: "variable",
    active: true,
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/paie/composants");
}

export async function createPayrollRuleAction(formData: FormData): Promise<void> {
  await requirePermission("payroll.manage_rules");
  const parsed = z
    .object({
      code: z.string().min(1),
      nom: z.string().min(1),
      rule_type: z.string().min(1),
      effective_from: z.string().min(1),
      formula: z.string().optional(),
      rate: z.coerce.number().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await getClient();
  if (!supabase) return;

  const { error } = await supabase.from("legal_payroll_rules" as never).insert({
    code: parsed.data.code.toUpperCase(),
    nom: parsed.data.nom,
    rule_type: parsed.data.rule_type,
    formula: parsed.data.formula ?? null,
    rate: parsed.data.rate ?? null,
    effective_from: parsed.data.effective_from,
    jurisdiction: "CD",
    statut_validation: "draft",
  } as never);

  if (error) return;
  revalidateRh("/admin/rh/paie/regles");
}
