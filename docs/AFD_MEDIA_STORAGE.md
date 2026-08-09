# Médias AFD — Storage Supabase

## Objectif

Ne plus embarquer `public/assets/Banque des images AFD - Classees/` (~626 Mo) dans le ZIP Hostinger.

Les images sont servies depuis le bucket public **`afd-media`**.

## Upload (une fois)

1. Dans `.env.local`, renseigner une vraie clé :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://mxxuxnoqnwjygawvvhcb.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...service_role...
   ```
2. Exécuter :
   ```bash
   npm run media:upload-bank
   ```
3. Vérifier dans Supabase → Storage → `afd-media` → dossier `banque/`.

## URLs

Format :
```text
{NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/afd-media/banque/{dossier}/{fichier}
```

Le code (`afdBankImage`, `normalizeLibraryAssetUrl`) construit automatiquement ces URLs.

## ZIP léger

```bash
npm run deploy:zip
```

Le dossier banque est **exclu** du ZIP. Garder logos / home légers dans `public/assets/brand` et `public/assets/home`.

## Hostinger

Variables requises (dont `NEXT_PUBLIC_SUPABASE_URL`) pour que les images s’affichent.
