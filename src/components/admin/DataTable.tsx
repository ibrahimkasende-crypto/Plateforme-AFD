import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "Aucune donnée disponible.",
  className,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--adf-border)] p-6 text-sm text-[var(--adf-muted)]">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-[var(--adf-border)] bg-white",
        className,
      )}
    >
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[var(--adf-surface)] text-[var(--adf-muted)]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-4 py-3 font-medium",
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className="border-t border-[var(--adf-border)]"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn("px-4 py-3 text-[var(--adf-ink)]", column.className)}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
