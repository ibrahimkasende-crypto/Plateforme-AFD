import { type ReactNode } from 'react';
import { Info } from 'lucide-react';
import { Card, EmptyState } from '../ui';

export function StatCard({ title, value, icon, href, note }: { title: string; value: number | null; icon: ReactNode; href?: string; note?: string }) {
  const content = <Card className="h-full p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-brand-muted">{title}</p><p className="mt-3 text-3xl font-bold text-brand-deep">{value === null ? '—' : value.toLocaleString('fr-FR')}</p>{note && <p className="mt-2 text-xs text-brand-muted">{note}</p>}</div><span className="rounded-xl bg-brand-sand p-3 text-brand-emerald">{icon}</span></div></Card>;
  return href ? <a href={href} className="block transition hover:-translate-y-0.5 hover:shadow-lg">{content}</a> : content;
}

export function ChartCard({ title, description, data }: { title: string; description: string; data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map((item) => item.value), 0);
  return <Card className="p-6"><div className="flex items-start gap-2"><div><h2 className="font-bold text-brand-ink">{title}</h2><p className="mt-1 text-sm text-brand-muted">{description}</p></div><Info className="ml-auto h-4 w-4 text-brand-muted" aria-label="Données calculées à partir des contenus accessibles" /></div>{data.length && max > 0 ? <><div className="mt-6 space-y-4" role="img" aria-label={`${title} : ${data.map((item) => `${item.label} ${item.value}`).join(', ')}`}>{data.map((item) => <div key={item.label}><div className="flex justify-between gap-3 text-sm"><span className="truncate text-brand-muted">{item.label}</span><strong className="text-brand-ink">{item.value}</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-sand"><div className="h-full rounded-full bg-brand-emerald" style={{ width: `${(item.value / max) * 100}%` }} /></div></div>)}</div><table className="sr-only"><caption>{title}</caption><tbody>{data.map((item) => <tr key={item.label}><th>{item.label}</th><td>{item.value}</td></tr>)}</tbody></table></> : <div className="mt-6"><EmptyState title="Aucune donnée disponible" description="Ce graphique apparaîtra lorsque des données réelles seront enregistrées." /></div>}</Card>;
}

export function DataQualityWarning({ message }: { message: string }) {
  return <div role="status" className="rounded-xl border border-brand-gold/40 bg-brand-sand p-4 text-sm text-brand-ink">{message}</div>;
}
