"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function NewsletterDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-[var(--afd-dark-navy)]/50" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-[90] max-h-[calc(100dvh-24px)] w-[calc(100vw-24px)] max-w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl border border-[var(--afd-border)] bg-white shadow-[0_18px_48px_rgba(3,27,60,0.22)] focus:outline-none sm:max-h-[min(88dvh,560px)]",
            className,
          )}
          aria-describedby="afd-newsletter-popup-desc"
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Description
            id="afd-newsletter-popup-desc"
            className="sr-only"
          >
            {description}
          </Dialog.Description>
          <Dialog.Close
            className="sticky top-0 float-right z-10 m-2.5 inline-flex size-11 items-center justify-center rounded-full border border-[var(--afd-border)] bg-white text-[var(--afd-navy)] transition hover:bg-[var(--afd-light-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            aria-label="Fermer la newsletter"
          >
            <X className="size-4" aria-hidden />
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
