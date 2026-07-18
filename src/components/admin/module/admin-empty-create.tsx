import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";

type AdminEmptyCreateProps = {
  title: string;
  description: string;
  createHref: string;
  createLabel: string;
};

export function AdminEmptyCreate({
  title,
  description,
  createHref,
  createLabel,
}: AdminEmptyCreateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={
        <Link
          className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white"
          href={createHref}
        >
          {createLabel}
        </Link>
      }
    />
  );
}
