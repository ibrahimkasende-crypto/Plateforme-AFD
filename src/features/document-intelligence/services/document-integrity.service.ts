import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { sha256Hex } from "@/features/document-intelligence/utils/hash";
import type { IntegrityStatus } from "@/features/document-intelligence/types";
import { integrityLabel as formatIntegrityLabel } from "@/features/document-intelligence/utils/integrity-labels";

export const integrityLabel = formatIntegrityLabel;

type Db = SupabaseClient;

export async function computeAndStoreFingerprint(
  supabase: Db,
  documentId: string,
  buffer: Buffer,
) {
  const hash = sha256Hex(buffer);

  const { data: existing } = await supabase
    .from("document_fingerprints" as never)
    .select("document_id, hash_sha256")
    .eq("hash_sha256", hash)
    .neq("document_id", documentId)
    .limit(1)
    .maybeSingle();

  await supabase.from("document_fingerprints" as never).insert({
    document_id: documentId,
    hash_sha256: hash,
    algorithm: "sha256",
  } as never);

  await supabase
    .from("documents_importes" as never)
    .update({ hash_sha256: hash } as never)
    .eq("id", documentId);

  const duplicateOfId =
    existing && typeof existing === "object" && "document_id" in existing
      ? String((existing as { document_id: string }).document_id)
      : null;

  return { hash, duplicateOfId };
}

/**
 * Vérifie la signature numérique PDF si possible.
 * Ne confond jamais une signature manuscrite OCR avec une preuve cryptographique.
 */
export async function assessPdfIntegrity(
  buffer: Buffer,
  mimeType: string,
): Promise<{
  integrityStatus: IntegrityStatus;
  digitalChecked: boolean;
  notes: string[];
}> {
  const notes: string[] = [];

  if (mimeType !== "application/pdf") {
    return {
      integrityStatus: "verification_unavailable",
      digitalChecked: false,
      notes: ["Vérification de signature numérique limitée aux PDF."],
    };
  }

  const text = buffer.toString("latin1");
  const hasSigDict = /\/Type\s*\/Sig\b/.test(text) || /\/ByteRange\s*\[/.test(text);

  if (!hasSigDict) {
    notes.push("Aucune signature numérique PDF détectée (document non signé cryptographiquement).");
    return {
      integrityStatus: "unsigned",
      digitalChecked: true,
      notes,
    };
  }

  // Sans bibliothèque de validation PKCS#7 complète, on ne prétend pas valider.
  notes.push(
    "Dictionnaire de signature PDF détecté — validation cryptographique complète indisponible dans cet environnement.",
  );
  return {
    integrityStatus: "verification_unavailable",
    digitalChecked: true,
    notes,
  };
}
