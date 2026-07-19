-- Colonnes de révision / intégrité complémentaires (non destructif).

alter table public.ocr_champs_extraits
  add column if not exists review_status text not null default 'pending',
  add column if not exists corrected_value text,
  add column if not exists corrected_by uuid references auth.users(id) on delete set null,
  add column if not exists corrected_at timestamptz;

alter table public.document_signatures
  add column if not exists crypto_status text not null default 'verification_unavailable',
  add column if not exists is_digital boolean not null default false;

alter table public.document_provenance
  add column if not exists declared_source text,
  add column if not exists emitter_org text,
  add column if not exists received_at timestamptz,
  add column if not exists responsible_user_id uuid references auth.users(id) on delete set null;

alter table public.imports_donnees_lignes
  add column if not exists source_ocr_field_id uuid references public.ocr_champs_extraits(id) on delete set null,
  add column if not exists previous_payload jsonb not null default '{}'::jsonb;

-- Assouplir module_cible des modèles (valeurs métier élargies)
alter table public.ocr_modeles_extraction drop constraint if exists ocr_modeles_extraction_module_cible_check;
alter table public.ocr_modeles_extraction
  add constraint ocr_modeles_extraction_module_cible_check
  check (module_cible in (
    'finance', 'finances', 'stock', 'stocks', 'logistique', 'activite', 'activites',
    'beneficiaires', 'indicateurs', 'rapports', 'documents', 'autre'
  ));
