import { PublicFooter } from "@/components/public/PublicFooter";
import { SiteHeader } from "@/components/public/site-header";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
