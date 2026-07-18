import fs from "node:fs";

const map = {
  "src/components/public/opportunites/application-wizard.tsx": [
    "checkboxClassName",
    "errorClassName",
    "fieldClassName",
    "fileClassName",
    "submitClassName",
    "textareaClassName",
  ],
  "src/components/public/opportunites/opportunity-filters.tsx": [
    "filterFieldClassName",
  ],
  "src/components/public/documents/document-filters.tsx": [
    "filterFieldClassName",
  ],
  "src/components/newsletter/newsletter-popup-form.tsx": [
    "checkboxClassName",
    "errorClassName",
    "fieldClassName",
    "labelClassName",
    "submitClassName",
  ],
  "src/components/auth/forgot-password-form.tsx": [
    "errorClassName",
    "fieldClassName",
    "labelClassName",
    "submitClassName",
  ],
  "src/components/auth/reset-password-form.tsx": [
    "errorClassName",
    "fieldClassName",
    "labelClassName",
    "submitClassName",
  ],
};

for (const [file, names] of Object.entries(map)) {
  let src = fs.readFileSync(file, "utf8");
  const importRe =
    /import \{\n(?:  [A-Za-z]+,\n)+\} from "@\/components\/ui\/form-styles";\n\n/;
  const nextImport = `import {\n${names.map((n) => `  ${n},`).join("\n")}\n} from "@/components/ui/form-styles";\n\n`;
  if (importRe.test(src)) {
    src = src.replace(importRe, nextImport);
  }
  src = src.replace(
    /const inputClassName =\n  "min-h-12 w-full rounded-lg border border-slate-200[^"]+";\n\n/,
    "",
  );
  src = src.split("inputClassName").join("fieldClassName");
  fs.writeFileSync(file, src);
  console.log("cleaned", file);
}
