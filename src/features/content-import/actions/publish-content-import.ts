"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ContentEntityType } from "@/features/content-import/types";
import { requirePermission } from "@/lib/auth/require-permission";
import { revalidatePublicContent } from "@/lib/cache/revalidate-public";
import { createClientSafe } from "@/lib/supabase/safe";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function fieldMap(fieldsJson: string): Record<string, string> {
  try {
    const parsed = JSON.parse(fieldsJson) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function pick(map: Record<string, string>, ...keys: string[]) {
  for (const k of keys) {
    const v = map[k]?.trim();
    if (v) return v;
  }
  return "";
}

export async function publishContentImportAction(
  formData: FormData,
): Promise<{ ok: true; id: string; redirectTo: string } | { ok: false; error: string }> {
  const entityType = String(formData.get("entityType") || "") as ContentEntityType;
  const fields = fieldMap(String(formData.get("fieldsJson") || "{}"));
  const publishNow = String(formData.get("publishNow") || "") === "1";

  const supabase = await createClientSafe();
  if (!supabase) return { ok: false, error: "Supabase indisponible." };

  try {
    if (entityType === "projet") {
      await requirePermission("projets:write");
      const title = pick(fields, "titre", "title");
      const description =
        pick(fields, "description") ||
        pick(fields, "objectifs") ||
        "Description à compléter.";
      const location =
        pick(fields, "zone", "province", "territoire", "location") ||
        "République démocratique du Congo";
      if (title.length < 3) {
        return { ok: false, error: "Le titre du projet est obligatoire." };
      }
      const statusRaw = pick(fields, "statut", "status") || "en_cours";
      const status = z
        .enum(["en_cours", "termine", "futur"])
        .safeParse(statusRaw).success
        ? (statusRaw as "en_cours" | "termine" | "futur")
        : "en_cours";
      const budget = Number(pick(fields, "budget").replace(",", ".")) || null;
      const beneficiaries =
        Number(pick(fields, "beneficiaires").replace(/\s/g, "")) || null;
      const start =
        pick(fields, "date_debut", "start_date") ||
        new Date().toISOString().slice(0, 10);
      const results =
        [
          pick(fields, "resultats_obtenus"),
          pick(fields, "resultats_attendus"),
          pick(fields, "objectifs"),
        ]
          .filter(Boolean)
          .join("\n\n") || null;

      const payload = {
        title,
        slug: slugify(title),
        description,
        location,
        status,
        start_date: start,
        end_date: pick(fields, "date_fin") || null,
        budget,
        beneficiaries,
        results,
        active: publishNow,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("projets")
        .insert(payload)
        .select("id")
        .single();
      if (error || !data) {
        return { ok: false, error: error?.message || "Échec création projet." };
      }
      revalidatePath("/admin/projets");
      revalidatePublicContent(["/actions/projets", "/"]);
      return {
        ok: true,
        id: data.id as string,
        redirectTo: `/admin/projets/${data.id as string}`,
      };
    }

    if (entityType === "programme") {
      await requirePermission("programmes:write");
      const title = pick(fields, "titre", "title");
      const description =
        pick(fields, "description") || "Description à compléter.";
      const longDescription =
        pick(fields, "long_description") || description;
      if (title.length < 3) {
        return { ok: false, error: "Le titre du programme est obligatoire." };
      }
      const payload = {
        title,
        slug: slugify(title),
        description,
        long_description: longDescription,
        icon: "heart",
        color: "sky",
        active: publishNow,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from("programmes")
        .insert(payload)
        .select("id")
        .single();
      if (error || !data) {
        return {
          ok: false,
          error: error?.message || "Échec création programme.",
        };
      }
      revalidatePath("/admin/programmes");
      revalidatePublicContent(["/actions/programmes", "/"]);
      return {
        ok: true,
        id: data.id as string,
        redirectTo: `/admin/programmes/${data.id as string}`,
      };
    }

    if (entityType === "activite") {
      await requirePermission("activites:write");
      const title = pick(fields, "titre", "title");
      if (title.length < 3) {
        return { ok: false, error: "Le titre de l’activité est obligatoire." };
      }
      const payload = {
        title,
        type: pick(fields, "type") || "formation",
        description: pick(fields, "description") || null,
        activity_date: pick(fields, "activity_date", "date_debut") || null,
        province: pick(fields, "province") || null,
        location: pick(fields, "zone", "territoire") || null,
        status: publishNow ? "realisee" : "planifiee",
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from("activites" as never)
        .insert({
          ...payload,
          active: true,
          is_demo: false,
          demo_batch_id: null,
        } as never)
        .select("id")
        .single();
      if (error || !data) {
        return {
          ok: false,
          error: error?.message || "Échec création activité.",
        };
      }
      revalidatePath("/admin/activites");
      revalidatePublicContent(["/bibliotheque", "/"]);
      return {
        ok: true,
        id: (data as { id: string }).id,
        redirectTo: `/admin/activites/${(data as { id: string }).id}`,
      };
    }

    if (entityType === "actualite") {
      await requirePermission("actualites:write");
      const title = pick(fields, "titre", "title");
      const content =
        pick(fields, "contenu", "description") ||
        pick(fields, "resume") ||
        "";
      if (title.length < 3 || content.length < 10) {
        return {
          ok: false,
          error: "Titre et contenu sont obligatoires pour une actualité.",
        };
      }
      const payload = {
        title,
        slug: slugify(title),
        excerpt: pick(fields, "resume") || content.slice(0, 180),
        content,
        published: publishNow,
        published_at: publishNow
          ? pick(fields, "date_publication") || new Date().toISOString()
          : null,
        status: publishNow ? "publie" : "brouillon",
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from("actualites")
        .insert(payload as never)
        .select("id")
        .single();
      if (error || !data) {
        return {
          ok: false,
          error: error?.message || "Échec création actualité.",
        };
      }
      revalidatePath("/admin/publications/actualites");
      revalidatePublicContent(["/actualites", "/"]);
      return {
        ok: true,
        id: (data as { id: string }).id,
        redirectTo: `/admin/publications/actualites`,
      };
    }

    return {
      ok: false,
      error: `Type « ${entityType} » pas encore branché en publication automatique. Utilisez le formulaire manuel.`,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erreur de publication.",
    };
  }
}
