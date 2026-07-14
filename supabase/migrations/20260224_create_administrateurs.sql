/*
  # Création de la table administrateurs

  ## Description
  Cette migration crée la table qui stocke les administrateurs autorisés
  à accéder au tableau de bord de gestion du site AFD.

  La table est liée à auth.users de Supabase : seuls les utilisateurs
  ayant un compte auth ET une entrée ici avec est_admin = true peuvent
  accéder à l'espace d'administration.

  ## Table : administrateurs
  - id          : Référence à l'utilisateur Supabase Auth
  - email       : Adresse email de l'administrateur
  - est_admin   : Drapeau d'activation (doit être true pour autoriser l'accès)
  - date_creation : Horodatage d'ajout de l'administrateur
*/

-- Création de la table administrateurs
CREATE TABLE IF NOT EXISTS administrateurs (
  -- Identifiant unique, lié au compte Supabase Auth
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Adresse email de l'administrateur
  email text NOT NULL,

  -- Indique si cet utilisateur a les droits d'administration
  est_admin boolean DEFAULT true NOT NULL,

  -- Date et heure de création de l'entrée
  date_creation timestamptz DEFAULT now() NOT NULL
);

-- Commentaire sur la table
COMMENT ON TABLE administrateurs IS 'Table des administrateurs autorisés à accéder au tableau de bord AFD';
COMMENT ON COLUMN administrateurs.id IS 'Référence à auth.users.id — doit correspondre à un compte Supabase Auth';
COMMENT ON COLUMN administrateurs.email IS 'Adresse email de l''administrateur (doit correspondre à l''email auth)';
COMMENT ON COLUMN administrateurs.est_admin IS 'Si false, l''accès est refusé même si le compte auth existe';
COMMENT ON COLUMN administrateurs.date_creation IS 'Horodatage de création de l''entrée administrateur';

-- Activation de la sécurité par ligne (Row Level Security)
ALTER TABLE administrateurs ENABLE ROW LEVEL SECURITY;

-- Politique : un utilisateur connecté ne peut lire que SA propre ligne
CREATE POLICY "Un admin ne peut voir que son propre profil"
  ON administrateurs FOR SELECT
  USING (auth.uid() = id);

-- Index pour accélerer les vérifications par id
CREATE INDEX IF NOT EXISTS idx_administrateurs_id ON administrateurs(id);
CREATE INDEX IF NOT EXISTS idx_administrateurs_email ON administrateurs(email);
