# Isolation des données — production

**Date :** 2026-07-19  
**Projet production mandaté :** `mxxuxnoqnwjygawvvhcb` (AFD)

---

## Problème constaté

| Environnement | Project ref | Libellé | Risque |
|---------------|-------------|---------|--------|
| Mandaté prod | `mxxuxnoqnwjygawvvhcb` | AFD | Cible unique autorisée |
| Local `.env` (avant correction) | `ancien-projet-supabase` | Plateforme-AFD | **Contamination croisée / fausses preuves** |
| Après correction CLI | `mxxuxnoqnwjygawvvhcb` | AFD | Aligné — DB connect a timeout une fois |

Toute opération (migration, seed, test RLS, dump) effectuée contre `ancien-projet-supabase` **ne compte pas** comme preuve production.

---

## Règles d’isolation

1. **Un seul projet prod :** `mxxuxnoqnwjygawvvhcb`.  
2. **Jamais** exécuter `seed:*` / `seed:complete-*` / `seed:hr` contre prod.  
3. **`NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=false`** et **`NEXT_PUBLIC_ENABLE_DEMO_CONTENT=false`** en production.  
4. Données démo (`is_demo`) : ne pas présenter comme officielles.  
5. Clés anon / publishable / service_role : jeu **distinct** par projet ; ne pas mélanger.  
6. Storage buckets privés (RH, OCR, candidatures) : URLs signées uniquement — pas d’exposition publique.

---

## Séparation dev / staging / prod

| Couche | État 2026-07-19 |
|--------|-----------------|
| Dev local | Historique mismatch — à revalider |
| Staging Hostinger | **Absent / non connecté** |
| Production Hostinger | **NOT CONNECTED** |
| Domaine `afd-rdc.org` | Candidat historique — **non vérifié** pour cette app Next |

---

## Actions avant GO

- [ ] Confirmer `NEXT_PUBLIC_SUPABASE_URL` contient bien `mxxuxnoqnwjygawvvhcb`  
- [ ] Purger / ignorer toute preuve issue de `ancien-projet-supabase`  
- [ ] Backup AFD avant tout `db push`  
- [ ] Documenter isolation dans le handover

**Statut isolation :** **À RISQUE** jusqu’à revalidation env + backup.

