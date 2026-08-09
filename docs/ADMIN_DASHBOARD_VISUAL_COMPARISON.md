# Comparaison visuelle — Dashboard admin vs référence

Date : 2026-07-18  
Viewport cible : **1536 × 1024**  
Référence : `docs/references/admin-dashboard-reference.png`  
Capture auto : `tests/visual/admin-dashboard-1536x1024.png` (test Playwright optionnel)

---

## 1. Méthodologie

1. Ouvrir `/admin` authentifié en viewport 1536×1024
2. Comparer au PNG de référence (pixel-diff ou inspection visuelle)
3. Vérifier métriques automatisées dans `admin-dashboard-layout.spec.ts` :
   - `[data-dashboard-overview].bottom ≤ viewportHeight`
   - `document.documentElement.scrollHeight ≤ clientHeight` (zero-scroll page)

---

## 2. État de la référence

| Fichier | Statut |
|---|---|
| `docs/references/admin-dashboard-reference.png` | **À placer** — non présent dans le dépôt au 2026-07-18 |
| `tests/visual/admin-dashboard-1536x1024.png` | Généré par test e2e (si credentials + build OK) |

Maquette alternative disponible : `Maquette_AFD/Maquette_AFD_Admin.png` (racine monorepo).

---

## 3. Objectif zero-scroll

À 1536×1024, l’ensemble du dashboard (sidebar + header + contenu overview) doit tenir **sans scroll vertical de page**.

Zones incluses dans `[data-dashboard-overview]` :

- Bandeau démo (si actif)
- Filtres
- 6 KPI
- 4 rangées de graphiques / sections
- Stats complémentaires + actions rapides
- Résumé accessible (footer texte)

**Hors scope zero-scroll :** sidebar scroll interne si menu long (acceptable).

---

## 4. Checklist comparaison par zone

| Zone | Référence attendue | Implémentation actuelle | Δ |
|---|---|---|---|
| Sidebar largeur | ~240px navy | 260px (`lg:pl-[260px]`) | +20px |
| Sidebar couleur | `#01265d` | `#0d254e` | Teinte |
| Header hauteur | 72px | 72px | OK |
| Fond contenu | `#f7f9fc` | `#f0f2f5` | Teinte |
| KPI rangée | 6 inline compacts | 6 inline 2xl | Hauteur |
| Chart hauteur | ~220px uniforme | variable Recharts | Hauteur |
| Donut statut | centre label | OK Recharts | Mineur |
| Barres secteur | 6 items max visibles | OK | OK |
| Top projets | 5 lignes avatar | OK | OK |
| Province | mini-carte ou barres | barres + note SVG | Fonctionnel |
| Alertes | scroll interne ~4 visibles | liste complète | Hauteur |
| Actions rapides | 5 boutons stack | OK | OK |
| Scroll page | **aucun** | **présent** | **Bloquant** |

---

## 5. Écarts restants (avant capture visuelle)

Ces différences sont **attendues** tant que la capture Playwright n’a pas été exécutée et que la phase B (audit) n’est pas livrée :

1. **Scroll vertical** — contenu dépasse ~120–200px à 1536×1024
2. **Tokens couleur** — primary `#2563eb` vs `#0865d8` cible
3. **Fond page** — `#f0f2f5` vs `#f7f9fc`
4. **Densité KPI** — padding et typo trop grands en mode default
5. **Graphiques** — hauteurs non normalisées, légendes parfois tronquées
6. **Carte RDC** — barres horizontales au lieu de choroplèthe
7. **Bandeau démo** — visible en dev, absent sur maquette prod
8. **Référence PNG** — fichier `docs/references/admin-dashboard-reference.png` manquant pour diff automatisé
9. **Capture générée** — `tests/visual/admin-dashboard-1536x1024.png` inexistante
10. **Grille 12 col compacte** — non implémentée (grilles Tailwind responsives)

---

## 6. Écarts mineurs acceptables (post zero-scroll)

- Badges sidebar numériques (données live vs maquette statique)
- Valeurs KPI différentes (données réelles / démo)
- Nom utilisateur header (profil connecté)
- Horodatage alertes dynamique
- Absence icône notification rouge si zero message

---

## 7. Procédure capture Playwright

Test optionnel dans `admin-dashboard-layout.spec.ts` :

```typescript
await page.screenshot({
  path: "tests/visual/admin-dashboard-1536x1024.png",
  fullPage: false,
});
```

Prérequis :

- `AFD_E2E_ADMIN_EMAIL` / `AFD_E2E_ADMIN_PASSWORD`
- `npm run build && npx playwright test admin-dashboard-layout --project=desktop-1536`

Comparer ensuite :

```bash
# Exemple avec pixelmatch (si outil installé)
npx pixelmatch docs/references/admin-dashboard-reference.png \
  tests/visual/admin-dashboard-1536x1024.png diff.png
```

---

## 8. Critères d’acceptation visuelle

| Critère | Seuil |
|---|---|
| Zero-scroll page 1536×1024 | `scrollHeight ≤ clientHeight + 1px` |
| Overview dans viewport | `overview.bottom ≤ innerHeight + 1px` |
| Pas de scroll horizontal | `scrollWidth ≤ clientWidth + 2px` |
| 6 KPI visibles sans scroll | test Playwright data |
| Diff pixel (optionnel) | &lt; 2 % une fois référence placée |

---

## 9. Prochaines mises à jour

Après exécution de la capture :

1. Copier la capture validée vers `docs/references/admin-dashboard-reference.png` si elle devient la nouvelle baseline
2. Cocher les lignes du tableau §4
3. Réduire la liste §5 aux seuls écarts résiduels
4. Archiver un diff PNG dans `docs/references/admin-dashboard-diff-YYYYMMDD.png`

