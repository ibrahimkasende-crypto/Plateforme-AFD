"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ModernAdminFormProps = {
  children: ReactNode;
  className?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  action?: string | ((formData: FormData) => void | Promise<void>);
  id?: string;
};

export function ModernAdminForm({
  children,
  className,
  onSubmit,
  action,
  id,
}: ModernAdminFormProps) {
  return (
    <form
      id={id}
      action={action}
      onSubmit={onSubmit}
      className={cn(
        "space-y-5 rounded-2xl bg-[var(--admin-bg,#f4f7fb)]",
        className,
      )}
      noValidate
    >
      {children}
    </form>
  );
}
