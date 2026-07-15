import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
};

const buttonVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand-deep text-white hover:bg-brand-emerald',
  secondary: 'bg-brand-gold text-brand-ink hover:bg-[#b88735]',
  outline: 'border border-brand-deep text-brand-deep hover:bg-brand-sand',
  ghost: 'text-brand-deep hover:bg-brand-sand',
  danger: 'bg-brand-error text-white hover:bg-red-800',
};

export function Button({ className, variant = 'primary', loading, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60', buttonVariants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function IconButton({ className, 'aria-label': ariaLabel, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button aria-label={ariaLabel} className={cn('inline-flex h-11 w-11 items-center justify-center rounded-xl text-brand-deep transition-colors hover:bg-brand-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold disabled:pointer-events-none disabled:opacity-60', className)} {...props} />;
}

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props} />;
}

export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn('py-14 sm:py-20 lg:py-24', className)} {...props} />;
}

export function SectionHeader({ eyebrow, title, description, className, inverse = false }: { eyebrow?: string; title: string; description?: string; className?: string; inverse?: boolean }) {
  return <div className={cn('max-w-2xl', className)}>
    {eyebrow && <p className={cn('mb-3 text-sm font-bold uppercase tracking-[0.16em]', inverse ? 'text-brand-gold' : 'text-brand-emerald')}>{eyebrow}</p>}
    <h2 className={cn('text-3xl font-bold tracking-tight sm:text-4xl', inverse ? 'text-white' : 'text-brand-ink')}>{title}</h2>
    {description && <p className={cn('mt-4 text-lg leading-8', inverse ? 'text-white/75' : 'text-brand-muted')}>{description}</p>}
  </div>;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-brand-deep/10 bg-white shadow-[0_12px_36px_rgba(24,32,29,0.07)]', className)} {...props} />;
}

export function Badge({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn('inline-flex rounded-full bg-brand-sand px-3 py-1 text-xs font-bold text-brand-deep', className)}>{children}</span>;
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string };
export function Input({ label, error, id, className, ...props }: FieldProps) {
  return <label className="block text-sm font-semibold text-brand-ink">{label}<input id={id} className={cn('mt-2 block w-full rounded-xl border border-brand-deep/20 bg-white px-4 py-3 text-brand-ink outline-none transition focus:border-brand-emerald focus:ring-2 focus:ring-brand-emerald/25 disabled:bg-brand-sand', error && 'border-brand-error', className)} {...props} />{error && <span className="mt-1 block text-sm text-brand-error">{error}</span>}</label>;
}

export function Textarea({ label, error, id, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return <label className="block text-sm font-semibold text-brand-ink">{label}<textarea id={id} className={cn('mt-2 block w-full rounded-xl border border-brand-deep/20 bg-white px-4 py-3 text-brand-ink outline-none transition focus:border-brand-emerald focus:ring-2 focus:ring-brand-emerald/25 disabled:bg-brand-sand', error && 'border-brand-error', className)} {...props} />{error && <span className="mt-1 block text-sm text-brand-error">{error}</span>}</label>;
}

export function Select({ label, error, id, className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  return <label className="block text-sm font-semibold text-brand-ink">{label}<select id={id} className={cn('mt-2 block w-full rounded-xl border border-brand-deep/20 bg-white px-4 py-3 text-brand-ink outline-none transition focus:border-brand-emerald focus:ring-2 focus:ring-brand-emerald/25 disabled:bg-brand-sand', error && 'border-brand-error', className)} {...props}>{children}</select>{error && <span className="mt-1 block text-sm text-brand-error">{error}</span>}</label>;
}

export function Checkbox({ label, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="flex cursor-pointer items-center gap-3 text-sm text-brand-ink"><input type="checkbox" className={cn('h-5 w-5 rounded border-brand-deep/30 text-brand-deep focus:ring-brand-gold', className)} {...props} />{label}</label>;
}

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[70] grid place-items-center bg-brand-ink/50 p-4"><Card className="w-full max-w-lg p-6"><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-bold text-brand-ink">{title}</h2><IconButton onClick={onClose} aria-label="Fermer">×</IconButton></div><div className="mt-5">{children}</div></Card></div>;
}

export function Drawer({ open, children, onClose }: { open: boolean; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[70] bg-brand-ink/50 lg:hidden" onClick={onClose}><aside className="ml-auto h-full w-[min(22rem,90vw)] overflow-y-auto bg-white p-6" onClick={(event) => event.stopPropagation()}>{children}</aside></div>;
}

export function Dropdown({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-xl border border-brand-deep/10 bg-white p-2 shadow-xl', className)}>{children}</div>;
}

export function Tabs({ tabs, value, onChange }: { tabs: Array<{ value: string; label: string }>; value: string; onChange: (value: string) => void }) {
  return <div role="tablist" className="flex gap-1 rounded-xl bg-brand-sand p-1">{tabs.map((tab) => <button key={tab.value} role="tab" aria-selected={value === tab.value} onClick={() => onChange(tab.value)} className={cn('rounded-lg px-4 py-2 text-sm font-semibold transition', value === tab.value ? 'bg-white text-brand-deep shadow-sm' : 'text-brand-muted hover:text-brand-deep')}>{tab.label}</button>)}</div>;
}

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return <div className="overflow-x-auto rounded-2xl border border-brand-deep/10"><table className={cn('min-w-full text-left text-sm', className)}>{children}</table></div>;
}

export function Pagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (page: number) => void }) {
  return <nav aria-label="Pagination" className="flex items-center gap-3"><Button variant="outline" onClick={() => onChange(page - 1)} disabled={page <= 1}>Précédent</Button><span className="text-sm text-brand-muted">Page {page} sur {pageCount}</span><Button variant="outline" onClick={() => onChange(page + 1)} disabled={page >= pageCount}>Suivant</Button></nav>;
}

export function EmptyState({ title = 'Aucun élément à afficher', description }: { title?: string; description?: string }) {
  return <div className="rounded-2xl border border-dashed border-brand-deep/25 p-10 text-center"><h3 className="font-bold text-brand-ink">{title}</h3>{description && <p className="mt-2 text-sm text-brand-muted">{description}</p>}</div>;
}

export function LoadingState({ label = 'Chargement…' }: { label?: string }) {
  return <div role="status" className="flex min-h-32 items-center justify-center gap-3 text-brand-muted"><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />{label}</div>;
}

export function ErrorState({ title = 'Une erreur est survenue', description, onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return <div role="alert" className="rounded-2xl border border-brand-error/25 bg-red-50 p-6 text-brand-error"><AlertCircle className="mb-3 h-6 w-6" /><h3 className="font-bold">{title}</h3>{description && <p className="mt-1 text-sm">{description}</p>}{onRetry && <Button className="mt-4" variant="danger" onClick={onRetry}>Réessayer</Button>}</div>;
}

export function ConfirmDialog({ open, title, description, onCancel, onConfirm, loading }: { open: boolean; title: string; description: string; onCancel: () => void; onConfirm: () => void; loading?: boolean }) {
  return <Modal open={open} title={title} onClose={onCancel}><p className="text-brand-muted">{description}</p><div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={onCancel}>Annuler</Button><Button variant="danger" onClick={onConfirm} loading={loading}>Confirmer</Button></div></Modal>;
}

export function Toast({ message, tone = 'success', onClose }: { message: string; tone?: 'success' | 'error'; onClose?: () => void }) {
  return <div role="status" className={cn('fixed bottom-5 left-1/2 z-[80] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-4 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-xl', tone === 'success' ? 'bg-brand-success' : 'bg-brand-error')}><span>{message}</span>{onClose && <button onClick={onClose} className="rounded p-1 hover:bg-white/15" aria-label="Fermer la notification">×</button>}</div>;
}
