import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const files = [
  "src/components/public/forms/membership-form.tsx",
  "src/components/public/forms/partnership-form.tsx",
  "src/components/public/forms/support-form.tsx",
  "src/components/public/forms/newsletter-page-form.tsx",
  "src/components/newsletter/newsletter-popup-form.tsx",
  "src/components/public/opportunites/application-form.tsx",
  "src/components/public/opportunites/application-wizard.tsx",
  "src/components/public/opportunites/opportunity-filters.tsx",
  "src/components/public/documents/document-filters.tsx",
  "src/components/auth/login-form.tsx",
  "src/components/auth/forgot-password-form.tsx",
  "src/components/auth/reset-password-form.tsx",
  "src/components/public/home/newsletter-section.tsx",
];

const importBlock = `import {
  checkboxClassName,
  errorClassName,
  fieldClassName,
  fileClassName,
  filterFieldClassName,
  formClassName,
  formShellClassName,
  labelClassName,
  selectClassName,
  submitClassName,
  textareaClassName,
} from "@/components/ui/form-styles";
`;

const replacements = [
  [
    /className="mb-1 block text-sm font-semibold text-\[var\(--afd-ink\)\]"/g,
    "className={labelClassName}",
  ],
  [
    /className="mb-1 block text-\[12px\] font-semibold text-\[var\(--afd-navy\)\]"/g,
    "className={labelClassName}",
  ],
  [
    /className="min-h-12 w-full rounded-lg border border-\[var\(--afd-border\)\] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-\[var\(--afd-blue\)\]"/g,
    "className={fieldClassName}",
  ],
  [
    /className="min-h-32 w-full rounded-lg border border-\[var\(--afd-border\)\] px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-\[var\(--afd-blue\)\]"/g,
    "className={textareaClassName}",
  ],
  [
    /className="mt-0\.5 size-5 shrink-0 rounded border-\[var\(--afd-border\)\]"/g,
    "className={checkboxClassName}",
  ],
  [
    /className="size-4 shrink-0 rounded border-\[var\(--afd-border\)\]"/g,
    "className={checkboxClassName}",
  ],
  [/className="mt-1 text-sm text-\[var\(--afd-error\)\]"/g, "className={errorClassName}"],
  [/className="mt-1 text-\[13px\] text-\[var\(--afd-error\)\]"/g, "className={errorClassName}"],
  [/className="text-sm text-\[var\(--afd-error\)\]"/g, "className={errorClassName}"],
  [/className="text-\[13px\] text-\[var\(--afd-error\)\]"/g, "className={errorClassName}"],
  [
    /className="inline-flex min-h-12 items-center justify-center rounded-lg bg-\[var\(--afd-orange\)\] px-6 text-base font-bold text-white transition hover:bg-\[var\(--afd-orange-hover\)\] disabled:opacity-60"/g,
    "className={submitClassName}",
  ],
  [
    /className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-\[var\(--afd-orange\)\] px-4 text-base font-bold text-white transition hover:bg-\[var\(--afd-orange-hover\)\] disabled:opacity-60"/g,
    "className={submitClassName}",
  ],
  [
    /className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-\[var\(--afd-orange\)\] px-6 text-base font-bold text-white transition hover:bg-\[var\(--afd-orange-hover\)\] disabled:opacity-60"/g,
    "className={submitClassName}",
  ],
  [/className="rounded-lg border p-3"/g, "className={fieldClassName}"],
  [/className="w-full rounded-lg border p-3"/g, "className={fieldClassName}"],
  [/className="rounded-lg border p-2 text-sm"/g, "className={filterFieldClassName}"],
  [
    /className="flex cursor-pointer items-center gap-3 rounded-lg border border-\[var\(--afd-border\)\] px-3 py-2\.5 text-sm text-\[var\(--afd-ink\)\] transition hover:border-\[var\(--afd-blue\)\]\/40"/g,
    'className="afd-interest-chip"',
  ],
];

for (const rel of files) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    console.log("SKIP missing", rel);
    continue;
  }
  let src = fs.readFileSync(file, "utf8");
  const before = src;
  for (const [re, to] of replacements) src = src.replace(re, to);

  if (!src.includes("@/components/ui/form-styles")) {
    if (src.startsWith('"use client"')) {
      src = src.replace('"use client";\n\n', `"use client";\n\n${importBlock}\n`);
    } else {
      src = `${importBlock}\n${src}`;
    }
  }

  const isMainForm =
    /forms\/(membership|partnership|support|newsletter)/.test(rel) ||
    rel.includes("newsletter-page-form");

  if (isMainForm && !src.includes("formShellClassName")) {
    src = src.replace(
      /return \(\s*<form onSubmit=\{handleSubmit\(onSubmit\)\} className="space-y-4" noValidate>/,
      "return (\n    <div className={formShellClassName}>\n      <form onSubmit={handleSubmit(onSubmit)} className={formClassName} noValidate>",
    );
    src = src.replace(
      /return \(\s*<div className="space-y-6">\s*<form onSubmit=\{handleSubmit\(onSubmit\)\} className="space-y-4" noValidate>/,
      "return (\n    <div className=\"space-y-6\">\n      <div className={formShellClassName}>\n      <form onSubmit={handleSubmit(onSubmit)} className={formClassName} noValidate>",
    );

    // Close shell before component end for simple forms
    if (src.includes("<div className={formShellClassName}>")) {
      const idx = src.lastIndexOf("</form>");
      if (idx !== -1 && !src.slice(idx).includes("</div>\n  );")) {
        src = `${src.slice(0, idx)}</form>\n      </div>${src.slice(idx + "</form>".length)}`;
      }
    }
  }

  if (src !== before) {
    fs.writeFileSync(file, src);
    console.log("OK", rel);
  } else {
    console.log("NOCHANGE", rel);
  }
}
