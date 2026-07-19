export function WorkflowTimeline({
  steps,
}: {
  steps: Array<{
    label: string;
    state: string;
    at?: string | null;
    actor?: string | null;
  }>;
}) {
  return (
    <ol className="space-y-3 border-l-2 border-slate-200 pl-4">
      {steps.map((step, index) => (
        <li key={`${step.state}-${index}`} className="relative">
          <span className="absolute -left-[1.4rem] top-1 size-2.5 rounded-full bg-[var(--afd-blue)]" />
          <p className="text-sm font-medium text-slate-900">{step.label}</p>
          <p className="text-xs text-slate-500">
            {step.state}
            {step.at ? ` · ${step.at}` : ""}
            {step.actor ? ` · ${step.actor}` : ""}
          </p>
        </li>
      ))}
    </ol>
  );
}
