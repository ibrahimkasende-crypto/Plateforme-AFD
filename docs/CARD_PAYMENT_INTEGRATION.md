# Paiement carte Visa/Mastercard — exigences d’intégration AFD

Document à compléter avec le prestataire **propre à l’AFD** avant toute activation.

## Périmètre

- **Actif aujourd’hui :** virement bancaire Equity BCDC (USD / CDF).
- **Prévu (désactivé) :** carte Visa/Mastercard via une abstraction générique
  `src/lib/payments/providers/card/`.
- **Hors périmètre :** SerdiPay (projet Campus Food). Aucun code, secret, contrat,
  webhook ou variable SerdiPay ne doit être importé dans Plateforme-AFD.

## Prestataire envisagé pour étude

Equity BCDC **Eazzy e-Commerce** / **CyberSource** — à confirmer par contrat marchand AFD.

## Flag obligatoire

```env
CARD_PAYMENT_ENABLED=false
```

Tant que `CARD_PAYMENT_ENABLED=false` ou que la documentation / credentials AFD manquent :
- aucun appel API réel ;
- bouton carte masqué ou « Bientôt disponible » ;
- webhook / return `/api/payments/webhook/card` et `/api/payments/return/card` refusent l’activation.

## Variables (placeholders — ne pas inventer de valeurs)

```env
CARD_PAYMENT_ENABLED=false
CARD_PAYMENT_PROVIDER_ID=
CARD_PAYMENT_BASE_URL=
CARD_PAYMENT_MERCHANT_ID=
CARD_PAYMENT_API_KEY=
CARD_PAYMENT_API_SECRET=
CARD_PAYMENT_WEBHOOK_SECRET=
CARD_PAYMENT_CALLBACK_URL=
CARD_PAYMENT_RETURN_URL=
CARD_PAYMENT_DEFAULT_CURRENCY=USD
```

## Checklist avant activation

1. Contrat marchand **AFD** signé (pas un autre projet).
2. Identifiants et URLs officiels fournis par le prestataire.
3. Documentation webhook / signature / statuts.
4. Mise à jour des routes et du mapper sans inventer d’API.
5. Tests sandbox puis `CARD_PAYMENT_ENABLED=true` uniquement en production contrôlée.

## Confirmation

SerdiPay n’est pas utilisé par Plateforme-AFD et reste indépendant dans le projet Campus Food.
