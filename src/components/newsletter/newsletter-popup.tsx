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
      <div className="grid md:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-[var(--afd-navy)] p-8 text-white md:flex md:flex-col md:justify-between">
          <div>
            <div className="inline-flex items-center gap-3">
              <Image
                src={siteConfig.logo.src}
                alt=""
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <span className="font-heading text-sm font-bold tracking-wide">
                {siteConfig.shortName}
              </span>
            </div>
            <p className="font-heading mt-8 text-2xl font-extrabold leading-snug">
              {homeContent.newsletter.popupTitle}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {homeContent.newsletter.popupDescription}
            </p>
          </div>
          <Heart
            className="mt-10 size-16 fill-[var(--afd-orange)]/90 text-[var(--afd-orange)] opacity-90"
            aria-hidden
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3 md:hidden">
            <Image
              src={siteConfig.logo.src}
              alt=""
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-heading text-lg font-extrabold text-[var(--afd-navy)]">
                {homeContent.newsletter.popupTitle}
              </p>
            </div>
          </div>
          <p className="mb-5 hidden text-sm text-[var(--afd-muted)] md:block">
            Recevez les informations essentielles de l’AFD, sans spam.
          </p>
          <NewsletterPopupForm onSuccess={onSubscribed} />
        </div>
      </div>
    </NewsletterDialog>
  );
}
