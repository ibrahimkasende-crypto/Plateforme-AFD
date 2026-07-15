# Audit design V3

## Constats

- La page d’accueil présente déjà une structure solide, mais les anciennes classes `afd-*`, les styles du carousel historique et les composants admin créent une identité visuelle mixte.
- Les cartes et boutons sont réutilisables, mais plusieurs pages utilisent encore des espacements, bordures et palettes historiques.
- `lucide-react` est l’unique bibliothèque d’icônes utilisée. Aucun composant shadcn/ui ni bibliothèque d’animation n’était installé.
- Les animations existantes sont principalement le carousel CSS et des transitions Tailwind ; le Hero ne doit plus utiliser de rotation automatique.

## Réutilisable

`Container`, `Section`, `Button`, `Card`, les données de secours, `ProgramImage`, le layout public et les requêtes Supabase de l’accueil.

## À remplacer progressivement

- Palette bleue `afd-*` dans les pages historiques.
- Styles CSS spécifiques du carousel et les cartes utilisant des ombres ou arrondis incohérents.
- Les animations automatiques et les liens historiques non harmonisés.

## Risques

- Ne pas modifier les données Supabase ni les routes existantes.
- Préserver le fallback local lorsqu’aucune variable Supabase n’est disponible.
- Valider le nouveau langage visuel sur l’accueil avant les pages internes.

## Plan

1. Centraliser tokens vert forêt, émeraude, aubergine, or et ivoire.
2. Conserver Lucide comme unique système d’icônes.
3. Utiliser Motion uniquement pour les révélations et micro-interactions.
4. Mettre en cache les requêtes avec TanStack Query dans les itérations suivantes.
5. Migrer ensuite les pages internes, sans dupliquer les composants.
