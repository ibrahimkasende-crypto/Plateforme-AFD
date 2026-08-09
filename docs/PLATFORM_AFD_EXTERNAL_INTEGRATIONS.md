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

## SerdiPay (dons / paiements)

**Statut :** `bloque_integration_externe`

### Variables requises
```
SERDIPAY_ENVIRONMENT=
SERDIPAY_BASE_URL=
SERDIPAY_MERCHANT_ID=
SERDIPAY_API_KEY=
SERDIPAY_API_SECRET=
SERDIPAY_WEBHOOK_SECRET=
```

### Règles
- Pas d’endpoint inventé
- Pas de confirmation de paiement simulée
- Webhook idempotent prévu dans `src/app/api/payments/`

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

