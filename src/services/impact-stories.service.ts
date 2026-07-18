import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateImpactStoriesCache() {
  revalidateTag("histoires-impact", "max");
  revalidatePath("/");
  revalidatePath("/impact/histoires");
}
