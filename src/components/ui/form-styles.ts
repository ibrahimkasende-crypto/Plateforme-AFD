import { cn } from "@/lib/utils";

/** Conteneur de formulaire public moderne */
export const formShellClassName =
  "afd-form-shell rounded-2xl border border-[var(--afd-border)]/80 bg-white p-5 shadow-[0_12px_40px_rgba(6,38,83,0.06)] sm:p-7 md:p-8";

export const formClassName = "afd-form space-y-5";

export const labelClassName =
  "afd-form-label mb-1.5 block text-sm font-semibold tracking-tight text-[var(--afd-ink)]";

export const fieldClassName =
  "afd-field min-h-[50px] w-full rounded-xl border border-[var(--afd-border)] bg-[#f7fbff] px-3.5 text-base text-[var(--afd-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition duration-200 placeholder:text-[var(--afd-muted)]/70 hover:border-[var(--afd-blue)]/35 focus-visible:border-[var(--afd-blue)] focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]/25";

export const textareaClassName = cn(
  fieldClassName,
  "min-h-32 resize-y py-3 leading-relaxed",
);

export const selectClassName = cn(fieldClassName, "appearance-none pr-10");

export const checkboxClassName =
  "afd-checkbox mt-0.5 size-5 shrink-0 rounded-md border-[var(--afd-border)] text-[var(--afd-blue)] accent-[var(--afd-blue)] focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]/30";

export const errorClassName = "afd-field-error mt-1.5 text-sm text-[var(--afd-error)]";

export const hintClassName = "mt-1 text-xs text-[var(--afd-muted)]";

export const submitClassName =
  "afd-btn-submit inline-flex min-h-[50px] w-full items-center justify-center rounded-xl bg-[var(--afd-orange)] px-6 text-base font-bold text-white shadow-[0_8px_20px_rgba(233,147,8,0.28)] transition duration-200 hover:bg-[var(--afd-orange-hover)] hover:shadow-[0_10px_24px_rgba(233,147,8,0.36)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto";

export const submitSecondaryClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--afd-border)] bg-white px-5 text-sm font-semibold text-[var(--afd-navy)] transition hover:border-[var(--afd-blue)]/30 hover:bg-[#f7fbff]";

export const fileClassName =
  "mt-1.5 block w-full cursor-pointer rounded-xl border border-dashed border-[var(--afd-border)] bg-[#f7fbff] px-3.5 py-3 text-sm text-[var(--afd-muted)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--afd-blue)] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:border-[var(--afd-blue)]/40";

export const filterFieldClassName =
  "min-h-10 w-full rounded-xl border border-[var(--afd-border)] bg-white px-3 text-sm text-[var(--afd-ink)] transition focus-visible:border-[var(--afd-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]/25";
