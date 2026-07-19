# Journal de monitoring — production

**Ouverture :** 2026-07-19  
**Statut :** modèle vide — **aucune entrée live** (app non déployée)

Endpoint cible : `GET /api/health`  
Champs utiles : `status`, `checks.supabase`, `latencyMs`, `environment`, `version`

---

## Légende

| Sévérité | Signification |
|----------|---------------|
| INFO | Observation normale |
| WARN | Dégradé / timeout / config |
| CRIT | Indisponible / erreur 503 / données |

---

## Journal

| Date/heure (UTC) | Sévérité | Source | Observation | Action | Opérateur |
|------------------|----------|--------|-------------|--------|-----------|
| — | — | — | *Aucune entrée* | — | — |

<!-- Ajouter une ligne par contrôle manuel ou alerte. Exemple :
| 2026-07-20T10:00:00Z | WARN | /api/health | supabase=degraded, latencyMs=1200 | Vérifier ADF_BD | alice |
-->

---

## Contrôles récurrents (à activer post-GO)

| Fréquence | Contrôle |
|-----------|----------|
| 5–15 min | `/api/health` = `ok` |
| Quotidien | Backup status / `BACKUP_LAST_KNOWN_AT` |
| Hebdo | Revue logs Hostinger + erreurs Auth |
| Après migrate | RLS + smoke E2E |

**Pas d’alerte automatique configurée à ce jour.**
