import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateTendersCache() {
  revalidateTag("appels-offres", "max");
  revalidatePath("/appels-offres");
}
