"use client";

import { useQuery } from "@tanstack/react-query";

export type OcrDocumentStatusPayload = {
  id: string;
  status: string;
  processing_progress: number;
  ocr_provider: string | null;
  error_message: string | null;
};

async function fetchStatus(id: string): Promise<OcrDocumentStatusPayload | null> {
  const res = await fetch(`/api/ocr/status?id=${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as OcrDocumentStatusPayload;
}

export function useOcrDocumentStatus(documentId: string | null) {
  return useQuery({
    queryKey: ["ocr-document-status", documentId],
    queryFn: () => fetchStatus(documentId!),
    enabled: Boolean(documentId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status) return 4000;
      if (["processing", "queued", "uploaded", "security_check"].includes(status)) {
        return 2500;
      }
      return false;
    },
  });
}
