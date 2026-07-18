"use client";

import { useState } from "react";
import { slugify } from "@/lib/slugify";

export function SlugField({
  name = "slug",
  titleName = "title",
  defaultValue = "",
}: {
  name?: string;
  titleName?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium">Slug</span>
      <input
        name={name}
        value={value}
        onChange={(event) => setValue(slugify(event.target.value))}
        onFocus={(event) => {
          if (value) return;
          const form = event.currentTarget.form;
          if (!form) return;
          const titleEl = form.querySelector<HTMLInputElement>(
            `[name="${titleName}"]`,
          );
          if (titleEl?.value) {
            setValue(slugify(titleEl.value));
          }
        }}
        className="w-full rounded-md border px-3 py-2"
        pattern="[a-z0-9\\-]+"
      />
    </label>
  );
}
