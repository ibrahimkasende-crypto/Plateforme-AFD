import { InterventionDomainsSection } from "@/components/public/interventions/intervention-domains-section";
import { getPublishedInterventionDomains } from "@/lib/queries/public/intervention-domains";

export async function InterventionPillars() {
  const domains = await getPublishedInterventionDomains();
  return <InterventionDomainsSection domains={domains} />;
}
