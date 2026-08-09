-- Insertion publique des adhésions via RPC (compatible clés publishable / anon).
create or replace function public.submit_membership_request(
  p_full_name text,
  p_email text,
  p_phone text,
  p_address text,
  p_gender text,
  p_motivation text,
  p_member_type text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if length(trim(coalesce(p_full_name, ''))) < 2 then
    raise exception 'full_name invalide';
  end if;
  if position('@' in coalesce(p_email, '')) = 0 then
    raise exception 'email invalide';
  end if;
  if length(trim(coalesce(p_motivation, ''))) < 20 then
    raise exception 'motivation invalide';
  end if;

  insert into public.membres (
    full_name, email, phone, address, gender, motivation, member_type, status
  ) values (
    trim(p_full_name),
    lower(trim(p_email)),
    trim(p_phone),
    trim(p_address),
    trim(p_gender),
    trim(p_motivation),
    nullif(trim(coalesce(p_member_type, '')), ''),
    'pending'
  )
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.submit_membership_request(text, text, text, text, text, text, text) from public;
grant execute on function public.submit_membership_request(text, text, text, text, text, text, text)
  to anon, authenticated, service_role;

comment on function public.submit_membership_request is
  'Enregistre une demande d''adhésion depuis le site public.';
