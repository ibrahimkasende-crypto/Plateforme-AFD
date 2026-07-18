import { NextResponse } from "next/server";
import { createClientSafe } from "@/lib/supabase/safe";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const supabase = await createClientSafe();
  if (!supabase) return NextResponse.json({ error: "Service indisponible" }, { status: 503 });
  const { data: document, error } = await supabase
    .from("documents")
    .select("id, fichier_storage_path, nom_fichier")
    .eq("slug", slug)
    .eq("publie", true)
    .eq("niveau_confidentialite", "public")
    .is("deleted_at", null)
    .maybeSingle();
  if (error || !document) return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  const { data: file, error: downloadError } = await supabase.storage
    .from("documents-publics")
    .download(document.fichier_storage_path);
  if (downloadError || !file) return NextResponse.json({ error: "Fichier indisponible" }, { status: 404 });
  const filename = document.nom_fichier?.replace(/["\r\n]/g, "") || "document";
  const inline = new URL(request.url).searchParams.get("inline") === "1";
  return new NextResponse(file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
