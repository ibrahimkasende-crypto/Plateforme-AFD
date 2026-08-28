# Rapport — Dons Plateforme-AFD (virement + architecture carte)

Date : 2026-08-28 (mise à jour périmètre)

## Confirmation de périmètre

**SerdiPay n’est pas utilisé par Plateforme-AFD et reste indépendant dans le projet Campus Food.**

Séparation stricte : contrats marchands, providers, credentials, env, API, webhooks,
tables/config et documentation.

## Canaux AFD

| Canal | État |
| --- | --- |
| Virement Equity BCDC USD `00011050233200275289929` | **Actif** |
| Virement Equity BCDC CDF `00011050233200275377520` | **Actif** |
| Carte Visa/Mastercard (`src/lib/payments/providers/card/`) | Architecture seulement — `CARD_PAYMENT_ENABLED=false` |
| Provider envisagé (étude) | Equity BCDC Eazzy e-Commerce / CyberSource |

## Flux public `/soutenir`

1. Choix : **Virement bancaire** | **Carte** (« Bientôt disponible »)
2. Devise USD/CDF → montant → identité → coordonnées officielles → upload preuve → confirmation
3. Aucun « paiement réussi » automatique ; validation admin obligatoire

## Admin

- `/admin/dons`, `/admin/dons/[id]`, reçu `/admin/dons/[id]/recu`
- Paramètres `/admin/parametres/dons-paiements`

## Migrations

- `20260828_100_dons_bank_transfer.sql` — virement, preuves, références, RLS
- `20260828_110_dons_payment_method_afd_scope.sql` — retrait `serdipay` du périmètre DB

## Paiement carte

- Abstraction : `src/lib/payments/providers/card/`
- Routes préparées : `/api/payments/create`, `status`, `webhook/card`, `return/card`
- **Aucun** dossier `serdipay/`, **aucune** variable `SERDIPAY_*`
