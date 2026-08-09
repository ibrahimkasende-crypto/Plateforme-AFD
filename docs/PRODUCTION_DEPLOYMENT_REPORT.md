# Rapport de déploiement — production (brouillon)

**Date :** 2026-07-19  
**Statut :** **PRODUCTION_BLOQUÉE**  
**Ne pas marquer `PRODUCTION_RÉUSSIE`.**

---

## Synthèse

| Critère | État |
|---------|------|
| Code candidat | Branche `reconstruction-nextjs` (~45 commits ahead de `plateforme/main`) |
| Hébergement Hostinger | **NOT CONNECTED** |
| Domaine | `https://afd-rdc.org` candidat — **non vérifié** |
| Env prod | **Non configurées** sur hébergeur |
| Projet Supabase | Mandaté `mxxuxnoqnwjygawvvhcb` ; historique local mismatch |
| Backup | **PARTIEL** — schéma public SHA-256 `3E68A315…0195` (61 550 o) ; dump data **échec** |
| Migrations remote | Historique CLI incomplet sur `ndk…` ; `db push` **non exécuté** (risque) |
| Validations locales | typecheck/lint/unit/rls/build **OK** |
| Déploiement exécuté | **Non** |
| URL live app Next | **Aucune attestée** |
| Hash commit déployé | **N/A — non inventé** |

---

## Checklist GO

- [x] typecheck / lint / unit / build locaux  
- [x] Backup schéma AFD (hash connu)  
- [ ] Backup data complet  
- [ ] Remote GitHub cible clarifié  
- [ ] Migrations enregistrées / appliquées proprement sur `mxxuxnoqnwjygawvvhcb`  
- [ ] RLS rejouée avec env pointant vers AFD  
- [ ] Storage checklist live  
- [ ] Hostinger connecté + Node 20–24  
- [ ] Env prod (démo = false, Supabase `ndk…`)  
- [ ] `/api/health` live HTTPS  
- [ ] Domaine / SSL vérifiés  
- [ ] Monitoring + handover signé  

---

## Intégrations (comportement attendu même après GO partiel)

| Intégration | Comportement honnête |
|-------------|----------------------|
| Newsletter | « Configuration requise » si `EMAIL_*` absents |
| SerdiPay | `SerdiPayNotConfiguredError` — pas de faux succès |
| OCR cloud | Désactivé tant que non configuré |

---

## Journal de tentative

| Date | Action | Résultat |
|------|--------|----------|
| 2026-07-19 | Préparation docs / audit | **PRODUCTION_BLOQUÉE** — aucun deploy |

---

## Verdict

**PRODUCTION_BLOQUÉE** (brouillon figé jusqu’à preuve Hostinger + domaine + env + backup).

