# Exigences d’intégration SerdiPay

Document à transmettre / compléter avec SerdiPay avant toute activation des paiements sur Plateforme-ADF.

## Informations à demander

1. Documentation officielle de l’API
2. URL sandbox
3. URL production
4. Identifiant marchand
5. Clé API
6. Secret API
7. Méthode d’authentification (header, HMAC, OAuth, autre)
8. Format des requêtes (JSON, champs obligatoires)
9. Méthodes de paiement acceptées (Mobile Money, carte, etc.)
10. Devises supportées
11. Grille des frais
12. Endpoint de création de paiement
13. Endpoint de vérification de statut
14. Format du webhook (payload)
15. Signature du webhook (algorithme, header, raw body)
16. Liste officielle des statuts transactionnels
17. Gestion des remboursements (si disponible)
18. Gestion des expirations
19. Règles d’idempotence (header / clé)
20. URL de retour (return URL) et paramètres
21. Environnement de test (comptes, montants)
22. Contacts du support technique

## Règles Plateforme-ADF (non négociables)

- Aucun endpoint inventé
- Aucune confirmation de paiement côté navigateur
- Aucune collecte de code PIN Mobile Money
- Secrets uniquement serveur (`SERDIPAY_*`)
- Statut `confirmed` uniquement après vérification serveur

## Variables préparées (`.env.example`)

```
SERDIPAY_ENVIRONMENT=
SERDIPAY_BASE_URL=
SERDIPAY_MERCHANT_ID=
SERDIPAY_API_KEY=
SERDIPAY_API_SECRET=
SERDIPAY_WEBHOOK_SECRET=
SERDIPAY_CALLBACK_URL=
SERDIPAY_RETURN_URL=
SERDIPAY_DEFAULT_CURRENCY=
```
