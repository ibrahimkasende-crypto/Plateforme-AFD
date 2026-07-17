"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function PublicSearchField({
  placeholder,
  defaultValue = "",
  action,
  className,
}: {
  placeholder: string;
  defaultValue?: string;
  action: string;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    params.delete("page");

    const qs = params.toString();
    router.push(qs ? `${action}?${qs}` : action);
  }

  return (
    <form
      onSubmit={handleSubmit}
      action={action}
      method="get"
      className={className}
      role="search"
    >
      <label htmlFor="public-search" className="sr-only">
        Rechercher
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[var(--afd-muted)]"
          aria-hidden
        />
        <input
          id="public-search"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] bg-[var(--afd-background)] py-2 pl-10 pr-4 text-base text-[var(--afd-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
        />
      </div>
    </form>
  );
}
