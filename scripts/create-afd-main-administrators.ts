/**
 * Crée / met à jour les deux administrateurs principaux AFD (Direction + IT).
 *
 * Usage :
 *   npm run admin:create-afd-main -- --dry-run
 *   npm run admin:create-afd-main -- --execute
 *
 * Variables requises (serveur uniquement) :
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   AFD_CHRISTIAN_TEMP_PASSWORD  (mode --execute)
 *   AFD_ESTHER_TEMP_PASSWORD     (mode --execute)
 *
 * Ne jamais logger ni committer les mots de passe.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient, type User } from "@supabase/supabase-js";

type AdminSpec = {
  key: "christian" | "esther";
  email: string;
  prenom: string;
  nom: string;
  displayName: string;
  telephone: string;
  fonction: string;
  role: "admin_principal_direction" | "admin_principal_it";
  passwordEnv: "AFD_CHRISTIAN_TEMP_PASSWORD" | "AFD_ESTHER_TEMP_PASSWORD";
};

const ADMINS: AdminSpec[] = [
  {
    key: "christian",
    email: "contactafdrdc@gmail.com",
    prenom: "Christian",
    nom: "Sebo",
    displayName: "Christian Sebo",
    telephone: "+243 985710039",
    fonction: "Directeur de l’AFD",
    role: "admin_principal_direction",
    passwordEnv: "AFD_CHRISTIAN_TEMP_PASSWORD",
  },
  {
    key: "esther",
    email: "esthermakadi6@gmail.com",
    prenom: "Esther",
    nom: "Makadi",
    displayName: "Esther Makadi",
    telephone: "+243 814193369",
    fonction: "IT de l’AFD",
    role: "admin_principal_it",
    passwordEnv: "AFD_ESTHER_TEMP_PASSWORD",
  },
];

function loadEnvFile(fileName: string) {
  const path = resolve(process.cwd(), fileName);
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env) || !process.env[key]) {
      process.env[key] = value;
    }
  }
}

function parseMode(): "dry-run" | "execute" {
  const args = process.argv.slice(2);
  if (args.includes("--execute")) return "execute";
  if (args.includes("--dry-run")) return "dry-run";
  console.error("Indiquer --dry-run ou --execute.");
  process.exit(1);
}

async function findUserByEmail(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any,
  email: string,
): Promise<User | null> {
  const target = email.toLowerCase();
  let page = 1;
  for (;;) {
    const { data, error } = await service.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw new Error(`listUsers: ${error.message}`);
    const found = data.users.find(
      (u: User) => u.email?.toLowerCase() === target,
    );
    if (found) return found;
    if (!data.users.length || data.users.length < 200) return null;
    page += 1;
    if (page > 50) return null;
  }
}

async function ensureRoleId(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any,
  roleName: string,
): Promise<string> {
  const { data, error } = await service
    .from("roles")
    .select("id")
    .eq("nom", roleName)
    .maybeSingle();
  if (error) throw new Error(`roles ${roleName}: ${error.message}`);
  if (!data?.id) {
    throw new Error(
      `Rôle ${roleName} introuvable — appliquer la migration 20260804_070.`,
    );
  }
  return data.id as string;
}

async function upsertProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any,
  userId: string,
  admin: AdminSpec,
  now: string,
) {
  const payload = {
    id: userId,
    email: admin.email.toLowerCase(),
    prenom: admin.prenom,
    nom_famille: admin.nom,
    nom_complet: admin.displayName,
    telephone: admin.telephone,
    fonction: admin.fonction,
    actif: true,
    statut_compte: "active",
    must_change_password: false,
    temporary_password_issued_at: now,
    updated_at: now,
  };

  const { error } = await service
    .from("profils_administrateurs")
    .upsert(payload, { onConflict: "id" });
  if (error) throw new Error(`profil upsert: ${error.message}`);
}

async function assignRoleOnly(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any,
  userId: string,
  roleId: string,
  roleName: string,
) {
  const { data: existing } = await service
    .from("utilisateurs_roles")
    .select("role_id, roles(nom)")
    .eq("utilisateur_id", userId);

  const rows = (existing ?? []) as Array<{
    role_id: string;
    roles: { nom: string } | null;
  }>;

  const already = rows.some((r) => r.roles?.nom === roleName);
  if (!already) {
    const { error } = await service.from("utilisateurs_roles").insert({
      utilisateur_id: userId,
      role_id: roleId,
    });
    if (error) throw new Error(`role assign: ${error.message}`);
  }

  // Retirer un éventuel siège principal concurrent sur le même compte
  const principalAliases = [
    "admin_principal_direction",
    "admin_principal_it",
    "admin_principal",
    "administrateur",
  ];
  for (const row of rows) {
    const nom = row.roles?.nom;
    if (!nom || nom === roleName) continue;
    if (principalAliases.includes(nom)) {
      await service
        .from("utilisateurs_roles")
        .delete()
        .eq("utilisateur_id", userId)
        .eq("role_id", row.role_id);
    }
  }
}

async function logCreation(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any,
  userId: string,
  admin: AdminSpec,
  action: "created" | "updated",
) {
  try {
    await service.rpc("log_admin_activity", {
      p_action: `admin.main_${action}`,
      p_details: {
        email: admin.email,
        role: admin.role,
        display_name: admin.displayName,
      },
      p_utilisateur_id: userId,
    });
  } catch {
    // journal optionnel
  }

  try {
    await service.from("user_status_history").insert({
      user_id: userId,
      previous_status: null,
      new_status: "active",
      reason: `Compte administrateur principal ${admin.role} (${action})`,
      actor_id: userId,
    });
  } catch {
    // table optionnelle
  }
}

async function processAdmin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any,
  admin: AdminSpec,
  mode: "dry-run" | "execute",
) {
  const existing = await findUserByEmail(service, admin.email);
  const roleId = await ensureRoleId(service, admin.role);
  const password = process.env[admin.passwordEnv]?.trim() ?? "";

  const plan = {
    email: admin.email,
    role: admin.role,
    displayName: admin.displayName,
    auth: existing ? "update_existing_user" : "create_user",
    profile: existing ? "upsert_profile" : "create_profile",
    must_change_password: false,
  };

  console.log(`\n→ ${admin.displayName} <${admin.email}>`);
  console.log(`  rôle : ${admin.role}`);
  console.log(`  auth : ${plan.auth}`);
  console.log(`  profil : ${plan.profile}`);
  console.log(`  must_change_password : true`);

  if (mode === "dry-run") {
    return { ...plan, status: "dry-run" as const };
  }

  if (!password || password.length < 6) {
    throw new Error(
      `${admin.passwordEnv} manquant ou trop court (ne jamais committer cette valeur).`,
    );
  }

  const now = new Date().toISOString();
  let userId: string;
  let action: "created" | "updated";

  if (existing) {
    userId = existing.id;
    action = "updated";
    const { error } = await service.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
      user_metadata: {
        full_name: admin.displayName,
        must_change_password: false,
      },
      app_metadata: {
        afd_role: admin.role,
      },
    });
    if (error) throw new Error(`updateUserById: ${error.message}`);
  } else {
    action = "created";
    const { data, error } = await service.auth.admin.createUser({
      email: admin.email.toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: {
        full_name: admin.displayName,
        must_change_password: false,
      },
      app_metadata: {
        afd_role: admin.role,
      },
    });
    if (error || !data.user) {
      throw new Error(`createUser: ${error?.message ?? "utilisateur null"}`);
    }
    userId = data.user.id;
  }

  await upsertProfile(service, userId, admin, now);
  await assignRoleOnly(service, userId, roleId, admin.role);
  await logCreation(service, userId, admin, action);

  console.log(`  résultat : ${action} (id=${userId})`);
  return { ...plan, status: action, userId };
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const mode = parseMode();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim();

  if (!url || !key) {
    console.error(
      "Variables manquantes : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY",
    );
    process.exit(1);
  }

  console.log("AFD — administrateurs principaux");
  console.log(`Mode : ${mode}`);
  console.log(`URL  : ${url}`);
  console.log("Clé service : configurée (valeur masquée)");

  const service = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const results = [];
  for (const admin of ADMINS) {
    try {
      results.push(await processAdmin(service, admin, mode));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Échec pour ${admin.email} : ${message}`);
      process.exit(1);
    }
  }

  console.log("\n=== Résumé (sans secrets) ===");
  for (const r of results) {
    console.log(
      `- ${r.displayName} | ${r.role} | ${r.auth} | ${r.status}`,
    );
  }

  if (mode === "execute") {
    console.log(`
Recommandation sécurité :
  • Demander à chaque admin de changer le mot de passe à la première connexion.
  • Supprimer AFD_CHRISTIAN_TEMP_PASSWORD et AFD_ESTHER_TEMP_PASSWORD
    de .env.local / Hostinger dès que possible.
`);
  } else {
    console.log("\nDry-run terminé — aucune écriture effectuée.");
  }
}

void main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
