"use client";

export function AdminTableViewOptions({
  dense = false,
  onDenseChange,
}: {
  dense?: boolean;
  onDenseChange?: (dense: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-xs text-[var(--admin-muted)]">
      <input
        type="checkbox"
        checked={dense}
        onChange={(event) => onDenseChange?.(event.target.checked)}
        className="rounded border"
      />
      Vue compacte
    </label>
  );
}
