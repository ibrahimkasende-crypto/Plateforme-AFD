# Rapport — Intégration virement bancaire AFD (dons)

Date : 2026-08-28

## Audit préalable

- Page publique : `/soutenir` (formulaire d’intention SerdiPay stub)
- Table : `dons` (pas `donations`)
- SerdiPay : provider stub conservé (`payment_method: serdipay`)
- Admin : `/admin/dons` (confirm/refund basiques)
- Pas de virement, preuve, reçu ni bucket dons

## Ajouts

### Migrations
- `supabase/migrations/20260828_100_dons_bank_transfer.sql`
  - colonnes additives sur `dons`
  - `dons_coordonnees_bancaires`, `dons_preuves`, `dons_status_history`
  - `next_don_reference()`
  - bucket privé `dons-preuves`
  - RLS

### Flux public
- Choix : Virement | SerdiPay (conservé)
- Devise USD/CDF → montant → identité → coordonnées (depuis Supabase) → preuve → confirmation sans « paiement réussi »

### Admin
- Filtres Tous / En attente / Preuves / Confirmés / Rejetés
- Détail `/admin/dons/[id]` + actions Confirmer / Rejeter + historique + preuve signée
- Reçu `/admin/dons/[id]/recu` après `verified`
- Paramètres `/admin/parametres/dons-paiements` (`dons:bank_settings`)

### Sécurité
- Preuves non publiques (Storage privé + signed URL admin)
- Modification comptes réservée Super Admin / Admin IT / `dons:bank_settings`
- Audit trail sur verify/reject/update bank coords
