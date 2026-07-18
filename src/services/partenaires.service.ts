import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidatePartenairesCache() {
  revalidateTag("partenaires", "max");
  revalidatePath("/");
  revalidatePath("/partenaires");
  revalidatePath("/admin/partenaires");
}
