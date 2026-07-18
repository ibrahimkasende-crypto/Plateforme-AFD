import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateProgrammesCache() {
  revalidateTag("programmes", "max");
  revalidatePath("/");
  revalidatePath("/actions/programmes");
}
