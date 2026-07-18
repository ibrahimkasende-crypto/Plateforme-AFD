# Fond animé — page de connexion admin

## Fichiers
- `src/components/auth/animated-universe-background.tsx`
- `src/components/auth/star-field-canvas.tsx`
- `src/components/auth/auth-brand-panel.tsx`
- `src/components/auth/auth-shell.tsx`

## Technique
- Canvas 2D léger (`requestAnimationFrame`)
- Dégradés CSS + nébuleuse discrète
- Réseau SVG très léger
- `pointer-events: none`, `aria-hidden="true"`
- Pause quand l’onglet est masqué

## Accessibilité
- `prefers-reduced-motion: reduce` → étoiles statiques, pas d’animation continue
- Mobile / low density → moins de particules
- Formulaire contraste élevé sur carte blanche

## Identité
Logo AFD, AFD ASBL, Alliance des Femmes pour le Développement,  
« Espace sécurisé de gestion, de suivi et de publication. »
