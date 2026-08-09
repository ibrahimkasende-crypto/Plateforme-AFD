-- Messagerie professionnelle AFD — boîtes associées aux utilisateurs dashboard.
-- Idempotent. Aucun mot de passe stocké en clair.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Colonnes profil
-- ---------------------------------------------------------------------------
alter table public.profils_administrateurs
  add column if not exists professional_email text,
  add column if not exists has_professional_mailbox boolean not null default false,
  add column if not exists email_professionnel text;

-- Aligner professional_email depuis email_professionnel si déjà renseigné
update public.profils_administrateurs
set professional_email = coalesce(professional_email, email_professionnel)
where professional_email is null
  and email_professionnel is not null
  and email_professionnel <> '';

-- ---------------------------------------------------------------------------
-- Table user_mailboxes
-- ---------------------------------------------------------------------------
create table if not exists public.user_mailboxes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profils_administrateurs(id) on delete cascade,
  email_address text not null,
  display_name text,
  mailbox_status text not null default 'active'
    check (mailbox_status in ('pending', 'active', 'suspended', 'disabled', 'error')),
  imap_enabled boolean not null default false,
  smtp_enabled boolean not null default false,
  unread_count integer not null default 0,
  last_sync_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_mailboxes_email_unique unique (email_address),
  constraint user_mailboxes_user_unique unique (user_id)
);

create index if not exists user_mailboxes_status_idx
  on public.user_mailboxes (mailbox_status);

create index if not exists user_mailboxes_email_idx
  on public.user_mailboxes (lower(email_address));

-- Demandes de réinitialisation mot de passe email (sans secret)
create table if not exists public.mailbox_password_reset_requests (
  id uuid primary key default gen_random_uuid(),
  mailbox_id uuid not null references public.user_mailboxes(id) on delete cascade,
  user_id uuid not null references public.profils_administrateurs(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'done', 'cancelled')),
  justification text,
  handled_by uuid references public.profils_administrateurs(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_mailboxes enable row level security;
alter table public.mailbox_password_reset_requests enable row level security;

-- Lecture : propriétaire ou admins IT / super
drop policy if exists "user_mailboxes_select" on public.user_mailboxes;
create policy "user_mailboxes_select"
on public.user_mailboxes for select to authenticated
using (
  user_id = auth.uid()
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
  or public.has_role('admin_principal_it')
);

drop policy if exists "user_mailboxes_insert_admin" on public.user_mailboxes;
create policy "user_mailboxes_insert_admin"
on public.user_mailboxes for insert to authenticated
with check (
  public.has_role('super_admin')
  or public.has_role('platform_owner')
  or public.has_role('admin_principal_it')
);

drop policy if exists "user_mailboxes_update_admin" on public.user_mailboxes;
create policy "user_mailboxes_update_admin"
on public.user_mailboxes for update to authenticated
using (
  public.has_role('super_admin')
  or public.has_role('platform_owner')
  or public.has_role('admin_principal_it')
)
with check (
  public.has_role('super_admin')
  or public.has_role('platform_owner')
  or public.has_role('admin_principal_it')
);

drop policy if exists "mailbox_reset_select" on public.mailbox_password_reset_requests;
create policy "mailbox_reset_select"
on public.mailbox_password_reset_requests for select to authenticated
using (
  user_id = auth.uid()
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
  or public.has_role('admin_principal_it')
);

drop policy if exists "mailbox_reset_insert_own" on public.mailbox_password_reset_requests;
create policy "mailbox_reset_insert_own"
on public.mailbox_password_reset_requests for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "mailbox_reset_update_admin" on public.mailbox_password_reset_requests;
create policy "mailbox_reset_update_admin"
on public.mailbox_password_reset_requests for update to authenticated
using (
  public.has_role('super_admin')
  or public.has_role('platform_owner')
  or public.has_role('admin_principal_it')
);

-- Trigger maj has_professional_mailbox
create or replace function public.sync_professional_mailbox_flag()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    update public.profils_administrateurs
    set has_professional_mailbox = false,
        professional_email = null,
        updated_at = now()
    where id = old.user_id;
    return old;
  end if;

  update public.profils_administrateurs
  set has_professional_mailbox = (new.mailbox_status = 'active'),
      professional_email = new.email_address,
      email_professionnel = coalesce(email_professionnel, new.email_address),
      updated_at = now()
  where id = new.user_id;

  return new;
end;
$$;

drop trigger if exists trg_sync_professional_mailbox_flag on public.user_mailboxes;
create trigger trg_sync_professional_mailbox_flag
after insert or update or delete on public.user_mailboxes
for each row execute function public.sync_professional_mailbox_flag();
