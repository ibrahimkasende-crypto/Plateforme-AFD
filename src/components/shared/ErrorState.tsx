import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function ErrorState({
  title = "Une erreur est survenue",
  description,
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-red-900",
        className,
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
        <div>
          <h3 className="font-semibold">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-red-800/80">{description}</p>
          ) : null}
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
