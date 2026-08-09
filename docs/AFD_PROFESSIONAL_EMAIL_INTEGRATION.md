# Messagerie professionnelle AFD — intégration Phase 1

## Fournisseur détecté

- **Panneau** : CyberPanel — `https://panel.afd-rdc.org:8090`
- **Route interne observée** : `/email/listEmails` (gestion des comptes, **pas** le webmail utilisateur)
- **Domaine** : `afd-rdc.org`

## Méthode retenue (Phase 1)

1. Association dashboard ↔ adresse professionnelle via table `user_mailboxes`
2. Ouverture du **webmail** dans un nouvel onglet (`MAIL_WEBMAIL_URL`) — l’utilisateur s’authentifie lui-même
3. **Aucune iframe** CyberPanel
4. **Aucun** identifiant administrateur CyberPanel dans le frontend
5. Liens admin vers CyberPanel (nouvel onglet) pour créer / lister les boîtes

La messagerie IMAP/SMTP intégrée (Phase 2) est **préparée** (`src/lib/mail/*`, routes `/api/mail/*`) mais **désactivée** tant que `MAIL_INTEGRATED_ENABLED=true` n’est pas validé.

## Paramètres IMAP / SMTP (à confirmer sur le serveur)

| Variable | Valeur typique CyberPanel |
|----------|---------------------------|
| `MAIL_IMAP_HOST` | `mail.afd-rdc.org` ou hostname serveur |
| `MAIL_IMAP_PORT` | `993` |
| `MAIL_IMAP_SECURE` | `true` |
| `MAIL_SMTP_HOST` | même hôte |
| `MAIL_SMTP_PORT` | `587` (STARTTLS) ou `465` |
| `MAIL_SMTP_SECURE` | `false` pour 587, `true` pour 465 |
| `MAIL_WEBMAIL_URL` | URL Rainloop / SnappyMail / Roundcube du serveur |

## URL webmail

Configurer `MAIL_WEBMAIL_URL` (serveur uniquement). Exemple courant CyberPanel : webmail sur le même hôte ou sous-domaine dédié. À valider auprès de l’hébergeur.

## Comptes associés

Gérés dans `/admin/messagerie/comptes` (rôles : `super_admin`, `admin_principal_it`, `platform_owner`).

Chaque utilisateur voit sa boîte sur `/admin/messagerie`.

## Sécurité

- Secrets CyberPanel : `CYBERPANEL_API_*` serveur seulement
- Pas de mot de passe email en clair en base
- Pas de `localStorage` pour les mots de passe
- RLS : chaque utilisateur lit uniquement sa ligne `user_mailboxes`
- Routes `/api/mail/*` : session + boîte propriétaire ; 501 si phase 2 off
- Sanitisation HTML prête (`sanitize-html.ts`) pour la phase 2

## Fonctionnalités opérationnelles (Phase 1)

- Affichage adresse + statut
- Bouton « Ouvrir ma messagerie professionnelle »
- Demande de réinitialisation mot de passe email (ticket interne)
- Badge header Messagerie (compteur si `imap_enabled` + `unread_count`)
- Admin : associer / activer / suspendre / liens CyberPanel

## Limites

- Pas de lecture IMAP dans le dashboard tant que phase 2 non validée
- Compteur non lus = cache DB (`unread_count`), pas de poll chaque seconde
- API CyberPanel non appelée automatiquement (validation prod requise)
- `/email/listEmails` n’est **pas** intégré en iframe

## Variables nécessaires

Voir `.env.example` section Messagerie professionnelle + CyberPanel.

## Tests

- E2E : `tests/e2e/afd-professional-messagerie.spec.ts`
- Unitaire sanitisation : `tests/unit/mail-sanitize-html.test.ts`

## Prochaine étape (Phase 2)

1. Confirmer IMAP/SMTP avec un compte test
2. Stocker les secrets boîte de façon chiffrée (vault), jamais en clair
3. Passer `MAIL_INTEGRATED_ENABLED=true`
4. Brancher `imap-client` / `smtp-client` et UI dossiers / lecture / envoi
