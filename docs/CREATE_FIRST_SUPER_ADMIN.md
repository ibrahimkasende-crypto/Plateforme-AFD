# Créer le premier super administrateur — Plateforme-AFD

Ne stockez **aucun mot de passe réel** dans le dépôt Git.

## Prérequis

1. Migrations appliquées sur le projet Supabase, notamment :
   - `20260715_001_security_foundations.sql`
   - `20260718_005_admin_auth_roles_journal.sql`
2. Redirect URLs configurées dans Supabase Auth → URL Configuration :
   - `http://localhost:3000/auth/callback`
   - `https://VOTRE_DOMAINE/auth/callback`
   - Site URL = `NEXT_PUBLIC_SITE_URL`

## Procédure

### 1. Créer l’utilisateur Auth

Dans **Supabase Dashboard → Authentication → Users → Add user** :

- Email professionnel AFD
- Mot de passe fort (temporaire)
- Cocher « Auto Confirm User » si nécessaire

### 2. Récupérer l’UUID

Copier l’`id` (UUID) de l’utilisateur créé.

### 3. Créer le profil administrateur

SQL Editor (remplacer les placeholders) :

```sql
insert into profils_administrateurs (id, email, nom_complet, actif)
values (
  'UUID_UTILISATEUR',
  'email@exemple.org',
  'Nom Complet',
  true
)
on conflict (id) do update
set email = excluded.email,
    nom_complet = excluded.nom_complet,
    actif = true;
```

### 4. Attribuer le rôle `super_admin`

```sql
insert into utilisateurs_roles (utilisateur_id, role_id)
select 'UUID_UTILISATEUR', r.id
from roles r
where r.nom = 'super_admin'
on conflict do nothing;
```

### 5. Activer le compte

Vérifier `actif = true` sur `profils_administrateurs`.

### 6. Tester

1. Ouvrir `/connexion`
2. Se connecter avec l’email / mot de passe
3. Vérifier la redirection vers `/admin`
4. Se déconnecter via le menu profil
5. Vérifier qu’un accès direct à `/admin` renvoie vers `/connexion`

## Sécurité

- Ne jamais committer de mots de passe
- Révoquer immédiatement un compte compromis (`actif = false`)
- Réserver `super_admin` à un nombre minimal de personnes
- Après premier login, changer le mot de passe temporaire

