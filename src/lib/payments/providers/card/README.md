# Paiement par carte Visa / Mastercard — Plateforme-AFD

Abstraction générique : `src/lib/payments/providers/card/`

## Périmètre

- **SerdiPay n’est pas utilisé** par Plateforme-AFD (projet Campus Food distinct).
- Provider envisagé pour étude : **Equity BCDC Eazzy e-Commerce / CyberSource**.
- Aucun endpoint, secret ou credential inventé.

## Activation

```env
CARD_PAYMENT_ENABLED=false
```

Tant que `CARD_PAYMENT_ENABLED=false` ou que le contrat marchand AFD n’est pas fourni :
- le bouton carte reste « Bientôt disponible » ;
- `createPayment` / webhook / refund lèvent `CardPaymentNotConfiguredError`.

## Variables serveur (jamais `NEXT_PUBLIC_*`)

À renseigner uniquement avec les identifiants officiels AFD :

- `CARD_PAYMENT_ENABLED`
- `CARD_PAYMENT_PROVIDER_ID` (ex. `eazzy_ecommerce` — à confirmer)
- `CARD_PAYMENT_MERCHANT_ID`
- `CARD_PAYMENT_BASE_URL`
- `CARD_PAYMENT_API_KEY`
- `CARD_PAYMENT_API_SECRET`
- `CARD_PAYMENT_WEBHOOK_SECRET`
- `CARD_PAYMENT_CALLBACK_URL`
- `CARD_PAYMENT_RETURN_URL`
- `CARD_PAYMENT_DEFAULT_CURRENCY`

## Règles

1. Ne jamais confirmer un paiement côté navigateur.
2. Webhook signé + idempotence + contrôle montant/devise avant `confirmed`.
3. Ne pas importer de code ou secrets SerdiPay / Campus Food.
