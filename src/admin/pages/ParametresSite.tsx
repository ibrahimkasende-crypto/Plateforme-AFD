import { useEffect, useState } from 'react';
import {
    Settings, Check, AlertCircle, Loader2, Save, Activity, Users, MapPin, Award
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LayoutAdmin from '../layout/LayoutAdmin';
import { SiteSetting } from '../../types';

export default function ParametresSite() {
    // --- Données ---
    const [parametres, setParametres] = useState<SiteSetting[]>([]);
    const [chargement, setChargement] = useState(true);
    const [enregistrement, setEnregistrement] = useState(false);

    // --- Valeurs du formulaire (stockage local modifiable) ---
    const [stats, setStats] = useState({
        beneficiaries: '',
        active_projects: '',
        experience_years: '',
        provinces_count: '',
    });

    // --- Notifications ---
    const [notification, setNotification] = useState<{
        type: 'succes' | 'erreur';
        message: string;
    } | null>(null);

    // ─── Chargement initial ──────────────────────────────────────────
    useEffect(() => {
        chargerDonnees();
    }, []);

    async function chargerDonnees() {
        setChargement(true);
        const { data, error } = await supabase
            .from('parametres_site')
            .select('*');

        if (error) {
            afficherNotification('erreur', 'Erreur lors du chargement des paramètres.');
        } else if (data) {
            setParametres(data);

            // Map the data to our local state object
            const nouvellesStats = { ...stats };
            data.forEach((param) => {
                if (Object.keys(nouvellesStats).includes(param.key)) {
                    nouvellesStats[param.key as keyof typeof nouvellesStats] = param.value;
                }
            });
            setStats(nouvellesStats);
        }
        setChargement(false);
    }

    // ─── Gestion de l'état ───────────────────────────────────────────
    const handleStatChange = (key: keyof typeof stats, value: string) => {
        setStats(prev => ({ ...prev, [key]: value }));
    };

    // ─── Sauvegarde dans Supabase ──────────────────────────────────────
    async function sauvegarderTout(e: React.FormEvent) {
        e.preventDefault();
        setEnregistrement(true);

        const majPromesses = Object.entries(stats).map(async ([key, value]) => {
            // Find the ID of the setting we want to update
            const param = parametres.find(p => p.key === key);

            if (param) {
                return supabase
                    .from('parametres_site')
                    .update({
                        value: value,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', param.id);
            }
            return Promise.resolve({ error: null }); // parameter doesn't exist yet, ignore or handle create
        });

        try {
            const resultats = await Promise.all(majPromesses);

            const erreurs = resultats.filter(r => r?.error);
            if (erreurs.length > 0) {
                afficherNotification('erreur', 'Certains paramètres n\'ont pas pu être sauvegardés.');
                console.error("Erreurs de sauvegarde:", erreurs);
            } else {
                afficherNotification('succes', 'Les paramètres du site ont été mis à jour avec succès.');
                chargerDonnees(); // Reload to get fresh timestamps
            }
        } catch (error) {
            console.error('[ParametresSite] sauvegarde ERROR:', error);
            afficherNotification('erreur', 'Une erreur inattendue s\'est produite.');
        } finally {
            setEnregistrement(false);
        }
    }

    function afficherNotification(type: 'succes' | 'erreur', message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    function getLastUpdate(key: string) {
        const param = parametres.find(p => p.key === key);
        if (!param || !param.updated_at) return 'Inconnue';
        return new Date(param.updated_at).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    // ─── Rendu ────────────────────────────────────────────────────────
    return (
        <LayoutAdmin>
            <div className="max-w-4xl mx-auto space-y-6">

                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                            <Settings className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Paramètres du site
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Gérer les données statistiques globales
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                {notification && (
                    <div className={`flex items-start space-x-3 px-4 py-3 rounded-xl border ${notification.type === 'succes'
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                        : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                        }`}>
                        {notification.type === 'succes'
                            ? <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            : <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        }
                        <p className={`text-sm font-medium ${notification.type === 'succes'
                            ? 'text-green-800 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                            }`}>
                            {notification.message}
                        </p>
                    </div>
                )}

                {/* Contenu principal */}
                {chargement ? (
                    <div className="flex items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <Loader2 className="h-8 w-8 text-afd-400 animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={sauvegarderTout} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">

                        <div className="p-6 sm:p-8 space-y-8">

                            {/* Section: Statistiques de la page d'accueil */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                                    Statistiques de la page d'accueil
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Ces chiffres sont affichés dans le bandeau des compteurs sur la page principale du site public. Mettez-les à jour régulièrement pour refléter l'impact réel de l'AFD.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Bénéficiaires */}
                                    <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="bg-afd-50 dark:bg-afd-900/30 p-2 rounded-lg text-afd-400 dark:text-afd-300">
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Bénéficiaires</label>
                                                <span className="text-xs text-gray-400 block mt-0.5">Dernière modif : {getLastUpdate('beneficiaries')}</span>
                                            </div>
                                        </div>
                                        <input
                                            type="number"
                                            value={stats.beneficiaries}
                                            onChange={(e) => handleStatChange('beneficiaries', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono"
                                            placeholder="Ex: 5000"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Nombre total de personnes ayant bénéficié des actions de l'AFD.</p>
                                    </div>

                                    {/* Projets Actifs */}
                                    <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="bg-afd-50 dark:bg-afd-900/30 p-2 rounded-lg text-afd-400 dark:text-afd-300">
                                                <Activity className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Projets Actifs</label>
                                                <span className="text-xs text-gray-400 block mt-0.5">Dernière modif : {getLastUpdate('active_projects')}</span>
                                            </div>
                                        </div>
                                        <input
                                            type="number"
                                            value={stats.active_projects}
                                            onChange={(e) => handleStatChange('active_projects', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono"
                                            placeholder="Ex: 12"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Ce chiffre peut être un résumé manuel ou une valeur globale.</p>
                                    </div>

                                    {/* Années d'expérience */}
                                    <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="bg-afd-50 dark:bg-afd-900/30 p-2 rounded-lg text-afd-400 dark:text-afd-300">
                                                <Award className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Années d'expérience</label>
                                                <span className="text-xs text-gray-400 block mt-0.5">Dernière modif : {getLastUpdate('experience_years')}</span>
                                            </div>
                                        </div>
                                        <input
                                            type="number"
                                            value={stats.experience_years}
                                            onChange={(e) => handleStatChange('experience_years', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono"
                                            placeholder="Ex: 5"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Depuis la fondation de l'association.</p>
                                    </div>

                                    {/* Provinces couvertes */}
                                    <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="bg-afd-50 dark:bg-afd-900/30 p-2 rounded-lg text-afd-500 dark:text-afd-300">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Provinces/Zones d'interv.</label>
                                                <span className="text-xs text-gray-400 block mt-0.5">Dernière modif : {getLastUpdate('provinces_count')}</span>
                                            </div>
                                        </div>
                                        <input
                                            type="number"
                                            value={stats.provinces_count}
                                            onChange={(e) => handleStatChange('provinces_count', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono"
                                            placeholder="Ex: 3"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Nombre de régions dans lesquelles l'AFD opère activement.</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Barre d'action collante */}
                        <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 p-4 sm:px-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={enregistrement}
                                className="px-6 py-2.5 bg-afd-400 hover:bg-afd-600 text-white font-semibold rounded-lg flex items-center transition-colors disabled:opacity-70 shadow-sm"
                            >
                                {enregistrement ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5 mr-2" />
                                        Sauvegarder les modifications
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </LayoutAdmin>
    );
}
