# Scan secrets — production

**Date :** 2026-07-19  
**Périmètre :** dépôt `D:\Plateforme-AFD\AFD` (fichiers suivis Git)  
**Méthode :** revue `.gitignore`, `.env.example`, grep noms de variables (pas d’extraction de valeurs)

---

## Résultats

| Finding | Sévérité | Détail |
|---------|----------|--------|
| Aucun `.env` tracké (hors exemple) | OK | `.gitignore` ignore `.env*` avec exception `!.env.example` |
| `.env.example` présent | OK | Placeholders vides / booléens — **pas de secrets** |
| `SUPABASE_SERVICE_ROLE_KEY` | OK (noms seulement) | Référencé comme variable serveur dans code / docs — **aucune valeur commitée observée dans le scan documentaire** |
| Clés SerdiPay / e-mail / OCR cloud | OK (noms seulement) | Variables serveur dans `.env.example` — valeurs absentes |
| CI workflow | OK | Secrets via `${{ secrets.* }}` GitHub — pas de littéraux de prod |

---

## Fichiers locaux (hors Git — rappel)

| Fichier | Statut Git | Action |
|---------|------------|--------|
| `.env` / `.env.local` | Ignoré | Ne jamais committer ; vérifier qu’ils pointent vers `mxxuxnoqnwjygawvvhcb` |
| `.env.e2e.local` | Ignoré (pattern) | Réservé tests |

---

## Risques résiduels (non secrets, mais sécurité)

| Risque | Note |
|--------|------|
| Mismatch projet Supabase | Local a pu pointer vers `ancien-projet-supabase` — données / clés du mauvais projet |
| `service_role` en prod | Doit rester **uniquement** côté serveur (Hostinger / runtime) |
| Démo admin | Flag public — pas un secret, mais fuite de données fictives si `true` |

---

## Verdict

**Aucun secret de production trouvé dans les fichiers versionnés** (scan documentaire 2026-07-19).  
Scan automatisé complet (gitleaks / trufflehog) : **non exécuté dans ce rapport** — à planifier avant GO.

**Aucune valeur secrète n’est reproduite dans ce document.**

