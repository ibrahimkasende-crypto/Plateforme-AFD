# Contrôle d’observabilité — production

**Date :** 2026-07-19  
**Statut global :** **INCOMPLET / BLOQUANT pour GO**

---

## Composants disponibles dans le code

| Composant | État | Note |
|-----------|------|------|
| `GET /api/health` | Code présent | JSON public sans secrets ; dépend Supabase |
| Page admin santé / hub | Maquette | Pas d’OpenTelemetry live |
| Journal activité / audit_logs | Partiel | Utile post-incident, pas monitoring uptime |
| CI GitHub Actions | Présent | Qualité + RLS conditionnel — pas monitoring prod |
| SerdiPay / Newsletter / OCR | Fail-closed | Erreurs explicites (pas de faux OK) |

---

## Checklist observabilité

| # | Contrôle | Statut |
|---|----------|--------|
| 1 | `/api/health` accessible depuis Internet | PENDING (pas d’URL live) |
| 2 | `environment=production` dans la réponse | PENDING |
| 3 | `checks.supabase=ok` sur AFD | PENDING |
| 4 | Alerte si status ≠ ok | **Absent** |
| 5 | Logs Hostinger centralisés | **Absent / NOT CONNECTED** |
| 6 | Corrélation version app (`0.1.0`) ↔ commit | PENDING |
| 7 | Mesure `latencyMs` baseline | PENDING |
| 8 | Dashboards APM / Sentry / équivalent | **Non présents** dans le repo |

---

## Réponse health (contrat)

Champs attendus : `status`, `application`, `version`, `environment`, `timestamp`, `checks.supabase`, `latencyMs`.  
Codes : `200` si ok/degraded ; `503` si error.

---

## Verdict

Observabilité **minimale en code** (`/api/health`), **non opérationnelle en production**.  
Compléter cette checklist avant GO.

