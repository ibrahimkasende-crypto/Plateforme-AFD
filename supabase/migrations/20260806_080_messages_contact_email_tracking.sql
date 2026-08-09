-- Suivi d’envoi e-mail pour les messages de contact publics
-- Table : public.messages (dashboard /admin/messages)
-- Crée la table si absente, puis ajoute les colonnes de suivi.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null default '',
  message text not null,
  status text default 'unread',
  created_at timestamptz default now()
);

alter table public.messages
  add column if not exists phone text;

alter table public.messages
  add column if not exists organisation text;

alter table public.messages
  add column if not exists request_type text;

alter table public.messages
  add column if not exists province text;

alter table public.messages
  add column if not exists email_notification_status text;

alter table public.messages
  add column if not exists email_notification_sent_at timestamptz;

alter table public.messages
  add column if not exists email_notification_error text;

alter table public.messages
  add column if not exists notification_recipient text;

alter table public.messages
  add column if not exists notification_attempts integer not null default 0;

alter table public.messages
  add column if not exists auto_reply_status text;

alter table public.messages
  add column if not exists auto_reply_sent_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'messages_email_notification_status_check'
  ) then
    alter table public.messages
      add constraint messages_email_notification_status_check
      check (
        email_notification_status is null
        or email_notification_status in ('pending', 'sent', 'failed', 'retrying')
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'messages_auto_reply_status_check'
  ) then
    alter table public.messages
      add constraint messages_auto_reply_status_check
      check (
        auto_reply_status is null
        or auto_reply_status in ('pending', 'sent', 'failed', 'skipped')
      );
  end if;
end $$;

comment on column public.messages.email_notification_status is
  'Statut SMTP notification AFD : pending | sent | failed | retrying';
comment on column public.messages.notification_recipient is
  'Destinataire de la notification (CONTACT_NOTIFICATION_EMAIL), jamais un secret';

-- Alias logique documenté : contact_messages = public.messages
