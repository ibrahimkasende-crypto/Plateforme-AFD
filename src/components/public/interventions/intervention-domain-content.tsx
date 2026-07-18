import Link from "next/link";
import type { InterventionDomain } from "@/config/intervention-domains";

export function InterventionDomainContent({
  domain,
  showProgrammesLink = true,
}: {
  domain: InterventionDomain;
  showProgrammesLink?: boolean;
}) {
  return (
    <div className="space-y-5 border-t border-[var(--afd-blue)]/15 pt-5 text-[15px] leading-[1.75] text-[#5F6F83] sm:text-base">
      <section className="max-w-[65ch]">
        <h4 className="font-heading text-[15px] font-bold text-[#062653] sm:text-[16px]">
          Enjeu
        </h4>
        <p className="mt-2">{domain.challenge}</p>
      </section>

      <section className="max-w-[65ch]">
        <h4 className="font-heading text-[15px] font-bold text-[#062653] sm:text-[16px]">
          Notre réponse
        </h4>
        <p className="mt-2">{domain.response}</p>
      </section>

      <section>
        <h4 className="font-heading text-[15px] font-bold text-[#062653] sm:text-[16px]">
          Actions prioritaires
        </h4>
        <ul className="mt-2 max-w-[65ch] list-disc space-y-2 pl-5">
          {domain.priorityActions.slice(0, 5).map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </section>

      <section className="max-w-[65ch]">
        <h4 className="font-heading text-[15px] font-bold text-[#062653] sm:text-[16px]">
          Personnes concernées
        </h4>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          {domain.audiences.map((audience) => (
            <li key={audience}>{audience}</li>
          ))}
        </ul>
      </section>

      {domain.expectedResults.length > 0 ? (
        <section className="max-w-[65ch]">
          <h4 className="font-heading text-[15px] font-bold text-[#062653] sm:text-[16px]">
            Résultats recherchés
          </h4>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            {domain.expectedResults.map((result) => (
              <li key={result}>{result}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {showProgrammesLink ? (
        <p className="pt-1">
          <Link
            href="/actions/programmes"
            className="inline-flex min-h-11 items-center text-sm font-bold text-[var(--afd-blue)] underline-offset-4 hover:underline"
          >
            Voir les programmes associés
          </Link>
        </p>
      ) : null}
    </div>
  );
}
