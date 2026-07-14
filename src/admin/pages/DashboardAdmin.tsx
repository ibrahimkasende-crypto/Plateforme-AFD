// =============================================================
// DashboardAdmin — Page principale de l'espace administrateur
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600), #EAF6FD (afd-50)
// Toutes les cartes de modules utilisent des nuances de la palette AFD.
// =============================================================

import { LayoutDashboard, Users, FolderOpen, Newspaper, Shield, Layers, Star, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useAuth } from '../contextes/ContexteAuth';

/** Carte de module avec lien vers le CRUD */
interface CarteStatistique {
    icone: React.ElementType;
    libelle: string;
    couleur: string;
    fond: string;
    chemin: string;
}

// Cartes de navigation rapide — toutes en nuances AFD pour la cohérence
const cartesStats: CarteStatistique[] = [
    {
        icone: Layers,
        chemin: '/admin/programmes',
        libelle: 'Programmes',
        couleur: 'text-afd-400',
        fond: 'bg-afd-50 dark:bg-afd-900/30',
    },
    {
        icone: FolderOpen,
        chemin: '/admin/projets',
        libelle: 'Projets',
        couleur: 'text-afd-600',
        fond: 'bg-afd-100 dark:bg-afd-900/30',
    },
    {
        icone: Newspaper,
        chemin: '/admin/actualites',
        libelle: 'Actualités',
        couleur: 'text-afd-500',
        fond: 'bg-afd-50 dark:bg-afd-900/30',
    },
    {
        icone: Star,
        chemin: '/admin/partenaires',
        libelle: 'Partenaires',
        couleur: 'text-afd-700',
        fond: 'bg-afd-100 dark:bg-afd-900/30',
    },
    {
        icone: Users,
        chemin: '/admin/membres',
        libelle: 'Membres',
        couleur: 'text-afd-400',
        fond: 'bg-afd-50 dark:bg-afd-900/30',
    },
    {
        icone: Image,
        chemin: '/admin/galerie',
        libelle: 'Galerie',
        couleur: 'text-afd-500',
        fond: 'bg-afd-50 dark:bg-afd-900/30',
    },
];

/**
 * DashboardAdmin — Tableau de bord de l'administrateur.
 */
export default function DashboardAdmin() {
    const { administrateur } = useAuth();

    return (
        <LayoutAdmin>
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Message de bienvenue */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-afd-100 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        {/* Icône du tableau de bord — palette AFD */}
                        <div className="bg-afd-50 dark:bg-afd-900/30 p-4 rounded-2xl">
                            <LayoutDashboard className="h-8 w-8 text-afd-400 dark:text-afd-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Bienvenue dans l'espace admin 👋
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Connecté en tant que{' '}
                                <span className="font-semibold text-afd-400 dark:text-afd-300">
                                    {administrateur?.email}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grille de modules opérationnels */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Accès rapide aux modules
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {cartesStats.map((carte, index) => {
                            const Icone = carte.icone;
                            return (
                                <Link
                                    key={index}
                                    to={carte.chemin}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-afd-100 dark:border-gray-700 hover:shadow-md hover:border-afd-400/50 transition-all flex flex-col items-center text-center"
                                >
                                    {/* Icône du module */}
                                    <div className={`${carte.fond} w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110`}>
                                        <Icone className={`h-7 w-7 ${carte.couleur}`} />
                                    </div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{carte.libelle}</p>
                                    <p className="text-xs mt-2 text-afd-400 dark:text-afd-300 font-medium">
                                        Gérer
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Bandeau d'information — palette AFD (remplace emerald) */}
                <div className="bg-afd-50 dark:bg-afd-900/20 border border-afd-200 dark:border-afd-700 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-afd-400 dark:text-afd-300 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-afd-700 dark:text-afd-300">
                                Espace sécurisé
                            </p>
                            <p className="text-sm text-afd-600 dark:text-afd-400 mt-1">
                                Vous êtes authentifié en tant qu'administrateur. Tous les modules de gestion du contenu
                                sont désormais opérationnels et liés à votre base de données Supabase.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    );
}
