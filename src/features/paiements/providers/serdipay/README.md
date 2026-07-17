# Intégration SerdiPay — Plateforme-ADF

## État

**Non configuré.** Aucun endpoint, signature ou confirmation de paiement n’a été inventé.

## Règles de sécurité

- Secrets uniquement côté serveur (`SERDIPAY_*`, jamais `NEXT_PUBLIC_`).
- Le frontend ne peut pas forcer `confirmed` / `refunded`.
- Aucun code PIN Mobile Money n’est collecté.
- Une transaction n’est `confirmed` qu’après vérification serveur (webhook + contrôles montant/devise/référence).

## TODO — informations à obtenir auprès de SerdiPay

Voir `docs/SERDIPAY_INTEGRATION_REQUIREMENTS.md`.

## Fichiers

- `config.ts` — lecture env serveur
- `client.ts` — client HTTP (placeholder)
- `mapper.ts` — normalisation des statuts (sans confirmation inventée)
- `types.ts` — types minimaux
- `index.ts` — implémentation `PaymentProvider`
