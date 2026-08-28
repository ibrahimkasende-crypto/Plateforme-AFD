# Intégrations externes — Plateforme-AFD

## Newsletter (email)

**Statut :** `bloque_integration_externe`

### Interface / workflow
- Campagnes, modèles, abonnés, segments : UI admin existante
- File d’envoi : table `background_jobs` type `newsletter.send`

### Variables requises
```
EMAIL_PROVIDER=resend|sendgrid|smtp
EMAIL_API_KEY=
EMAIL_FROM=
EMAIL_REPLY_TO=
```

### Comportement sans config
- Création / aperçu OK
- Envoi réel **bloqué** avec message « Configuration requise »
- Aucun mock en production

---

## Paiement carte Visa/Mastercard (dons)

**Statut :** architecture préparée, **non activée** (`CARD_PAYMENT_ENABLED=false`)

Provider envisagé pour étude : Equity BCDC Eazzy e-Commerce / CyberSource (contrat marchand **AFD** requis).

**Hors périmètre :** SerdiPay (Campus Food) — aucun code, secret ni configuration partagé.

### Variables (placeholders)
```
CARD_PAYMENT_ENABLED=false
CARD_PAYMENT_PROVIDER_ID=
CARD_PAYMENT_BASE_URL=
CARD_PAYMENT_MERCHANT_ID=
CARD_PAYMENT_API_KEY=
CARD_PAYMENT_API_SECRET=
CARD_PAYMENT_WEBHOOK_SECRET=
```

### Règles
- Pas d’endpoint inventé
- Pas de confirmation de paiement simulée
- Abstraction : `src/lib/payments/providers/card/`
- Voir `docs/CARD_PAYMENT_INTEGRATION.md`

---

## OCR cloud

**Statut :** `bloque_integration_externe` (si provider cloud choisi)

### Variables
```
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=
AZURE_DOCUMENT_INTELLIGENCE_KEY=
GOOGLE_DOCUMENT_AI_PROJECT_ID=
AWS_TEXTRACT_REGION=
```

### Fallback
- Provider `native` / Tesseract local pour démo limitée
- Application métier uniquement après validation humaine

