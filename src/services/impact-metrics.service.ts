import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateImpactMetricsCache() {
  revalidateTag("chiffres-impact", "max");
  revalidatePath("/");
}
