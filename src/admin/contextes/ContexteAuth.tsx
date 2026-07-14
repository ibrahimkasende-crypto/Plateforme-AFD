// =============================================================
// Contexte d'authentification pour l'espace administrateur AFD
// Ce contexte gère l'état de connexion de l'administrateur,
// vérifie que l'utilisateur existe dans la table 'administrateurs'
// et expose les fonctions de connexion/déconnexion.
// =============================================================

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, queryWithRetry } from '../../lib/supabase';

// ----- Types -----

/** Représente un administrateur stocké dans la base de données */
interface Administrateur {
    id: string;
    email: string;
    est_admin: boolean;
    date_creation: string;
}

/** État global du contexte d'authentification */
interface EtatAuth {
    /** Utilisateur Supabase Auth (peut être null si non connecté) */
    utilisateur: User | null;
    /** Données de l'administrateur en base (null si non vérifié) */
    administrateur: Administrateur | null;
    /** Indique si la vérification d'authentification est en cours */
    chargement: boolean;
    /** Erreur réseau lors de la vérification admin (null si aucune erreur) */
    erreurAuth: string | null;
    /** Fonction de connexion avec email et mot de passe */
    seConnecter: (email: string, motDePasse: string) => Promise<{ erreur: string | null }>;
    /** Fonction de déconnexion */
    seDeconnecter: () => Promise<void>;
    /** Relance la vérification des droits (après un échec de cold start) */
    reessayerAuth: () => Promise<void>;
}

// ----- Création du contexte -----

const ContexteAuth = createContext<EtatAuth | null>(null);

// ----- Hook personnalisé pour utiliser le contexte -----

/**
 * Hook useAuth — à utiliser dans les composants enfants du fournisseur.
 * Lance une erreur si utilisé en dehors du fournisseur.
 */
export function useAuth(): EtatAuth {
    const contexte = useContext(ContexteAuth);
    if (!contexte) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un FournisseurAuth');
    }
    return contexte;
}

// ----- Fournisseur du contexte -----

interface PropsFournisseur {
    // React exige que la prop pour les enfants JSX s'appelle toujours "children"
    children: ReactNode;
}

/**
 * FournisseurAuth — enveloppe l'application admin.
 * Écoute les changements de session Supabase et vérifie
 * automatiquement les droits d'administration.
 */
export function FournisseurAuth({ children }: PropsFournisseur) {
    // État de l'utilisateur Supabase Auth
    const [utilisateur, setUtilisateur] = useState<User | null>(null);
    // Données admin depuis la table 'administrateurs'
    const [administrateur, setAdministrateur] = useState<Administrateur | null>(null);
    // Erreur réseau lors de la vérification (cold start) — null si OK
    const [erreurAuth, setErreurAuth] = useState<string | null>(null);
    // Indicateur de chargement (vérification en cours)
    const [chargement, setChargement] = useState(true);

    // ----- Vérification des droits d'administration -----

    /**
     * Vérifie que l'utilisateur connecté existe dans la table 'administrateurs'
     * avec est_admin = true. Déconnecte immédiatement si non autorisé.
     */
    async function verifierAdministrateur(utilisateurConnecte: User) {
        // Tentative directe sans retry : PGRST116 = "0 ligne" = pas admin,
        // réponse définitive de la base — retenter serait inutile et dangereux.
        const premierEssai = await supabase
            .from('administrateurs')
            .select('*')
            .eq('id', utilisateurConnecte.id)
            .eq('est_admin', true)
            .single();

        if (!premierEssai.error && premierEssai.data) {
            setErreurAuth(null);
            setAdministrateur(premierEssai.data as Administrateur);
            return;
        }

        if (premierEssai.error?.code === 'PGRST116') {
            // La base répond correctement : utilisateur non admin → déconnexion immédiate
            console.warn('[ContexteAuth] Accès refusé : utilisateur non administrateur');
            await supabase.auth.signOut();
            setUtilisateur(null);
            setAdministrateur(null);
            return;
        }

        // Autre erreur (réseau, cold start) → retenter via queryWithRetry
        const { data, error } = await queryWithRetry(() =>
            supabase
                .from('administrateurs')
                .select('*')
                .eq('id', utilisateurConnecte.id)
                .eq('est_admin', true)
                .single()
        );

        if (!error && data) {
            setErreurAuth(null);
            setAdministrateur(data as Administrateur);
            return;
        }

        if (error && error.code !== 'PGRST116') {
            console.error('[ContexteAuth] Vérification admin échouée après retries:', error);
            setErreurAuth('La base de données ne répond pas. Réessayez dans quelques secondes.');
            return;
        }

        // Utilisateur non présent dans la table administrateurs → déconnexion propre
        console.warn('[ContexteAuth] Accès refusé : utilisateur non administrateur');
        await supabase.auth.signOut();
        setUtilisateur(null);
        setAdministrateur(null);
    }

    // ----- Réessai après erreur de cold start -----

    async function reessayerAuth(): Promise<void> {
        if (!utilisateur) return;
        setErreurAuth(null);
        setChargement(true);
        await verifierAdministrateur(utilisateur);
        setChargement(false);
    }

    // ----- Écoute des changements de session Supabase -----

    useEffect(() => {
        // Récupère la session initiale au montage du composant
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                if (session?.user) {
                    setUtilisateur(session.user);
                    verifierAdministrateur(session.user).finally(() => setChargement(false));
                } else {
                    setChargement(false);
                }
            })
            .catch(() => {
                // getSession() est une lecture locale ; ce catch couvre les cas pathologiques
                setChargement(false);
            });

        // Abonnement aux changements de session (connexion/déconnexion)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_evenement, session) => {
                // NE PAS await ici. Lors d'un rechargement de page avec session existante,
                // _recoverAndRefresh() appelle ce callback depuis l'intérieur du Navigator Lock
                // (acquis par initialize()). getSession() attend initializePromise, qui ne peut
                // se résoudre que si initialize() termine — DEADLOCK.
                // setTimeout(0) sort de la pile synchrone : initialize() termine, initializePromise
                // se résout, puis notre code s'exécute sans blocage.
                setTimeout(async () => {
                    if (session?.user) {
                        setUtilisateur(session.user);
                        await verifierAdministrateur(session.user);
                    } else {
                        setUtilisateur(null);
                        setAdministrateur(null);
                    }
                    setChargement(false);
                }, 0);
            }
        );

        // Nettoyage de l'abonnement au démontage
        return () => subscription.unsubscribe();
    }, []);

    // ----- Fonction de connexion -----

    /**
     * Tente de connecter l'administrateur via Supabase Auth.
     * Retourne une erreur si les identifiants sont incorrects
     * ou si l'utilisateur n'est pas dans la table administrateurs.
     */
    async function seConnecter(email: string, motDePasse: string): Promise<{ erreur: string | null }> {
        setChargement(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password: motDePasse,
            });

            if (error) {
                // Échec de connexion : onAuthStateChange ne se déclenchera pas,
                // on remet chargement à false manuellement.
                setChargement(false);
                return { erreur: 'Email ou mot de passe incorrect.' };
            }

            if (data.user) {
                setUtilisateur(data.user);
            }

            // Connexion réussie : chargement reste true intentionnellement.
            // onAuthStateChange va se déclencher, appeler verifierAdministrateur,
            // puis remettre chargement à false une fois la vérification terminée.
            // RouteProtegee voit chargement=true → affiche le spinner, n'évalue
            // jamais un état intermédiaire (utilisateur défini, administrateur null).
            return { erreur: null };
        } catch {
            setChargement(false);
            return { erreur: 'Une erreur inattendue s\'est produite.' };
        }
    }

    // ----- Fonction de déconnexion -----

    /**
     * Déconnecte l'administrateur de Supabase et réinitialise l'état.
     */
    async function seDeconnecter(): Promise<void> {
        await supabase.auth.signOut();
        setUtilisateur(null);
        setAdministrateur(null);
    }

    // ----- Valeur du contexte exposée aux composants enfants -----

    const valeurContexte: EtatAuth = {
        utilisateur,
        administrateur,
        chargement,
        erreurAuth,
        seConnecter,
        seDeconnecter,
        reessayerAuth,
    };

    return (
        <ContexteAuth.Provider value={valeurContexte}>
            {children}
        </ContexteAuth.Provider>
    );
}
