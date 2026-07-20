# Architecture multi-tenant LISUNGI

## Convention

Colonne canonique : **`organization_id`** (uuid → `organizations.id`)

Ne pas ajouter une seconde colonne si `tenant_id` ou `organization_id` existe déjà.  
`organisation_id` (texte legacy OCR) peut coexister temporairement ; le rattachement uuid se fait via `organization_id`.

## Tables fondations

- `organizations`
- `organization_branding`
- `organization_memberships`
- `organization_settings`
- `subscription_plans`
- `organization_subscriptions`
- `feature_entitlements`

## Isolation

1. Utilisateur authentifié
2. Membership actif (`organization_memberships.status = 'active'`)
3. Rôle / permission
4. Filtre `organization_id`
5. Périmètres d’accès existants (`access_scopes`)

Helpers SQL :

- `public.is_org_member(uuid)`
- `public.user_organization_ids()`

## Rôles

### Plateforme (Lisungi Hub)

- `platform_owner`
- `platform_admin`
- `support_agent`
- `billing_admin`

### Organisation (tenant)

- `tenant_owner`
- `tenant_super_admin`
- `administrateur`
- `responsable_module`
- `employe`
- `agent_terrain`
- `auditeur`

(+ rôles métier AFD existants : `super_admin`, `finance`, etc.)

Un admin AFD n’est **pas** admin Lisungi Hub.
Un admin Lisungi Hub n’accède **pas** silencieusement aux données ONG.
