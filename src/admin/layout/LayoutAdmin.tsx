// =============================================================
// LayoutAdmin — Mise en page commune de l'espace administrateur
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600), #EAF6FD (afd-50)
// Le rouge est conservé pour le bouton de déconnexion (signalétique).
// =============================================================

import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    Shield,
    ChevronRight,
    FolderOpen,
    Layers,
    Newspaper,
    Star,
    Users,
    Settings,
    Image,
} from 'lucide-react';
import { useAuth } from '../contextes/ContexteAuth';
import logo from '../../assets/adf-logo.jpg';

interface PropsLayoutAdmin {
    /** Contenu de la page à afficher dans la zone principale */
    children: ReactNode;
}

/** Définition d'un lien de navigation dans la barre latérale */
interface LienNavigation {
    icone: React.ElementType;
    libelle: string;
    chemin: string;
}

// --- Liens de navigation de la barre latérale ---
const liensNavigation: LienNavigation[] = [
    {
        icone: LayoutDashboard,
        libelle: 'Tableau de bord',
        chemin: '/admin/dashboard',
    },
    {
        icone: FolderOpen,
        libelle: 'Projets',
        chemin: '/admin/projets',
    },
    {
        icone: Layers,
        libelle: 'Programmes',
        chemin: '/admin/programmes',
    },
    {
        icone: Newspaper,
        libelle: 'Actualités',
        chemin: '/admin/actualites',
    },
    {
        icone: Star,
        libelle: 'Partenaires',
        chemin: '/admin/partenaires',
    },
    {
        icone: Users,
        libelle: 'Membres',
        chemin: '/admin/membres',
    },
    {
        icone: Image,
        libelle: 'Galerie',
        chemin: '/admin/galerie',
    },
    {
        icone: Settings,
        libelle: 'Paramètres',
        chemin: '/admin/parametres',
    },
];

/**
 * LayoutAdmin — Composant de mise en page pour l'espace administrateur.
 *
 * Structure :
 * ┌─────────────────────────────────────────┐
 * │  Barre latérale  │  En-tête             │
 * │  (navigation)    │  ──────────────────  │
 * │                  │  Contenu de la page  │
 * └─────────────────────────────────────────┘
 */
export default function LayoutAdmin({ children }: PropsLayoutAdmin) {
    const { administrateur, seDeconnecter } = useAuth();
    const emplacement = useLocation(); // Chemin actuel pour surligner le lien actif
    const naviguer = useNavigate();

    // État d'ouverture de la barre latérale sur mobile
    const [barreOuverte, setBarreOuverte] = useState(false);

    // --- Gestion de la déconnexion ---
    async function gererDeconnexion() {
        await seDeconnecter();
        naviguer('/admin/login', { replace: true });
    }

    // --- Vérifie si un lien de navigation est actif ---
    const estActif = (chemin: string) => emplacement.pathname === chemin;

    return (
        <div className="min-h-screen bg-afd-50 dark:bg-gray-900 flex">

            {/* ── Overlay mobile (fond sombre quand la barre est ouverte) ── */}
            {barreOuverte && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setBarreOuverte(false)}
                    aria-hidden="true"
                />
            )}

            {/* ── Barre latérale de navigation ── */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white dark:bg-gray-800 shadow-xl
          flex flex-col transition-transform duration-300
          ${barreOuverte ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Logo et titre de la barre */}
                <div className="flex items-center space-x-3 px-6 py-5 border-b border-afd-100 dark:border-gray-700">
                    <img src={logo} alt="Logo AFD" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">AFD</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Administration</p>
                    </div>
                    {/* Bouton fermer sur mobile */}
                    <button
                        onClick={() => setBarreOuverte(false)}
                        className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
                        aria-label="Fermer le menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Liens de navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {liensNavigation.map((lien) => {
                        const Icone = lien.icone;
                        const actif = estActif(lien.chemin);
                        return (
                            <Link
                                key={lien.chemin}
                                to={lien.chemin}
                                onClick={() => setBarreOuverte(false)}
                                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all
                  ${actif
                                        ? 'bg-afd-50 dark:bg-afd-900/30 text-afd-600 dark:text-afd-300'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-afd-50 dark:hover:bg-gray-700 hover:text-afd-400 dark:hover:text-white'
                                    }
                `}
                                aria-current={actif ? 'page' : undefined}
                            >
                                <Icone className="h-5 w-5 flex-shrink-0" />
                                <span className="flex-1">{lien.libelle}</span>
                                {actif && <ChevronRight className="h-4 w-4" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Informations de l'administrateur connecté + déconnexion */}
                <div className="px-4 py-4 border-t border-afd-100 dark:border-gray-700">
                    {/* Badge administrateur — palette AFD */}
                    <div className="flex items-center space-x-3 px-3 py-2 bg-afd-50 dark:bg-afd-900/20 rounded-lg mb-3">
                        <div className="bg-afd-100 dark:bg-afd-800 p-1.5 rounded-full">
                            <Shield className="h-4 w-4 text-afd-400 dark:text-afd-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-afd-700 dark:text-afd-300 truncate">
                                {administrateur?.email || 'Administrateur'}
                            </p>
                            <p className="text-xs text-afd-500 dark:text-afd-400">
                                {administrateur?.est_admin ? 'Administrateur actif' : ''}
                            </p>
                        </div>
                    </div>

                    {/* Bouton de déconnexion — rouge conservé (signalétique d'action destructive) */}
                    <button
                        onClick={gererDeconnexion}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Se déconnecter</span>
                    </button>
                </div>
            </aside>

            {/* ── Zone principale (en-tête + contenu) ── */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* En-tête */}
                <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center space-x-4 sticky top-0 z-10 border-b border-afd-100 dark:border-gray-700">
                    {/* Bouton menu hamburger (mobile uniquement) */}
                    <button
                        onClick={() => setBarreOuverte(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-afd-50 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Ouvrir le menu"
                    >
                        <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </button>

                    {/* Titre dynamique selon la page */}
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {liensNavigation.find((l) => estActif(l.chemin))?.libelle ?? 'Administration AFD'}
                    </h1>
                </header>

                {/* Contenu de la page */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
