-- Clôturer l’offre Mambasa expirée (plus visible ni candidatable sur le site public).
UPDATE public.opportunites
SET
  statut = 'cloturee',
  publie = false,
  updated_at = now()
WHERE slug = 'chef-de-projet-base-a-mambasa'
  AND deleted_at IS NULL;
