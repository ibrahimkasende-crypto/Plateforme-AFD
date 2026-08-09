# Rapport — Livraison e-mail formulaire Contact

Date : 2026-08-06  
Projet : `D:\Plateforme-AFD\AFD`

## Objectif

Lorsqu’un visiteur envoie un message via `/contact` :

1. enregistrement dans Supabase (`public.messages`) ;
2. apparition dans `/admin/messages` ;
3. notification e-mail SMTP vers `CONTACT_NOTIFICATION_EMAIL` ;
4. conservation du message même si SMTP échoue.

## Implémentation

| Élément | Emplacement |
|---|---|
| Route API | `src/app/api/contact/route.ts` |
| Server Action | `src/features/contact/actions/submit-contact.ts` |
| Flux métier | `src/lib/contact/process-contact-message.ts` |
| SMTP Nodemailer | `src/lib/contact/contact-smtp.ts` |
| Templates | `src/lib/contact/contact-email-templates.ts` |
| Migration colonnes | `supabase/migrations/20260806_080_messages_contact_email_tracking.sql` |
| Script test | `scripts/test-contact-email.ts` → `npm run email:test-contact` |

Table utilisée : **`public.messages`** (déjà branchée au dashboard).  
Pas de table `contact_messages` séparée — colonnes de suivi e-mail ajoutées sur `messages`.

## Variables serveur (Hostinger / `.env.local`)

```
CONTACT_NOTIFICATION_EMAIL=contactafdrdc@gmail.com
CONTACT_FROM_EMAIL=admin@afd-rdc.org
CONTACT_FROM_NAME=Site officiel AFD
CONTACT_AUTO_REPLY_ENABLED=true

MAIL_SMTP_HOST=afd-rdc.org
MAIL_SMTP_PORT=587
MAIL_SMTP_SECURE=false
MAIL_SMTP_USERNAME=admin@afd-rdc.org
MAIL_SMTP_PASSWORD=********
```

`MAIL_SMTP_PASSWORD` ne doit jamais être dans `NEXT_PUBLIC_*`, le frontend, les logs ou Git.

## Ordre des opérations

1. Validation Zod  
2. Anti-spam (honeypot + rate-limit)  
3. Insertion Supabase (`status = unread`)  
4. Notification interne dashboard  
5. Tentative SMTP (Reply-To = e-mail visiteur)  
6. Mise à jour `email_notification_status` (`sent` / `failed`)  
7. Auto-réponse optionnelle si `CONTACT_AUTO_REPLY_ENABLED=true`  
8. Réponse succès au visiteur si l’enregistrement a réussi

## E-mail AFD

- Destinataire : `CONTACT_NOTIFICATION_EMAIL`  
- Expéditeur : `Site officiel AFD <admin@afd-rdc.org>`  
- Reply-To : adresse du visiteur  
- Sujet : `Nouveau message depuis le site AFD — [sujet]`  
- Lien : `https://afd-rdc.org/admin/messages/[id]`  
- Versions HTML + texte

## Correctif RLS

Les inserts publics exigent `status = 'unread'` (politique Supabase).  
L’ancien code utilisait `pending` — corrigé.

## Migration à appliquer

Exécuter sur le projet Supabase :

`supabase/migrations/20260806_080_messages_contact_email_tracking.sql`

Sans cette migration, l’enregistrement minimal reste possible ; le suivi e-mail détaillé peut être incomplet.

## Validation locale

| Commande | Résultat |
|---|---|
| `npm run typecheck` | OK |
| `npm run lint` (fichiers contact) | OK (0 erreur) |
| `npm run test:unit` | OK — 64 passed |
| `npm run build` | OK — route `/api/contact` présente |
| `npm run email:test-contact` | ÉCHEC attendu — variables SMTP absentes en local |

## Actions manuelles restantes

1. Ajouter sur Hostinger (et `.env.local` pour les tests) :
   - `CONTACT_NOTIFICATION_EMAIL=contactafdrdc@gmail.com`
   - `CONTACT_FROM_EMAIL=admin@afd-rdc.org`
   - `CONTACT_FROM_NAME=Site officiel AFD`
   - `CONTACT_AUTO_REPLY_ENABLED=true` (si souhaité)
   - `MAIL_SMTP_HOST=afd-rdc.org`
   - `MAIL_SMTP_PORT=587`
   - `MAIL_SMTP_SECURE=false`
   - `MAIL_SMTP_USERNAME=admin@afd-rdc.org`
   - `MAIL_SMTP_PASSWORD=` *(mot de passe boîte, jamais dans Git)*
2. Appliquer la migration SQL `20260806_080_messages_contact_email_tracking.sql` sur Supabase
   (SQL Editor du dashboard, ou `npx tsx scripts/apply-sql-migration.ts …` si `pg` + `DATABASE_URL` sont disponibles).
3. Déployer le build.
4. Exécuter `npm run email:test-contact` avec les variables renseignées.
5. Envoyer un message depuis https://afd-rdc.org/contact.
6. Vérifier `contactafdrdc@gmail.com` + fiche `/admin/messages/[id]`.

## Secrets

Aucun secret n’est inclus dans ce rapport.
