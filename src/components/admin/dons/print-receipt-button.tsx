"use client";

export function PrintReceiptButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded border px-3 py-2 text-sm print:hidden"
    >
      Imprimer / PDF
    </button>
  );
}
