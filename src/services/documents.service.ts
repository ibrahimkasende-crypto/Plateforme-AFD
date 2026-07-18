import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateDocumentsCache() {
  revalidateTag("documents", "max");
  revalidateTag("rapports", "max");
  revalidatePath("/documents");
  revalidatePath("/rapports");
}
