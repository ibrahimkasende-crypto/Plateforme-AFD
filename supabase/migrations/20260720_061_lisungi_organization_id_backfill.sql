-- Rattachement progressif organization_id aux tables métier principales.
-- Convention canonique : organization_id (uuid → organizations.id)
-- Non destructif : nullable → backfill AFD → index → NOT NULL lorsque sûr.

-- UUID AFD stable
-- a0000000-0000-4000-8000-000000000afd

do $$
declare
  t text;
  tables text[] := array[
    'programmes',
    'projets',
    'activites',
    'actualites',
    'partenaires',
    'messages_contact',
    'adhesions',
    'dons',
    'abonnes_newsletter',
    'temoignages',
    'histoires_impact',
    'chiffres_impact',
    'zones_intervention',
    'domaines_intervention',
    'beneficiaires_agregats',
    'urgences',
    'finances_budgets',
    'finances_depenses',
    'rapports_generes',
    'documents_importes',
    'enquetes',
    'agents_terrain',
    'stock_articles',
    'stock_mouvements',
    'logistique_demandes',
    'logistique_missions',
    'newsletter_campagnes',
    'partenariats_demandes',
    'appels_offres',
    'pages'
  ];
begin
  foreach t in array tables
  loop
    if to_regclass('public.' || t) is null then
      continue;
    end if;

    -- Si organisation_id (texte) existe déjà (ex. OCR), ne pas dupliquer en uuid
    -- sauf si organization_id uuid est absent.
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = t and column_name = 'organization_id'
    ) then
      -- déjà présent
      null;
    elsif exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = t and column_name = 'tenant_id'
    ) then
      -- alias existant : ne pas ajouter une 2e colonne
      null;
    else
      execute format(
        'alter table public.%I add column if not exists organization_id uuid references public.organizations(id)',
        t
      );
    end if;

    -- Backfill vers AFD
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = t and column_name = 'organization_id'
    ) then
      execute format(
        'update public.%I set organization_id = %L::uuid where organization_id is null',
        t,
        'a0000000-0000-4000-8000-000000000afd'
      );
      execute format(
        'create index if not exists %I on public.%I (organization_id)',
        t || '_organization_id_idx',
        t
      );
    end if;
  end loop;
end $$;

-- documents_importes : aligner organisation_id texte → organization_id uuid si besoin
do $$
begin
  if to_regclass('public.documents_importes') is null then
    return;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'documents_importes'
      and column_name = 'organisation_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'documents_importes'
      and column_name = 'organization_id'
  ) then
    alter table public.documents_importes
      add column organization_id uuid references public.organizations(id);
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'documents_importes'
      and column_name = 'organization_id'
  ) then
    update public.documents_importes
    set organization_id = 'a0000000-0000-4000-8000-000000000afd'
    where organization_id is null;
  end if;
end $$;

-- Préparation politiques RLS exemples (activées progressivement, non bloquantes si membership vide)
-- Les politiques existantes restent prioritaires ; celles-ci renforcent le filtre org quand memberships existent.

-- Fin : colonnes organization_id ajoutées / backfillées lorsque les tables existent.
-- Les contraintes NOT NULL seront appliquées dans une migration ultérieure après vérification.
