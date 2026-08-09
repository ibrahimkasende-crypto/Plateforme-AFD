/**
 * Jeu de démonstration AFD, sûr et idempotent.
 * Usage : npm run demo:seed -- --dry-run | --execute
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const BATCH = "afd-demo-client-2026";
const SOURCE = "seed-afd-demo-data";
const args = new Set(process.argv.slice(2));
const execute = args.has("--execute");

type Row = Record<string, unknown>;

function loadLocalEnv() {
  const file = resolve(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!match || match[1].startsWith("#") || process.env[match[1]]) continue;
    const value = match[2].replace(/^(['"])(.*)\1$/, "$2");
    process.env[match[1]] = value;
  }
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Variable d'environnement manquante : ${name}`);
  return value;
}

function demo(row: Row): Row {
  return { ...row, is_demo: true, demo_batch_id: BATCH, demo_source: SOURCE };
}

function isMissingColumn(error: { code?: string; message?: string } | null, column: string) {
  return Boolean(
    error &&
      (error.code === "42703" || error.code === "PGRST204") &&
      error.message?.includes(column),
  );
}

async function insertDemo(
  db: ReturnType<typeof createClient>,
  table: string,
  rows: Row[],
  onConflict?: string,
) {
  let payload = rows.map(demo);
  const write = (value: Row[]) =>
    onConflict
      ? db.from(table as never).upsert(value as never, { onConflict })
      : db.from(table as never).insert(value as never);
  let result = await write(payload);
  if (isMissingColumn(result.error, "demo_source")) {
    payload = payload.map(({ demo_source: _source, ...row }) => row);
    result = await write(payload);
  }
  if (isMissingColumn(result.error, "demo_batch_id")) {
    console.warn(`${table}: demo_batch_id absent, repli sur is_demo=true uniquement.`);
    payload = payload.map(({ demo_batch_id: _batch, ...row }) => row);
    result = await write(payload);
  }
  if (isMissingColumn(result.error, "is_demo")) {
    console.warn(`${table}: colonne is_demo absente — table ignorée.`);
    return;
  }
  if (
    result.error &&
    /relation .* does not exist|Could not find the table/i.test(result.error.message)
  ) {
    console.warn(`${table}: table absente — ignorée.`);
    return;
  }
  if (result.error) throw new Error(`${table}: ${result.error.message}`);
  console.log(`${table}: ${payload.length} ligne(s) démo OK`);
}

async function insertIfPresent(
  db: ReturnType<typeof createClient>,
  table: string,
  rows: Row[],
  onConflict?: string,
) {
  try {
    await insertDemo(db, table, rows, onConflict);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/relation .* does not exist|Could not find the table/i.test(message)) {
      console.warn(`${table}: table absente, ignorée.`);
      return;
    }
    throw error;
  }
}

async function clearBatch(db: ReturnType<typeof createClient>, table: string) {
  let result = await db
    .from(table as never)
    .delete()
    .eq("is_demo", true)
    .eq("demo_batch_id", BATCH);
  if (isMissingColumn(result.error, "is_demo")) {
    console.warn(`${table}: colonne is_demo absente — clear ignoré.`);
    return;
  }
  if (isMissingColumn(result.error, "demo_batch_id")) {
    console.warn(`${table}: demo_batch_id absent, suppression des seules lignes is_demo=true.`);
    result = await db.from(table as never).delete().eq("is_demo", true);
  }
  if (
    result.error &&
    !/relation .* does not exist|Could not find the table/i.test(result.error.message)
  ) {
    throw new Error(`${table}: ${result.error.message}`);
  }
}

const programmes = [
  ["afd-demo-autonomisation", "Autonomisation économique inclusive", "Renforcer les revenus des femmes par la formation, l'épargne et l'accès au marché.", "briefcase", "violet"],
  ["afd-demo-protection", "Protection et prévention des VBG", "Prévenir les violences et accompagner les survivantes avec les services communautaires.", "shield", "red"],
  ["afd-demo-sante", "Santé maternelle et infantile", "Améliorer les soins essentiels des mères, nouveau-nés et enfants.", "heart-pulse", "pink"],
  ["afd-demo-education", "Éducation et compétences de vie", "Soutenir la scolarisation des filles et l'alphabétisation des femmes.", "book-open", "blue"],
  ["afd-demo-wash", "Eau, hygiène et assainissement", "Développer un accès durable à l'eau potable et aux pratiques d'hygiène.", "droplet", "cyan"],
].map(([slug, title, description, icon, color], index) => ({
  slug,
  title,
  description,
  long_description: `${description} Le programme de démonstration AFD combine la participation communautaire, le suivi des résultats et la coordination avec les acteurs locaux.`,
  icon,
  color,
  order: index + 1,
  active: true,
}));

const projets = [
  ["afd-demo-entrepreneuriat-kinshasa", "Académie entrepreneuriale des femmes", "Kinshasa", "afd-demo-autonomisation", "en_cours", 285000, 1800, "2026-01-15", "2027-12-31"],
  ["afd-demo-epargne-kwilu", "Groupes d'épargne ruraux", "Kwilu", "afd-demo-autonomisation", "en_cours", 195000, 2400, "2025-09-01", "2027-08-31"],
  ["afd-demo-jardins-kwango", "Jardins maraîchers résilients", "Kwango", "afd-demo-autonomisation", "futur", 220000, 1600, "2026-10-01", "2028-09-30"],
  ["afd-demo-centres-protection-ituri", "Centres d'écoute et protection communautaire", "Ituri", "afd-demo-protection", "en_cours", 340000, 3200, "2025-06-01", "2027-05-31"],
  ["afd-demo-sante-haut-katanga", "Maternités sûres et soins néonataux", "Haut-Katanga", "afd-demo-sante", "en_cours", 410000, 5600, "2025-03-01", "2027-02-28"],
  ["afd-demo-cliniques-tshopo", "Cliniques mobiles de proximité", "Tshopo", "afd-demo-sante", "termine", 265000, 4300, "2024-01-01", "2025-12-31"],
  ["afd-demo-filles-nord-kivu", "Maintien des filles à l'école", "Nord-Kivu", "afd-demo-education", "en_cours", 375000, 3900, "2025-08-01", "2027-07-31"],
  ["afd-demo-alphabetisation-tshuapa", "Alphabétisation et compétences numériques", "Tshuapa", "afd-demo-education", "futur", 175000, 1200, "2026-09-01", "2028-08-31"],
  ["afd-demo-eau-kinshasa", "Eau potable dans les quartiers périphériques", "Kinshasa", "afd-demo-wash", "termine", 230000, 6800, "2024-02-01", "2025-11-30"],
  ["afd-demo-hygiene-kwilu", "Hygiène scolaire et latrines inclusives", "Kwilu", "afd-demo-wash", "en_cours", 190000, 3500, "2025-10-01", "2027-09-30"],
  ["afd-demo-eau-ituri", "Réhabilitation de sources communautaires", "Ituri", "afd-demo-wash", "futur", 310000, 5100, "2026-11-01", "2028-10-31"],
  ["afd-demo-protection-nord-kivu", "Prévention VBG auprès des déplacés", "Nord-Kivu", "afd-demo-protection", "termine", 290000, 4700, "2024-04-01", "2025-10-31"],
].map(([slug, title, province, programmeSlug, status, budget, beneficiaries, start_date, end_date]) => ({
  slug, title, location: province, programmeSlug, status, budget, beneficiaries, start_date, end_date,
  description: `${title} : intervention intégrée de l'AFD dans la province de ${province}.`,
  results: "Résultats suivis trimestriellement avec les communautés bénéficiaires.",
  active: true,
}));

const actualites = [
  ["afd-demo-forum-kinshasa", "Forum des initiatives féminines à Kinshasa", "Les bénéficiaires partagent leurs initiatives et leurs résultats.", "evenement"],
  ["afd-demo-sante-haut-katanga", "Nouvelles formations pour les sages-femmes", "Les équipes de santé renforcent la qualité des soins maternels.", "programme"],
  ["afd-demo-eau-kwilu", "Les écoles du Kwilu améliorent l'hygiène", "Des clubs scolaires mobilisent les élèves et les parents.", "activite"],
  ["afd-demo-protection-ituri", "Les réseaux communautaires de protection se renforcent", "Les relais locaux améliorent l'orientation des survivantes.", "programme"],
  ["afd-demo-education-nord-kivu", "Une rentrée plus sûre pour les filles", "Les espaces d'apprentissage accueillent de nouvelles élèves.", "activite"],
].map(([slug, title, excerpt, category], index) => ({
  slug, title, excerpt, category, published: true,
  published_at: new Date(Date.UTC(2026, 6, 30 - index * 5)).toISOString(),
  content: `${excerpt} Cette actualité fait partie du jeu de démonstration de l'AFD et illustre le suivi des interventions.`,
  author: "AFD — équipe communication",
}));

async function main() {
  if (!args.has("--dry-run") && !execute) {
    console.log("Mode sécurisé par défaut : dry-run. Utilisez --execute pour écrire.");
  }
  if (!execute) {
    console.log(JSON.stringify({
      mode: "dry-run", demo_batch_id: BATCH, programmes: 5, projets: 12,
      activites: 36, partenaires: 5, actualites: 5, chiffres_impact: 5,
      finances_budgets: 12, finances_depenses: 12,
    }, null, 2));
    return;
  }

  loadLocalEnv();
  const db = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } },
  );

  for (const table of ["finances_depenses", "finances_budgets", "activites", "chiffres_impact", "actualites", "partenaires", "projets", "programmes"]) {
    await clearBatch(db, table);
  }

  await insertIfPresent(db, "programmes", programmes, "slug");
  const { data: programmeRows, error: programmeError } = await db
    .from("programmes")
    .select("id, slug")
    .in("slug", programmes.map((programme) => programme.slug));
  if (programmeError) {
    console.warn(`programmes: lecture impossible — ${programmeError.message}`);
  }
  const programmeIds = new Map(
    (programmeRows ?? []).map((row) => [row.slug, row.id]),
  );

  await insertIfPresent(
    db,
    "projets",
    projets.map(({ programmeSlug, ...project }) => ({
      ...project,
      program_id: programmeIds.get(programmeSlug) ?? null,
    })),
    "slug",
  );
  const { data: projectRows, error: projectError } = await db
    .from("projets")
    .select("id, slug, program_id, location")
    .in("slug", projets.map((project) => project.slug));
  if (projectError) {
    console.warn(`projets: lecture impossible — ${projectError.message}`);
  }

  const activities = (projectRows ?? []).flatMap((project, index) =>
    ["Sensibilisation communautaire", "Atelier de renforcement des capacités", "Suivi des bénéficiaires"].map((title, offset) => {
      const femmes = 45 + index * 4 + offset * 6;
      const hommes = 18 + index * 2 + offset * 3;
      const enfants = 20 + index * 3 + offset * 4;
      const jeunes = 25 + index * 2 + offset * 5;
      return {
        title: `${title} — ${project.location}`,
        type: offset === 0 ? "sensibilisation" : offset === 1 ? "formation" : "suivi",
        description: `Activité de démonstration liée au projet ${project.slug}.`,
        activity_date: `2026-${String(2 + ((index + offset) % 8)).padStart(2, "0")}-15`,
        province: project.location,
        location: project.location,
        programme_id: project.program_id,
        projet_id: project.id,
        femmes, hommes, enfants, jeunes, total: femmes + hommes + enfants + jeunes,
        status: offset === 2 || index % 3 !== 0 ? "realisee" : "planifiee",
        active: true,
      };
    }),
  );
  await insertDemo(db, "activites", activities);

  await insertIfPresent(db, "partenaires", [
    ["afd-demo-un-femmes", "ONU Femmes — démonstration", "ONU Femmes", "institutionnel"],
    ["afd-demo-unicef", "UNICEF — démonstration", "UNICEF", "institutionnel"],
    ["afd-demo-ue", "Union européenne — démonstration", "UE", "bailleur"],
    ["afd-demo-fondation", "Fondation Solidarité — démonstration", "FS", "fondation"],
    ["afd-demo-reseau", "Réseau local des femmes — démonstration", "RLF", "ong"],
  ].map(([slug, name, acronyme, category], index) => ({
    slug, name, acronyme, category, description: `Partenaire de démonstration ${name}.`,
    active: true, publie: true, mise_en_avant: index < 2, order: 100 + index,
  })));

  await insertIfPresent(db, "actualites", actualites, "slug");
  await insertIfPresent(db, "chiffres_impact", [
    ["afd_demo_beneficiaires", "Bénéficiaires accompagnés", 43100, "personnes", "+", "users"],
    ["afd_demo_femmes_formees", "Femmes formées", 12400, "femmes", "+", "graduation-cap"],
    ["afd_demo_points_eau", "Points d'eau réhabilités", 86, "ouvrages", "", "droplet"],
    ["afd_demo_filles_scolarisees", "Filles soutenues dans leur scolarité", 7900, "filles", "+", "book-open"],
    ["afd_demo_provinces", "Provinces d'intervention", 8, "provinces", "", "map-pin"],
  ].map(([key, label, value, unit, suffix, icon], index) => ({
    key, label, value, unit, suffix, icon, order_index: 100 + index,
    description: "Indicateur de démonstration AFD.", reference_period: "2026",
    validation_source: "Jeu de démonstration", active: true, validated: true,
  })), "key");

  const projectBySlug = new Map((projectRows ?? []).map((row) => [row.slug, row]));
  const budgets = projets.map((project, index) => ({
    label: `Budget démo — ${project.title}`,
    programme_id: projectBySlug.get(project.slug)?.program_id ?? null,
    projet_id: projectBySlug.get(project.slug)?.id ?? null,
    amount_planned: project.budget,
    currency: "USD",
    period_start: project.start_date,
    period_end: project.end_date,
    statut: "approuve",
    version_num: 1,
    notes: "Budget généré par le seed de démonstration.",
  }));
  await insertIfPresent(db, "finances_budgets", budgets);
  const { data: budgetRows } = await db
    .from("finances_budgets" as never)
    .select("id, label, programme_id, projet_id, amount_planned")
    .eq("is_demo", true)
    .eq("demo_batch_id", BATCH);
  await insertIfPresent(db, "finances_depenses", (budgetRows ?? []).map((budget: Row, index) => ({
    label: `Dépense démo — ${String(budget.label).replace("Budget", "Mise en œuvre")}`,
    budget_id: budget.id, programme_id: budget.programme_id, projet_id: budget.projet_id,
    amount: Math.round(Number(budget.amount_planned) * (0.28 + (index % 4) * 0.12)),
    currency: "USD", spent_at: `2026-${String(2 + (index % 7)).padStart(2, "0")}-20`,
    status: index % 3 === 0 ? "soumise" : "payee",
    justification: "Dépense de démonstration pour visualisation financière.",
    fournisseur: "Prestataire démo AFD",
  })));

  console.log(JSON.stringify({ ok: true, demo_batch_id: BATCH, source: SOURCE, activites: activities.length }, null, 2));
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
