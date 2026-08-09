import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/shared/EmptyState";
import { isSuperActor } from "@/features/identity/security/privilege-guards";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function HistoriqueAdministrateurPrincipalPage() {
  const session = await requireAdmin();
  if (!isSuperActor(session.roles)) {
    redirect("/acces-refuse");
  }

  const supabase = await createClientSafe();
  const { data } = supabase
    ? await supabase
        .from("admin_principal_history" as never)
        .select(
          "id, action, justification, created_at, user_id, actor_id, previous_user_id",
        )
        .order("created_at" as never, { ascending: false })
        .limit(50)
    : { data: null };

  const items =
    (data as Array<{
      id: string;
      action: string;
      justification: string | null;
      created_at: string;
      user_id: string;
      actor_id: string | null;
      previous_user_id: string | null;
    }> | null) ?? [];

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
      <div>
        <Link
          href="/admin/administrateur-principal"
          className="text-sm text-[var(--admin-primary)]"
        >
          ← Retour
        </Link>
        <h1 className="mt-3 text-2xl font-bold">
          Historique — Administrateur principal
        </h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Aucun événement"
          description="Les créations, suspensions et remplacements apparaîtront ici."
        />
      ) : (
        <ul className="divide-y rounded-2xl border bg-white">
          {items.map((item) => (
            <li key={item.id} className="px-4 py-3 text-sm">
              <p className="font-semibold capitalize">{item.action}</p>
              <p className="text-slate-600">
                {new Date(item.created_at).toLocaleString("fr-FR")}
                {item.justification ? ` — ${item.justification}` : ""}
              </p>
              <p className="mt-1 font-mono text-xs text-slate-400">
                user={item.user_id.slice(0, 8)}…
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
