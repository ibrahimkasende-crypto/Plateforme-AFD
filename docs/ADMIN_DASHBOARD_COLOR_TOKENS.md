# Tokens couleur — Dashboard administrateur AFD

Date : 2026-07-18  
Scope CSS recommandé : `.admin-shell` ou `[data-admin-theme]` sur le layout admin.

Ces tokens alignent l’interface admin sur la maquette de référence (`docs/references/admin-dashboard-reference.png`) et remplacent les couleurs Tailwind en dur (`#2563eb`, `#0d254e`, etc.).

---

## Tokens structurels

| Token | Valeur | Usage |
|---|---|---|
| `--admin-primary` | `#0865d8` | CTA principal, liens actifs, focus rings |
| `--admin-primary-dark` | `#034ea2` | Hover CTA, états pressed |
| `--admin-navy` | `#07152f` | Texte très foncé, titres header |
| `--admin-sidebar` | `#01265d` | Fond sidebar |
| `--admin-sidebar-top` | `#011a57` | Dégradé haut sidebar |
| `--admin-sidebar-bottom` | `#01265d` | Dégradé bas sidebar |
| `--admin-sidebar-active` | `#0865d8` | Item navigation actif |
| `--admin-background` | `#f7f9fc` | Fond page principale |
| `--admin-card` | `#ffffff` | Cartes KPI, graphiques, filtres |
| `--admin-border` | `#e0e6ef` | Bordures cartes et séparateurs |
| `--admin-text` | `#0c1733` | Texte principal |
| `--admin-muted` | `#667085` | Labels, descriptions, placeholders |

---

## Tokens accent (graphiques, KPI, badges)

| Nom | Hex | Usage typique |
|---|---|---|
| `--admin-accent-blue` | `#0865d8` | KPI projets, série principale |
| `--admin-accent-green` | `#16a34a` | Variations positives, activités |
| `--admin-accent-orange` | `#f97316` | Partenaires, alertes warning |
| `--admin-accent-purple` | `#7c3aed` | Femmes touchées, statut terminé |
| `--admin-accent-teal` | `#0d9488` | Sécurité alimentaire, info |
| `--admin-accent-gold` | `#f59e0b` | Économie, highlights |
| `--admin-accent-red` | `#e11d48` | Alertes critical, variations négatives |
| `--admin-accent-warning` | `#f59e0b` | Bandeau démo, alertes warning |

---

## Bloc CSS de référence

```css
.admin-shell {
  /* Structure */
  --admin-primary: #0865d8;
  --admin-primary-dark: #034ea2;
  --admin-navy: #07152f;
  --admin-sidebar: #01265d;
  --admin-sidebar-top: #011a57;
  --admin-sidebar-bottom: #01265d;
  --admin-sidebar-active: #0865d8;
  --admin-background: #f7f9fc;
  --admin-card: #ffffff;
  --admin-border: #e0e6ef;
  --admin-text: #0c1733;
  --admin-muted: #667085;

  /* Accents */
  --admin-accent-blue: #0865d8;
  --admin-accent-green: #16a34a;
  --admin-accent-orange: #f97316;
  --admin-accent-purple: #7c3aed;
  --admin-accent-teal: #0d9488;
  --admin-accent-gold: #f59e0b;
  --admin-accent-red: #e11d48;
  --admin-accent-warning: #f59e0b;

  background-color: var(--admin-background);
  color: var(--admin-text);
}
```

---

## Mapping composants → tokens

| Composant | Token(s) |
|---|---|
| `AdminShell` fond | `--admin-background` |
| `AdminSidebar` fond | `--admin-sidebar` + dégradé top/bottom |
| Item nav actif | `--admin-sidebar-active` |
| `DashboardKpiCard` bordure | `--admin-border` |
| Icônes KPI | accents par indicateur (blue, purple, green, orange, navy) |
| `DashboardQuickActions` CTA | `--admin-primary` / hover `--admin-primary-dark` |
| `AdminFilters` selects focus | `--admin-primary` ring |
| Graphiques Recharts | palette `--admin-accent-*` |
| Bandeau démo | `--admin-accent-warning` fond 50 |

---

## Écart implémentation actuelle

| Élément | Actuel | Cible |
|---|---|---|
| Shell background | `#f0f2f5` (Tailwind) | `--admin-background` |
| Sidebar | `#0d254e` | `--admin-sidebar` |
| Primary buttons | `#2563eb` | `--admin-primary` |
| KPI icon blue | `#0877d1` | `--admin-accent-blue` |

**Action :** ajouter le bloc `.admin-shell` dans `src/app/globals.css` et remplacer progressivement les classes Tailwind arbitraires.

---

## Accessibilité

- Contraste texte `--admin-text` sur `--admin-card` : ≥ 12:1 (AAA).
- Contraste `--admin-muted` sur `--admin-card` : ≥ 4.5:1 (AA labels).
- Item sidebar actif : texte blanc sur `--admin-sidebar-active` — vérifier ratio ≥ 4.5:1.
- Ne pas utiliser la couleur seule pour les variations KPI : conserver flèches ↑↓.
