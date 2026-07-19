# Rapport performance — baseline qualitative

**Date :** 2026-07-19  
**Nature :** baseline **qualitative** uniquement — **pas de mesures Lighthouse / APM prod**

---

## Contexte

| Élément | État |
|---------|------|
| App déployée Hostinger | Non |
| Domaine live vérifié | Non |
| Métriques RUM / APM | Absentes |
| Health latency | Champ `latencyMs` dans `/api/health` — utile post-déploiement |

---

## Observations qualitatives (dev / architecture)

| Zone | Appréciation | Commentaire |
|------|--------------|-------------|
| Next.js 16 + Turbopack (dev) | N/A prod | `next build` / `next start` en prod |
| Dashboard admin (ECharts / charts) | Charge UI potentielle | À profiler après deploy |
| OCR native (Tesseract / unpdf) | CPU-bound | Préférer jobs worker ; cloud désactivé |
| Requêtes Supabase + RLS | Correctes en principe | N+1 / pagination à surveiller modules non opérationnels |
| Images / médias Storage | Dépend buckets + CDN | Non mesuré |
| Animations publiques | Flags motion | Désactivables via env |

---

## Seuils cibles (à valider plus tard — non atteints)

| Indicateur | Cible indicative | Mesure actuelle |
|------------|------------------|-----------------|
| TTFB page publique | < 800 ms (région) | **N/A** |
| `/api/health` latencyMs | < 500 ms typique | **N/A** |
| Build CI | < 25 min (timeout job) | Workflow défini |

---

## Actions post-GO

1. Mesurer `/api/health` depuis l’extérieur.  
2. Lighthouse mobile/desktop sur home + `/admin` (auth).  
3. Surveiller timeouts Supabase (déjà observé en CLI).  

**Verdict :** baseline qualitative seulement — **aucune performance production certifiée**.
