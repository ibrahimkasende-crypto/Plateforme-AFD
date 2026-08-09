/**
 * Réparation rapide connexion admin (projet mxxux).
 * Usage :
 *   npx tsx scripts/fix-admin-login.ts --email=vous@exemple.com --password='NouveauMotDePasse'
 *
 * - confirme l’e-mail Auth
 * - réinitialise le mot de passe
 * - vérifie / crée le profil administrateur actif
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv(file: string) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i <= 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

function arg(name: string): string | null {
  const prefix = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : null;
}

async function main() {
  loadEnv(".env.local");
  loadEnv(".env");

  const email = (arg("email") || process.env.AFD_FIX_ADMIN_EMAIL || "")
    .trim()
    .toLowerCase();
  const password = arg("password") || process.env.AFD_FIX_ADMIN_PASSWORD || "";

  if (!email || !password) {
    console.error(
      "Usage: npx tsx scripts/fix-admin-login.ts --email=admin@exemple.com --password='MotDePasseSecurise'",
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Mot de passe trop court (min. 8).");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) {
    console.error("NEXT_PUBLIC_SUPABASE_URL / SERVICE_ROLE manquants.");
    process.exit(1);
  }

  if (!url.includes("mxxuxnoqnwjygawvvhcb")) {
    console.error("URL Supabase hors projet mandaté mxxuxnoqnwjygawvvhcb — arrêt.");
    process.exit(1);
  }

  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("Projet :", url);
  console.log("E-mail :", email);

  // Cherche l’utilisateur (pagination)
  let userId: string | null = null;
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw new Error(error.message);
    const found = data.users.find(
      (u) => (u.email || "").toLowerCase() === email,
    );
    if (found) {
      userId = found.id;
      break;
    }
    if (data.users.length < 200) break;
    page += 1;
  }

  if (!userId) {
    console.log("Compte Auth absent — création…");
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error || !data.user) {
      throw new Error(error?.message || "Création Auth impossible");
    }
    userId = data.user.id;
    console.log("Auth créé :", userId);
  } else {
    console.log("Auth trouvé :", userId);
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
    console.log("Mot de passe réinitialisé + e-mail confirmé.");
  }

  // Profil admin
  const { data: profile, error: profileError } = await admin
    .from("profils_administrateurs")
    .select("id, email, actif, statut_compte")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    console.warn("Lecture profil :", profileError.message);
  }

  if (!profile) {
    const { error: insertError } = await admin
      .from("profils_administrateurs")
      .insert({
        id: userId,
        email,
        nom_complet: email.split("@")[0],
        actif: true,
        statut_compte: "actif",
      } as never);
    if (insertError) {
      // schéma partiel
      const { error: insert2 } = await admin
        .from("profils_administrateurs")
        .insert({
          id: userId,
          email,
          nom_complet: email.split("@")[0],
          actif: true,
        } as never);
      if (insert2) {
        console.warn("Profil non créé :", insert2.message);
      } else {
        console.log("Profil administrateur créé (actif).");
      }
    } else {
      console.log("Profil administrateur créé (actif).");
    }
  } else {
    const { error: upd } = await admin
      .from("profils_administrateurs")
      .update({
        actif: true,
        statut_compte: "actif",
        email,
      } as never)
      .eq("id", userId);
    if (upd) {
      await admin
        .from("profils_administrateurs")
        .update({ actif: true, email } as never)
        .eq("id", userId);
    }
    // Harmonise aussi "active" → "actif" si la colonne l’accepte
    await admin
      .from("profils_administrateurs")
      .update({ actif: true } as never)
      .eq("id", userId);
    console.log("Profil existant réactivé.");
  }

  // Rôle super_admin si table présente
  const { data: role } = await admin
    .from("roles")
    .select("id, nom")
    .eq("nom", "super_admin")
    .maybeSingle();

  if (role?.id) {
    const { data: existing } = await admin
      .from("utilisateurs_roles")
      .select("id")
      .eq("utilisateur_id", userId)
      .eq("role_id", role.id)
      .maybeSingle();
    if (!existing) {
      const { error: roleErr } = await admin.from("utilisateurs_roles").insert({
        utilisateur_id: userId,
        role_id: role.id,
      } as never);
      if (roleErr) console.warn("Rôle :", roleErr.message);
      else console.log("Rôle super_admin attribué.");
    } else {
      console.log("Rôle super_admin déjà présent.");
    }
  }

  // Test connexion
  const probe = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: signIn, error: signInError } = await probe.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError || !signIn.user) {
    console.error("ÉCHEC test signIn :", signInError?.message || "inconnu");
    process.exit(1);
  }
  console.log("SUCCÈS — connexion Auth OK pour", email);
  console.log("Connectez-vous sur https://afd-rdc.org/connexion avec ce mot de passe.");
}

void main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
