# Sidebar admin pliable

## États
| État | Largeur | Contenu |
|---|---|---|
| Ouvert | 228 px | Logo, textes, menus, badges, chevrons |
| Réduit | 72 px | Logo, icônes, badges points, tooltips |

## Interaction
- Clic sur le logo AFD → bascule ouvert / réduit
- Bouton accessoire « Réduire » en état ouvert
- `aria-expanded`, `aria-label`, focus visible
- Animation largeur 200 ms, fondu du texte

## Persistance
- Cookie `afd-admin-sidebar-collapsed`
- Miroir `localStorage` (préférence visuelle uniquement)

## Pied de sidebar
- Photo institutionnelle **supprimée**
- Bouton compact « Voir le site public » → `/` nouvel onglet
