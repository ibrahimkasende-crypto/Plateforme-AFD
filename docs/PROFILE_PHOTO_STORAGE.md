# Stockage des photos de profil

## Bucket

- Nom : `admin-avatars`
- Accès : privé par défaut ; URL signée côté serveur

## Contraintes

- Formats : JPEG, PNG, WebP
- Taille max : **5 Mo**
- Affichage : `aspect-square` · `rounded-full` · `object-cover`

## Chemin

`{userId}/processed/avatar.{ext}`

## Code

- Actions : `src/features/identity/actions/avatar.ts`
- UI : `src/components/admin/profile/profile-avatar-uploader.tsx`
- Injection viewer : `require-admin` (`avatarUrl`)

## Affichage

Header, sidebar, mon-profil, fiche utilisateur (onglets), listes.

## Sécurité

Pas d’URL publique permanente pour les avatars internes ; pas d’exposition de clé Service Role côté client.
