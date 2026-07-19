/**
 * Seed RH / Paie de démonstration — lot is_demo=true, demo_batch_id=afd-hr-presentation-2026
 *
 *   CONFIRM=yes npm run seed:hr
 *
 * Prérequis : migration 20260719_050_identity_hr_payroll.sql appliquée.
 * Utilise SUPABASE_SERVICE_ROLE_KEY (bypass RLS).
 */

import { createClient } from "@supabase/supabase-js";

const BATCH = "afd-hr-presentation-2026";

function requireConfirm() {
  if (process.env.CONFIRM !== "yes") {
    console.error(`
Refus : seed RH non confirmé.

  CONFIRM=yes npm run seed:hr

Lot : ${BATCH}
`);
    process.exit(1);
  }
}

async function main() {
  requireConfirm();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.");
    process.exit(1);
  }

  const db = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const demoFlag = { is_demo: true, demo_batch_id: BATCH };

  const { data: deptRh, error: deptErr } = await db
    .from("hr_departements")
    .insert({
      code: "RH-DEMO",
      nom: "Ressources humaines (démo)",
      description: "Département fictif pour présentation",
      ...demoFlag,
    })
    .select("id")
    .single();
  if (deptErr || !deptRh) throw new Error(deptErr?.message || "Département");

  const { data: deptFin } = await db
    .from("hr_departements")
    .insert({
      code: "FIN-DEMO",
      nom: "Finance (démo)",
      parent_id: deptRh.id,
      ...demoFlag,
    })
    .select("id")
    .single();

  const { data: poste } = await db
    .from("hr_postes")
    .insert({
      code: "POST-RH-01",
      titre: "Chargé(e) RH",
      departement_id: deptRh.id,
      salaire_indicatif: 1200,
      devise: "USD",
      ...demoFlag,
    })
    .select("id")
    .single();
  if (!poste) throw new Error("Poste");

  const employes = [
    {
      matricule: "EMP-DEMO-001",
      nom: "Kabila",
      prenom: "Marie",
      email: "marie.kabila@demo.afd.local",
      departement_id: deptRh.id,
      poste_id: poste.id,
      date_embauche: "2024-03-01",
      statut: "actif",
      ...demoFlag,
    },
    {
      matricule: "EMP-DEMO-002",
      nom: "Mukendi",
      prenom: "Jean",
      email: "jean.mukendi@demo.afd.local",
      departement_id: deptFin?.id ?? deptRh.id,
      poste_id: poste.id,
      date_embauche: "2023-06-15",
      statut: "essai",
      ...demoFlag,
    },
    {
      matricule: "EMP-DEMO-003",
      nom: "Ilunga",
      prenom: "Grace",
      email: "grace.ilunga@demo.afd.local",
      departement_id: deptRh.id,
      statut: "actif",
      ...demoFlag,
    },
  ];

  const { data: insertedEmps, error: empErr } = await db
    .from("hr_employes")
    .insert(employes)
    .select("id, matricule");
  if (empErr || !insertedEmps?.length) throw new Error(empErr?.message || "Employés");

  for (const emp of insertedEmps) {
    await db.from("hr_contrats").insert({
      employe_id: emp.id,
      reference: `CTR-${emp.matricule}`,
      type_contrat: "CDI",
      poste_id: poste.id,
      date_debut: "2024-01-01",
      salaire_base: emp.matricule === "EMP-DEMO-002" ? 950 : 1200,
      devise: "USD",
      statut: "actif",
      ...demoFlag,
    });

    await db.from("hr_presences").insert({
      employe_id: emp.id,
      date_jour: "2026-06-15",
      statut: "present",
      heures_sup: emp.matricule === "EMP-DEMO-001" ? 4 : 0,
      ...demoFlag,
    });

    await db.from("hr_conges").insert({
      employe_id: emp.id,
      type_conge: "annuel",
      date_debut: "2026-08-01",
      date_fin: "2026-08-05",
      jours: 5,
      statut: "approuve_rh",
      ...demoFlag,
    });
  }

  const { data: period } = await db
    .from("payroll_periods")
    .insert({
      label: "Paie démo juin 2026",
      date_debut: "2026-06-01",
      date_fin: "2026-06-30",
      statut: "draft",
      currency: "USD",
      ...demoFlag,
    })
    .select("id")
    .single();

  await db.from("audit_logs").insert({
    action: "hr.seed.demo",
    module: "hr",
    entity_type: "demo_batch",
    entity_id: BATCH,
    new_values: {
      employes: insertedEmps.length,
      period_id: period?.id,
    },
    sensitivity: "interne",
    result: "success",
  });

  console.log(`
Seed RH appliqué — lot ${BATCH}
  • ${insertedEmps.length} employés @demo.afd.local
  • contrats, présences, congés
  • période paie : ${period?.id ?? "—"}

Purge : CONFIRM=yes npm run seed:hr:clean
`);
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
