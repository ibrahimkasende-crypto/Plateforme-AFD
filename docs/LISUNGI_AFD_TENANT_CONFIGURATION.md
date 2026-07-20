# Configuration tenant AFD

## Identifiant stable

```
a0000000-0000-4000-8000-000000000afd
```

Source code : `src/config/organization-brand.ts` (`AFD_ORGANIZATION_ID`)  
Migration : `20260720_060_lisungi_organizations_foundations.sql`

## Données seed

| Champ | Valeur |
|-------|--------|
| name | Alliance des Femmes pour le Développement |
| short_name | AFD |
| legal_name | Alliance des Femmes pour le Développement — AFD ASBL |
| slug | afd |
| domain | afd-rdc.org |
| status | pilot |
| logo | `/assets/brand/Logo_AFD.jpeg` |

## Abonnement

Plan `pilot_internal` — ne bloque pas l’accès.  
Page UI : `/admin/abonnement`

## Memberships

Tous les profils `profils_administrateurs` actifs sont rattachés à l’organisation AFD au moment de la migration.
