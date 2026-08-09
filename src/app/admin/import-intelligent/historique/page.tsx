import { redirect } from "next/navigation";

/** Alias historique → file d’attente OCR existante */
export default function ImportHistoriquePage() {
  redirect("/admin/import-intelligent/file-attente");
}
