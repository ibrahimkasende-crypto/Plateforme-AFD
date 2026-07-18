import { revalidatePath, revalidateTag } from "next/cache";
import { DEMO_INTERVENTION_ZONES } from "@/config/demo-data/intervention-zones";

export function getCanonicalCoveredProvinces() {
  return DEMO_INTERVENTION_ZONES.map((zone) => ({
    province: zone.province,
    mainLocality: zone.mainLocality,
    svgId: zone.svgId,
  }));
}

export async function revalidateZonesCache() {
  revalidateTag("zones-intervention", "max");
  revalidatePath("/");
  revalidatePath("/actions/zones-intervention");
}
