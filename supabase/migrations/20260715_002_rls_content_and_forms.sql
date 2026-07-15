-- Phase 4 — politiques RLS pour le schéma français existant.
-- À appliquer uniquement après 20260715_001_security_foundations.sql et
-- après validation sur une sauvegarde/restauration de l'instance cible.

alter table programmes enable row level security;
alter table projets enable row level security;
alter table actualites enable row level security;
alter table galerie enable row level security;
alter table parametres_site enable row level security;
alter table membres_equipe enable row level security;
alter table partenaires enable row level security;
alter table clusters enable row level security;
alter table membres enable row level security;
alter table dons enable row level security;
alter table messages enable row level security;
alter table administrateurs enable row level security;

-- Lecture publique limitée aux contenus publiés/actifs.
drop policy if exists "Public programmes" on programmes;
create policy "Public programmes actifs"
on programmes for select to anon, authenticated using (active = true);
create policy "Admins lisent tous les programmes"
on programmes for select to authenticated using (public.is_active_admin());
create policy "Admins gèrent les programmes"
on programmes for all to authenticated
using (public.has_permission('programmes_gerer'))
with check (public.has_permission('programmes_gerer'));

drop policy if exists "Public projets" on projets;
create policy "Public projets actifs"
on projets for select to anon, authenticated using (active = true);
create policy "Admins lisent tous les projets"
on projets for select to authenticated using (public.is_active_admin());
create policy "Admins gèrent les projets"
on projets for all to authenticated
using (public.has_permission('projets_gerer'))
with check (public.has_permission('projets_gerer'));

drop policy if exists "Public actualites" on actualites;
create policy "Public actualites publiees"
on actualites for select to anon, authenticated using (published = true);
create policy "Admins lisent toutes les actualites"
on actualites for select to authenticated using (public.is_active_admin());
create policy "Admins gèrent les actualites"
on actualites for all to authenticated
using (public.has_permission('actualites_gerer'))
with check (public.has_permission('actualites_gerer'));

drop policy if exists "Public galerie" on galerie;
create policy "Public galerie active"
on galerie for select to anon, authenticated using (active = true);
create policy "Admins lisent toute la galerie"
on galerie for select to authenticated using (public.is_active_admin());
create policy "Admins gèrent la galerie"
on galerie for all to authenticated
using (public.has_permission('medias_gerer'))
with check (public.has_permission('medias_gerer'));

drop policy if exists "Public membres_equipe" on membres_equipe;
create policy "Public equipe active"
on membres_equipe for select to anon, authenticated using (active = true);
create policy "Admins lisent toute equipe"
on membres_equipe for select to authenticated using (public.is_active_admin());
create policy "Admins gèrent equipe"
on membres_equipe for all to authenticated
using (public.has_permission('equipe_gerer'))
with check (public.has_permission('equipe_gerer'));

drop policy if exists "Public partenaires" on partenaires;
create policy "Public partenaires actifs"
on partenaires for select to anon, authenticated using (active = true);
create policy "Admins lisent tous les partenaires"
on partenaires for select to authenticated using (public.is_active_admin());
create policy "Admins gèrent partenaires"
on partenaires for all to authenticated
using (public.has_permission('partenaires_gerer'))
with check (public.has_permission('partenaires_gerer'));

drop policy if exists "Public clusters" on clusters;
create policy "Public clusters actifs"
on clusters for select to anon, authenticated using (active = true);
create policy "Admins lisent tous les clusters"
on clusters for select to authenticated using (public.is_active_admin());
create policy "Admins gèrent clusters"
on clusters for all to authenticated
using (public.has_permission('contenus_modifier'))
with check (public.has_permission('contenus_modifier'));

drop policy if exists "Public parametres_site" on parametres_site;
create policy "Public paramètres sans données sensibles"
on parametres_site for select to anon, authenticated
using (key in ('founded_year', 'experience_years', 'active_projects', 'provinces_count', 'beneficiaries', 'address'));
create policy "Admins lisent paramètres"
on parametres_site for select to authenticated using (public.is_active_admin());
create policy "Admins gèrent paramètres"
on parametres_site for all to authenticated
using (public.has_permission('parametres_gerer'))
with check (public.has_permission('parametres_gerer'));

-- Formulaires publics : insertion minimale, sans lecture, modification ni
-- statut arbitraire. Les Edge Functions doivent remplacer ces insertions
-- directes avant la mise en production avec anti-spam/CAPTCHA.
drop policy if exists "Insert membres" on membres;
create policy "Soumission publique adhésion limitée"
on membres for insert to anon, authenticated
with check (
  status = 'pending'
  and char_length(email) between 5 and 254
  and char_length(motivation) <= 5000
);
create policy "Admins lisent adhésions"
on membres for select to authenticated using (public.has_permission('adhesions_gerer'));
create policy "Admins gèrent adhésions"
on membres for update to authenticated
using (public.has_permission('adhesions_gerer'))
with check (public.has_permission('adhesions_gerer'));

drop policy if exists "Insert dons" on dons;
create policy "Soumission publique intention de don limitée"
on dons for insert to anon, authenticated
with check (
  status = 'pending'
  and amount > 0
  and currency in ('USD', 'CDF')
  and char_length(email) between 5 and 254
);
create policy "Admins lisent intentions de don"
on dons for select to authenticated using (public.has_permission('dons_consulter'));

drop policy if exists "Insert messages" on messages;
create policy "Soumission publique message limitée"
on messages for insert to anon, authenticated
with check (
  status = 'unread'
  and char_length(name) between 1 and 200
  and char_length(email) between 5 and 254
  and char_length(message) between 1 and 5000
);
create policy "Admins lisent messages"
on messages for select to authenticated using (public.has_permission('messages_consulter'));
create policy "Admins traitent messages"
on messages for update to authenticated
using (public.has_permission('messages_consulter'))
with check (public.has_permission('messages_consulter'));

-- L'ancienne table reste uniquement compatible avec l'authentification
-- actuelle. Aucune écriture directe côté client n'est autorisée.
drop policy if exists "Self admin view" on administrateurs;
drop policy if exists "Un admin ne peut voir que son propre profil" on administrateurs;
create policy "Admin lit son ancien profil"
on administrateurs for select to authenticated using (id = auth.uid());
