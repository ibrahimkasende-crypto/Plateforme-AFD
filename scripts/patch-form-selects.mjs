import fs from "node:fs";

const patches = [
  [
    'className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] bg-[var(--afd-background)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"',
    "className={selectClassName}",
  ],
  [
    'className="min-h-28 w-full rounded-lg border border-[var(--afd-border)] px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"',
    "className={textareaClassName}",
  ],
  [
    'className="min-h-11 w-full rounded-xl border border-[var(--afd-border)] px-3"',
    "className={fieldClassName}",
  ],
  [
    'className="w-full rounded-xl border border-[var(--afd-border)] px-3 py-2"',
    "className={textareaClassName}",
  ],
];

const files = [
  "src/components/public/forms/partnership-form.tsx",
  "src/components/public/forms/support-form.tsx",
  "src/components/public/forms/newsletter-page-form.tsx",
  "src/components/public/opportunites/application-form.tsx",
  "src/components/public/opportunites/application-wizard.tsx",
];

for (const file of files) {
  let src = fs.readFileSync(file, "utf8");
  let n = 0;
  for (const [from, to] of patches) {
    const before = src;
    src = src.split(from).join(to);
    if (src !== before) n += 1;
  }
  fs.writeFileSync(file, src);
  console.log(file, "patches applied groups", n);
}
