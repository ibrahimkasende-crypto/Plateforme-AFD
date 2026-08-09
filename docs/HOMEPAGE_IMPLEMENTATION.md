# Implémentation page d’accueil — Plateforme-AFD

**Date :** 17 juillet 2026

## 1. Sections créées

Hero, présentation AFD, valeurs, statistiques, piliers d’intervention, programmes, projets, zones, histoire d’impact, actualités, partenaires, newsletter, appels à l’action, footer.

## 2. Composants créés

Tous les fichiers sous `src/components/public/home/` + `site-footer.tsx`.

## 3. Composants modifiés

- `src/app/(public)/page.tsx`
- `src/app/(public)/layout.tsx`
- `src/components/motion/FadeIn.tsx`
- `src/components/public/PublicFooter.tsx` (réexport)
- `next.config.ts` (images distantes Supabase)

## 4. Images utilisées

- `/images/adf1.jpg` (Hero — temporaire)
- `/images/adf2.png` (Présentation — temporaire)
- `/brand/logo-afd.jpg` (footer / SEO)

## 5. Images manquantes

- Photos de terrain documentées AFD
- Logos partenaires
- SVG carte RDC officielle

## 6. Contenus institutionnels

`src/config/home-content.ts` (vision, valeurs, piliers, CTA, newsletter).

## 7. Données Supabase utilisées

Requêtes dans `src/lib/queries/home.ts` : programmes, projets, actualités, partenaires, agrégats stats/zones.

## 8. Données manquantes

- femmes accompagnées / activités (pas de colonnes dédiées)
- histoires d’impact (table absente)
- stats absentes → « À renseigner » en développement

## 9. Animations

Motion : Hero, FadeIn, compteur stats, hover cartes — `prefers-reduced-motion` respecté.

## 10. Newsletter

Formulaire RHF + Zod + Server Action + Sonner + honeypot + rate limit léger.

## 11. Soutenir l’AFD

CTA honnête : paiement prochainement disponible ; note SerdiPay non actif.

## 12. SerdiPay

Non activé — aucun faux paiement.

## 13. Tests responsive

Structure responsive prévue (sm/md/lg/xl). Contrôle visuel recommandé sur http://localhost:3000.

## 14. Accessibilité

H1 unique dans le Hero, labels formulaire, aria-live newsletter, focus visible, prefers-reduced-motion.

## 15. Typecheck

OK

## 16. Lint

OK (1 warning RHF `watch` / React Compiler — non bloquant)

## 17. Build

OK (73 routes)

## Alignement maquette (juil. 2026)

Révision visuelle après réception des maquettes desktop :

- Hero : badge « ONG nationale congolaise », carte institutionnelle 80 % CA, CTA partenaire
- Stats : barre blanche flottante sous le Hero (sans chiffres inventés)
- Domaines : grille 3×2 avec icônes circulaires
- Newsletter : bandeau horizontal compact
- CTA : 4 actions (membre, partenaire, soutenir, contact)
- Footer : colonnes Liens rapides / Nos actions / Contact ; icônes sociales Lucide via `Share2` (Facebook/Linkedin/Youtube absents de la version Lucide du projet)

Les logos partenaires fictifs de la maquette (UNICEF, USAID, etc.) ne sont **pas** reproduits.

### Validation technique (alignement)

- typecheck : OK
- lint : OK (1 warning RHF `watch`)
- build : OK
- push GitHub : non exécuté

