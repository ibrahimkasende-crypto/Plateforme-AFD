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
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-[var(--afd-dark-navy)]/55 data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-[90] max-h-[min(92vh,840px)] w-[min(820px,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[20px] border border-[var(--afd-border)] bg-white shadow-[0_24px_60px_rgba(3,27,60,0.28)] focus:outline-none",
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
            className="absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-[var(--afd-border)] bg-white text-[var(--afd-navy)] transition hover:bg-[var(--afd-light-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
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
