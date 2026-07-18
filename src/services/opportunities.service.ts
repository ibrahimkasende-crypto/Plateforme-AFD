import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateOpportunitiesCache() {
  revalidateTag("opportunites", "max");
  revalidatePath("/opportunites");
}
