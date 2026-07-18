"use client";

import { Presentation } from "lucide-react";
import { ADMIN_DEMO_NOTICE } from "@/config/demo-data/admin-dashboard";

export function PresentationModeBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md bg-[#e8f1fb] px-2 py-1 text-[11px] font-semibold text-[#062653]"
      title={ADMIN_DEMO_NOTICE}
    >
      <Presentation className="size-3.5 shrink-0" aria-hidden />
      Mode présentation
      <span className="sr-only">. {ADMIN_DEMO_NOTICE}</span>
    </span>
  );
}
