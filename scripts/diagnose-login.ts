import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function load(file: string) {
  const p = resolve(process.cwd(), file);
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
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
    process.env[k] = v;
  }
}

load(".env.local");
load("Deploy/hostinger.env");

const email = (
  process.argv.find((a) => a.startsWith("--email="))?.split("=")[1] ||
  "ibrahimkasende21@gmail.com"
).toLowerCase();
const password =
  process.argv.find((a) => a.startsWith("--password="))?.slice("--password=".length) ||
  "IBRA@kas243";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
  const publishable =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || "";
  const service =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    "";

  console.log(
    JSON.stringify(
      {
        url,
        anonLen: anon.length,
        anonJwt: anon.startsWith("eyJ"),
        publishableLen: publishable.length,
        publishablePrefix: publishable.slice(0, 16),
        serviceLen: service.length,
        email,
      },
      null,
      2,
    ),
  );

  const admin = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let userId: string | null = null;
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const found = data.users.find((u) => (u.email || "").toLowerCase() === email);
    if (found) {
      userId = found.id;
      console.log(
        "user",
        JSON.stringify({
          id: found.id,
          confirmed: found.email_confirmed_at,
          banned: found.banned_until,
          lastSignIn: found.last_sign_in_at,
        }),
      );
      break;
    }
    if (data.users.length < 200) break;
    page += 1;
  }
  if (!userId) throw new Error("user missing");

  // Set a fresh known password
  const newPassword = "AFD-Admin-2026!";
  const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
    password: newPassword,
    email_confirm: true,
  });
  if (updErr) throw updErr;
  console.log("password reset to AFD-Admin-2026!");

  const keysToTry = [
    ["anon", anon],
    ["publishable", publishable],
  ].filter(([, k]) => Boolean(k));

  for (const [label, key] of keysToTry) {
    const client = createClient(url, key!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password: newPassword,
    });
    console.log(
      `signIn[${label}]`,
      error
        ? `FAIL ${error.message} code=${error.code || "?"}`
        : `OK user=${data.user?.id}`,
    );
  }

  // profile
  const { data: profile, error: pErr } = await admin
    .from("profils_administrateurs")
    .select("id,email,actif,statut_compte")
    .eq("id", userId)
    .maybeSingle();
  console.log("profile", profile, pErr?.message || "");

  await admin
    .from("profils_administrateurs")
    .update({ actif: true, statut_compte: "actif" } as never)
    .eq("id", userId);

  const { data: roles } = await admin
    .from("utilisateurs_roles")
    .select("role_id, roles(nom)")
    .eq("utilisateur_id", userId);
  console.log("roles", JSON.stringify(roles));
}

void main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
