"use client";

import { cn } from "@/lib/utils";

export type FormStep = {
  id: string;
  label: string;
};

type AdminFormStepperProps = {
  steps: FormStep[];
  currentStepId: string;
  onStepChange?: (id: string) => void;
  completedIds?: string[];
  errorIds?: string[];
};

export function AdminFormStepper({
  steps,
  currentStepId,
  onStepChange,
  completedIds = [],
  errorIds = [],
}: AdminFormStepperProps) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Étapes du formulaire">
      {steps.map((step, index) => {
        const current = step.id === currentStepId;
        const done = completedIds.includes(step.id);
        const errored = errorIds.includes(step.id);
        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onStepChange?.(step.id)}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition",
                current && "border-[var(--admin-primary)] bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]",
                !current && done && "border-emerald-200 bg-emerald-50 text-emerald-700",
                !current && !done && "border-slate-200 bg-white text-[var(--admin-muted)]",
                errored && "border-red-300 text-red-700",
              )}
              aria-current={current ? "step" : undefined}
            >
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-current/10 text-[10px]">
                {index + 1}
              </span>
              {step.label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
