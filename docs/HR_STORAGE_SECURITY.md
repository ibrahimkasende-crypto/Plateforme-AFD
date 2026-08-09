# Sécurité stockage RH

## Buckets Supabase (privés)

| Bucket | Usage | Taille max | MIME |
|--------|-------|------------|------|
| `admin-avatars` | Photos profil admin | 5 Mo | jpeg, png, webp |
| `hr-private` | Documents RH, CV, pièces congés | 50 Mo | pdf, images, docx |
| `hr-payslips-private` | Bulletins PDF | 20 Mo | pdf |

Création : migration `20260719_050_identity_hr_payroll.sql`.

## Accès

- Buckets **non publics** — URLs signées uniquement.
- Avatars admin : `uploadAvatarAction` / `getAvatarSignedUrl` (`src/features/identity/actions/avatar.ts`).
- Documents employé : `hr_documents.storage_path` + permission `hr_documents.download`.

## Chemins recommandés

```
admin-avatars/{userId}/avatar.{ext}
hr-private/{employe_id}/{type}/{uuid}.pdf
hr-payslips-private/{period_id}/{employe_id}.pdf
```

## Intégrité

- Colonne `hash_sha256` sur `hr_documents` (calcul côté upload — à implémenter).
- Pas de lien public permanent ; expiration courte des signed URLs (1 h par défaut avatars).

## RLS Storage

Policies sur `storage.objects` :

- `admin-avatars` : lecture/écriture limitée au propriétaire ou admins autorisés.
- `hr-private` / `hr-payslips-private` : accès selon rôle RH / Finance et lien employé.

## Bonnes pratiques

1. Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` côté client.
2. Valider MIME et taille avant upload (cf. `avatar.ts`).
3. Purger les fichiers lors du offboarding employé.
4. Chiffrer les sauvegardes contenant des buckets RH.

Voir : `docs/HR_RLS_POLICIES.md`.

