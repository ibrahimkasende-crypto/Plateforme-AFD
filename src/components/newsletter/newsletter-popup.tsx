"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { NewsletterDialog } from "@/components/ui/newsletter-dialog";
import { NewsletterPopupForm } from "@/components/newsletter/newsletter-popup-form";
import { homeContent } from "@/config/home-content";
import { siteConfig } from "@/config/site";

export function NewsletterPopup({
  open,
  onDismiss,
  onSubscribed,
}: {
  open: boolean;
  onDismiss: () => void;
  onSubscribed: () => void;
}) {
  return (
    <NewsletterDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onDismiss();
      }}
      title={homeContent.newsletter.popupTitle}
      description={homeContent.newsletter.popupDescription}
    >
      <div className="p-5 pt-2 sm:p-6 sm:pt-3">
        <div className="mb-4 flex items-center gap-2.5 pr-2 sm:pr-8">
          <Image
            src={siteConfig.logo.src}
            alt=""
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="font-heading text-base font-extrabold leading-snug text-[var(--afd-navy)] sm:text-lg">
              {homeContent.newsletter.popupTitle}
            </p>
            <p className="mt-0.5 text-[12px] leading-snug text-[var(--afd-muted)]">
              Actualités et actions de l’AFD, sans spam.
            </p>
          </div>
          <Heart
            className="ml-auto hidden size-5 shrink-0 fill-[var(--afd-orange)]/80 text-[var(--afd-orange)] sm:block"
            aria-hidden
          />
        </div>
        <NewsletterPopupForm
          onSuccess={onSubscribed}
          onCancel={onDismiss}
        />
      </div>
    </NewsletterDialog>
  );
}
