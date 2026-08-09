"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { revalidatePublicContent } from "@/lib/cache/revalidate-public";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  key: z.string().min(2).max(120),
  value: z.string().max(10000),
});

export async function saveSiteParameter(formData: FormData) {
  await requirePermission("parametres:manage");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const { data: existing } = await supabase
    .from("parametres_site")
    .select("id")
    .eq("key", parsed.data.key)
    .maybeSingle();

  if (existing?.id) {
    await supabase
      .from("parametres_site")
      .update({ value: parsed.data.value, updated_at: new Date().toISOString() })
      .eq("key", parsed.data.key);
  } else {
    await supabase.from("parametres_site").insert({
      key: parsed.data.key,
      value: parsed.data.value,
    });
  }

  revalidatePath("/admin/parametres");
  revalidatePublicContent(["/mentions-legales", "/politique-confidentialite"]);
}

export async function saveSiteParameters(formData: FormData) {
  await requirePermission("parametres:manage");
  const entries = Array.from(formData.entries()).filter(
    ([key]) => key !== "tab" && !key.startsWith("$"),
  );

  for (const [key, value] of entries) {
    if (typeof value !== "string") continue;
    const fd = new FormData();
    fd.set("key", key);
    fd.set("value", value);
    await saveSiteParameter(fd);
  }
}
