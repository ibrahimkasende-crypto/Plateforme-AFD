# Enregistrement backup production

**Date :** 2026-07-19  
**Projet cible :** `ndkcywqihtnuoydwicrq` (ADF_BD)  
**Statut backup :** **PARTIEL — schéma public uniquement**

---

## Dump réalisé

| Champ | Valeur |
|-------|--------|
| Date/heure | 2026-07-19 ~18:20 (heure locale) |
| Type | Dump logique **schéma `public` uniquement** (`supabase db dump --linked --schema public`) |
| Fichier | `afd-schema-before-release-20260719-182029.sql` |
| Taille | 61 550 octets |
| SHA-256 | `3E68A3154BF60C2FD66AAD910C04BA2563531F5192FEE46AC950F5D204180195` |
| Emplacement sécurisé (hors Git) | `C:\Users\IKAS\Documents\Backups Plateforme AFD\production\` + copie locale gitignorée `production-backups/` |
| Dump données (data) | **ÉCHEC** — dump complet bloqué / fichier 0 octet |
| Restauration testée | **Non** |
| Point de restauration Supabase Dashboard | À vérifier manuellement (PITR selon plan) |

---

## Limites

- Ce dump **ne contient pas** les données métier (bénéficiaires, RH, finances…).  
- Suffisant pour restauration de structure / audit de schéma.  
- **Insuffisant** comme seul critère GO pour une restauration complète.  
- Critère GO « sauvegarde vérifiée » : **partiellement satisfait** (schéma OK, data KO).

---

## Méthode de restauration (schéma)

1. Environnement hors production uniquement.  
2. `psql` / `supabase db execute` sur le fichier `.sql`.  
3. Ne jamais écraser la prod sans validation écrite.  
4. Préférer une migration corrective forward plutôt qu’un restore destructif.

---

## Suite requise

1. Dump data complet (`pg_dump` data-only ou dashboard) hors heures de pointe.  
2. Vérifier backups automatiques Supabase.  
3. Tester restore sur projet staging.
