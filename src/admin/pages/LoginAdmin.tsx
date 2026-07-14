// =============================================================
// LoginAdmin — Page de connexion de l'espace administrateur AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600)
// Design professionnel, sobre et institutionnel.
// =============================================================

import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../contextes/ContexteAuth';
import logo from '../../assets/adf-logo.jpg';

/**
 * LoginAdmin — Formulaire de connexion sécurisé pour les administrateurs.
 *
 * Fonctionnalité :
 * - Saisie email + mot de passe
 * - Affichage/masquage du mot de passe
 * - Appel au contexte d'auth → vérification Supabase + table administrateurs
 * - Affichage des erreurs en cas d'échec
 * - Redirection vers /admin/dashboard si succès
 */
export default function LoginAdmin() {
    const { seConnecter, chargement } = useAuth();
    const naviguer = useNavigate();

    // --- États locaux du formulaire ---
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);
    const [enCours, setEnCours] = useState(false);

    /**
     * Gère la soumission du formulaire de connexion.
     * Appelle seConnecter() puis redirige si succès.
     */
    async function gererSoumission(evenement: FormEvent) {
        evenement.preventDefault(); // Empêche le rechargement de la page
        setErreur(null);
        setEnCours(true);

        const { erreur: erreurConnexion } = await seConnecter(email.trim(), motDePasse);

        if (erreurConnexion) {
            setErreur(erreurConnexion);
            setEnCours(false);
        } else {
            // Connexion réussie → redirection vers le tableau de bord
            naviguer('/admin/dashboard', { replace: true });
        }
    }

    return (
        <div className="min-h-screen bg-afd-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* --- Carte de connexion --- */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">

                    {/* En-tête avec logo et titre — dégradé AFD */}
                    <div className="bg-gradient-to-r from-afd-400 to-afd-600 px-8 py-10 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <img
                                    src={logo}
                                    alt="Logo AFD"
                                    className="h-20 w-20 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                                {/* Badge administrateur */}
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow">
                                    <Shield className="h-4 w-4 text-afd-400" />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">
                            Espace Administrateur
                        </h1>
                        <p className="text-afd-100 text-sm">
                            Alliance des Femmes pour le Développement
                        </p>
                    </div>

                    {/* Corps du formulaire */}
                    <div className="px-8 py-8">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 text-center">
                            Connexion sécurisée
                        </h2>

                        {/* Affichage de l'erreur — rouge fonctionnel conservé */}
                        {erreur && (
                            <div className="mb-5 flex items-start space-x-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg px-4 py-3">
                                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700 dark:text-red-300">{erreur}</p>
                            </div>
                        )}

                        {/* Formulaire de connexion */}
                        <form onSubmit={gererSoumission} className="space-y-5" noValidate>

                            {/* Champ Email */}
                            <div>
                                <label
                                    htmlFor="admin-email"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                                >
                                    Adresse email
                                </label>
                                <input
                                    id="admin-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@afd-rdc.org"
                                    required
                                    autoComplete="email"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Champ Mot de passe */}
                            <div>
                                <label
                                    htmlFor="admin-password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                                >
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <input
                                        id="admin-password"
                                        type={afficherMotDePasse ? 'text' : 'password'}
                                        value={motDePasse}
                                        onChange={(e) => setMotDePasse(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        autoComplete="current-password"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-all"
                                    />
                                    {/* Bouton afficher/masquer le mot de passe */}
                                    <button
                                        type="button"
                                        onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-afd-400 dark:hover:text-afd-300 transition-colors"
                                        aria-label={afficherMotDePasse ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                    >
                                        {afficherMotDePasse
                                            ? <EyeOff className="h-5 w-5" />
                                            : <Eye className="h-5 w-5" />
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Bouton de connexion — palette AFD */}
                            <button
                                type="submit"
                                disabled={enCours || chargement || !email || !motDePasse}
                                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-afd-400 hover:bg-afd-600 disabled:bg-afd-200 dark:disabled:bg-afd-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                            >
                                {enCours || chargement ? (
                                    <>
                                        {/* Spinner de chargement */}
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Vérification...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-5 w-5" />
                                        <span>Se connecter</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Note de sécurité */}
                        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
                            Accès réservé aux administrateurs autorisés uniquement.
                            <br />
                            Toutes les tentatives de connexion sont enregistrées.
                        </p>
                    </div>
                </div>

                {/* Lien retour au site public */}
                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="text-sm text-afd-400 dark:text-afd-300 hover:underline transition-colors"
                    >
                        ← Retour au site public
                    </a>
                </div>
            </div>
        </div>
    );
}
