// =============================================================
// RouteProtegee — Composant de protection des routes admin
// Vérifie que l'utilisateur est connecté ET est dans la table
// administrateurs avec est_admin = true.
// Redirige vers /admin/login si non autorisé.
// Affiche un bouton "Réessayer" si la vérification échoue
// pour raison réseau (cold start Supabase).
// =============================================================

import { Navigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../contextes/ContexteAuth';

interface PropsRouteProtegee {
    /** Composant (page) à afficher si l'accès est autorisé */
    enfant: React.ReactNode;
}

/**
 * RouteProtegee — Enveloppe une page réservée aux administrateurs.
 *
 * Comportement :
 * - Si le chargement est en cours → affiche un écran d'attente
 * - Si la DB n'a pas répondu après retries → affiche erreur + bouton Réessayer
 * - Si l'utilisateur n'est pas connecté ou n'est pas admin → redirige vers /admin/login
 * - Si autorisé → affiche le composant enfant
 */
export default function RouteProtegee({ enfant }: PropsRouteProtegee) {
    const { utilisateur, administrateur, chargement, erreurAuth, reessayerAuth } = useAuth();

    // Affichage d'un indicateur de chargement pendant la vérification
    if (chargement) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-afd-50 dark:bg-gray-900">
                <div className="flex flex-col items-center space-y-4">
                    {/* Spinner de chargement */}
                    <div className="w-12 h-12 border-4 border-afd-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-afd-600 dark:text-afd-300 font-medium">Vérification des droits...</p>
                </div>
            </div>
        );
    }

    // Échec réseau (cold start) — jamais de spinner infini, toujours un bouton de sortie
    if (erreurAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-afd-50 dark:bg-gray-900 px-4">
                <div className="flex flex-col items-center space-y-5 text-center max-w-sm">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-2xl">
                        <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white mb-2">
                            Vérification impossible
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{erreurAuth}</p>
                    </div>
                    <button
                        onClick={() => reessayerAuth()}
                        className="px-6 py-2.5 bg-afd-400 hover:bg-afd-600 text-white font-semibold rounded-xl transition-all"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    // Redirection si l'utilisateur n'est pas connecté ou pas administrateur
    if (!utilisateur || !administrateur) {
        return <Navigate to="/admin/login" replace />;
    }

    // Accès autorisé — affichage du composant enfant
    return <>{enfant}</>;
}
