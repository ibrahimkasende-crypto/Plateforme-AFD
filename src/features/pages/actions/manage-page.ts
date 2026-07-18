"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  route: z.string().min(1).startsWith("/"),
  titre: z.string().min(3),
  surtitre: z.string().optional(),
  resume: z.string().optional(),
  description_seo: z.string().optional(),
  contenu_principal: z.string().optional(),
  statut: z.enum([
    "brouillon",
    "en_revision",
    "approuve",
    "programme",
    "publie",
    "depublie",
    "archive",
  ]),
  publie: z.string().optional(),
});

export async function savePage(formData: FormData) {
  await requirePermission("pages:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const publie = parsed.data.publie === "on";
  const statut = publie ? "publie" : parsed.data.statut;

  const payload = {
    route: parsed.data.route,
    titre: parsed.data.titre,
    surtitre: parsed.data.surtitre || null,
    resume: parsed.data.resume || null,
    description_seo: parsed.data.description_seo || null,
    statut,
    publie,
    published_at: publie ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  let pageId = id;
  if (id) {
    await supabase.from("pages").update(payload).eq("id", id);
  } else {
    const { data } = await supabase.from("pages").insert(payload).select("id").single();
    pageId = data?.id ?? "";
  }

  if (pageId && parsed.data.contenu_principal) {
    const { data: existing } = await supabase
      .from("sections_pages")
      .select("id")
      .eq("page_id", pageId)
      .eq("type_section", "contenu")
      .order("ordre", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      await supabase
        .from("sections_pages")
        .update({
          titre: parsed.data.titre,
          contenu: parsed.data.contenu_principal,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("sections_pages").insert({
        page_id: pageId,
        type_section: "contenu",
        titre: parsed.data.titre,
        contenu: parsed.data.contenu_principal,
        ordre: 0,
        active: true,
      });
    }
  }

  revalidatePath("/admin/publications/pages");
  revalidatePath(parsed.data.route);
  redirect("/admin/publications/pages");
}
