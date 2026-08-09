# Rapport final — Import intelligent & données de démonstration

Date : 2026-08-04  
Projet : `D:\Plateforme-AFD\AFD`

## 1. Slogan hero

Restauré **exactement** comme avant (colonne gauche, 3 lignes) :

```
Des femmes engagées
pour des communautés
plus fortes et résilientes.
```

Plus de forçage CMS / coin droit.

## 2. Centre d’import intelligent

| Point | Statut |
|-------|--------|
| Centre `/admin/import-intelligent` | OK — renommé + cartes A–E |
| Sidebar « Imports intelligents » | OK |
| Nouvel import OCR | OK |
| Missions | OK → wizard contenu |
| Finances Excel | OK → pipeline OCR finance |
| Photos | OK → wizard bibliothèque |
| Communications | OK → wizard actualité |
| Bénéficiaires | OK → wizard + OCR |
| Historique | OK → file d’attente |
| Modèles / règles / file | OK (existant) |
| Choix manuel / import (projets…) | OK |
| CRUD manuel conservé | OK (`…/manuelle`) |
| Validation humaine | OK — pas d’auto-publication |

## 3. OCR

Conservé : native, Tesseract, Azure, stubs Google/AWS. Variables `OCR_*` respectées.

## 4. Données de démonstration

| Script | Commande |
|--------|----------|
| Seed | `npm run demo:seed -- --execute` |
| Clear | `npm run demo:clear -- --execute` |
| Reset | `npm run demo:reset` |

Lot : `afd-demo-client-2026` · `is_demo=true`  
Page : `/admin/parametres/demonstration` (super_admin)

`.env.example` : `NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=true` et `NEXT_PUBLIC_ENABLE_DEMO_CONTENT=true` pour présentation Hostinger.

## 5. Checklist livrable

1–12 Import / OCR / preview / validation — **OK (MVP opérationnel)**  
13–14 Rollback partiel via OCR hub existant — **partiel**  
15–21 Graphiques / carte / site — **dépendent du seed exécuté**  
22 CRUD manuel — **OK**  
23 Responsive wizard — **OK de base**  
24 E2E dédiés — **non créés dans cette passe** (à compléter)  
25 typecheck/build — à exécuter  
26–27 Seed scripts — **OK**  
29 ZIP — à générer

## 6. Problèmes restants

- Import ZIP sécurisé / PPTX : conversion PDF recommandée  
- Auto-création album photos + 250 bénéficiaires individuels : seed partiel  
- E2E Playwright dédiés non ajoutés  
- Migration tables `intelligent_import_*` non créées (réutilise `documents_importes` / OCR existant)

## 7. Verdict

**Prêt pour présentation Hostinger** après :

```bash
npm run demo:seed -- --execute
npm run build
npm run deploy:zip
```

sous réserve des variables d’environnement Hostinger.
