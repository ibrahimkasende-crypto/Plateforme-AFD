// ================================================================
// GestionProjects.tsx — Page CRUD des projets (espace admin AFD)
// Fonctionnalités :
//   - Liste des projets en tableau responsive
//   - Création d'un nouveau projet (modale)
//   - Modification d'un projet existant (modale pré-remplie)
//   - Suppression avec dialogue de confirmation
//   - Sélection du programme associé (depuis la table programmes)
//   - Messages de succès et d'erreur inline
// ================================================================

import { useEffect, useState } from 'react';
import {
    Plus, Edit, Trash2, X, Check, AlertCircle,
    ChevronDown, Loader2, FolderOpen
} from 'lucide-react';
import { supabase, queryWithRetry } from '../../lib/supabase';
import LayoutAdmin from '../layout/LayoutAdmin';
import ImageUploader from '../composants/ImageUploader';
import { Project } from '../../types';

// ─── Types ────────────────────────────────────────────────────────

/** Représente un programme pour la liste déroulante */
interface Programme {
    id: string;
    title: string;
}

/** État initial du formulaire (projet vide) */
const formulaireVide = {
    program_id: '',
    title: '',
    slug: '',
    description: '',
    location: '',
    status: 'en_cours' as Project['status'],
    start_date: '',
    end_date: '',
    budget: '',
    beneficiaries: '',
    results: '',
    image_url: '',
    active: true,
};

// ─── Composant principal ──────────────────────────────────────────

/**
 * GestionProjects — Page d'administration des projets AFD.
 * Permet de lister, créer, modifier et supprimer des projets.
 */
export default function GestionProjects() {
    // --- Données ---
    const [projets, setProjects] = useState<Project[]>([]);
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [chargement, setChargement] = useState(true);
    const [enregistrement, setEnregistrement] = useState(false);

    // --- Modale formulaire ---
    const [modaleOuverte, setModaleOuverte] = useState(false);
    const [projetEnEdition, setProjectEnEdition] = useState<Project | null>(null);
    const [formulaire, setFormulaire] = useState(formulaireVide);

    // --- Dialogue suppression ---
    const [suppressionId, setSuppressionId] = useState<string | null>(null);
    const [suppressionEnCours, setSuppressionEnCours] = useState(false);

    // --- Notifications ---
    const [notification, setNotification] = useState<{
        type: 'succes' | 'erreur';
        message: string;
    } | null>(null);

    // ─── Chargement initial ──────────────────────────────────────────

    useEffect(() => {
        chargerDonnees();
    }, []);

    /** Charge la liste des projets et des programmes depuis Supabase */
    async function chargerDonnees() {
        setChargement(true);
        const [
            { data: donneesProjects, error: erreurProjects },
            { data: donneesProgrammes, error: erreurProgrammes },
        ] = await Promise.all([
            queryWithRetry(() => supabase.from('projets').select('*').order('created_at', { ascending: false })),
            queryWithRetry(() => supabase.from('programmes').select('id, title').eq('active', true).order('order')),
        ]);
        if (erreurProjects) {
            console.error('[GestionProjects] projets ERROR:', erreurProjects);
            afficherNotification('erreur', `Erreur lors du chargement des projets : ${erreurProjects.message}`);
        }
        if (erreurProgrammes) console.error('[GestionProjects] programmes ERROR:', erreurProgrammes);
        if (donneesProjects) setProjects(donneesProjects);
        if (donneesProgrammes) setProgrammes(donneesProgrammes);
        setChargement(false);
    }

    // ─── Gestion du formulaire ────────────────────────────────────────

    /** Ouvre la modale pour créer un nouveau projet */
    function ouvrirCreation() {
        setProjectEnEdition(null);
        setFormulaire(formulaireVide);
        setModaleOuverte(true);
    }

    /** Ouvre la modale pour modifier un projet existant */
    function ouvrirEdition(projet: Project) {
        setProjectEnEdition(projet);
        setFormulaire({
            program_id: projet.program_id ?? '',
            title: projet.title,
            slug: projet.slug,
            description: projet.description,
            location: projet.location,
            status: projet.status,
            start_date: projet.start_date?.slice(0, 10) ?? '',
            end_date: projet.end_date?.slice(0, 10) ?? '',
            budget: projet.budget?.toString() ?? '',
            beneficiaries: projet.beneficiaries?.toString() ?? '',
            results: projet.results ?? '',
            image_url: projet.image_url ?? '',
            active: projet.active,
        });
        setModaleOuverte(true);
    }

    /** Ferme la modale et réinitialise le formulaire */
    function fermerModale() {
        setModaleOuverte(false);
        setProjectEnEdition(null);
        setFormulaire(formulaireVide);
    }

    /** Génère automatiquement le slug à partir du titre */
    function genererSlug(titre: string): string {
        return titre
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // supprimer accents
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    /** Met à jour un champ du formulaire */
    function mettreAJourChamp(champ: string, valeur: string | boolean) {
        setFormulaire(prev => {
            const nouvel = { ...prev, [champ]: valeur };
            // Génération automatique du slug si le titre change et qu'on crée un projet
            if (champ === 'title' && !projetEnEdition) {
                nouvel.slug = genererSlug(valeur as string);
            }
            return nouvel;
        });
    }

    // ─── Soumission (Création / Modification) ─────────────────────────

    /** Sauvegarde le projet (création ou modification selon l'état) */
    async function sauvegarder(e: React.FormEvent) {
        e.preventDefault();
        setEnregistrement(true);

        // Construction de l'objet à envoyer à Supabase
        const donnees = {
            program_id: formulaire.program_id || null,
            title: formulaire.title.trim(),
            slug: formulaire.slug.trim(),
            description: formulaire.description.trim(),
            location: formulaire.location.trim(),
            status: formulaire.status,
            start_date: formulaire.start_date,
            end_date: formulaire.end_date || null,
            budget: formulaire.budget ? parseFloat(formulaire.budget) : null,
            beneficiaries: formulaire.beneficiaries ? parseInt(formulaire.beneficiaries) : null,
            results: formulaire.results.trim() || null,
            image_url: formulaire.image_url.trim() || null,
            active: formulaire.active,
            updated_at: new Date().toISOString(), // Mise à jour automatique du timestamp
        };

        let erreur = null;

        if (projetEnEdition) {
            // --- Modification ---
            const { error } = await supabase
                .from('projets')
                .update(donnees)
                .eq('id', projetEnEdition.id);
            erreur = error;
        } else {
            // --- Création ---
            const { error } = await supabase
                .from('projets')
                .insert(donnees);
            erreur = error;
        }

        setEnregistrement(false);

        if (erreur) {
            afficherNotification('erreur', `Erreur : ${erreur.message}`);
        } else {
            afficherNotification('succes', projetEnEdition
                ? `Le projet "${formulaire.title}" a été mis à jour.`
                : `Le projet "${formulaire.title}" a été créé avec succès.`
            );
            fermerModale();
            chargerDonnees(); // Recharge la liste
        }
    }

    // ─── Suppression ──────────────────────────────────────────────────

    /** Lance la suppression du projet confirmé */
    async function confirmerSuppression() {
        if (!suppressionId) return;
        setSuppressionEnCours(true);

        const { error } = await supabase
            .from('projets')
            .delete()
            .eq('id', suppressionId);

        setSuppressionEnCours(false);
        setSuppressionId(null);

        if (error) {
            afficherNotification('erreur', `Impossible de supprimer : ${error.message}`);
        } else {
            afficherNotification('succes', 'Project supprimé avec succès.');
            chargerDonnees();
        }
    }

    // ─── Notifications ────────────────────────────────────────────────

    /** Affiche une notification qui disparaît après 4 secondes */
    function afficherNotification(type: 'succes' | 'erreur', message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    // ─── Rendu des badges de statut ──────────────────────────────────

    function BadgeStatut({ statut }: { statut: Project['status'] }) {
        const styles = {
            en_cours: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            termine: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
            futur: 'bg-afd-100 text-afd-700 dark:bg-afd-900/30 dark:text-afd-300',
        };
        const libelles = { en_cours: 'En cours', termine: 'Terminé', futur: 'À venir' };
        return (
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[statut]}`}>
                {libelles[statut]}
            </span>
        );
    }

    // ─── Rendu principal ──────────────────────────────────────────────

    return (
        <LayoutAdmin>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── En-tête de page ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-afd-50 dark:bg-afd-900/30 p-3 rounded-xl">
                            <FolderOpen className="h-6 w-6 text-afd-400 dark:text-afd-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestion des projets
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {projets.length} projet{projets.length !== 1 ? 's' : ''} au total
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={ouvrirCreation}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-afd-400 hover:bg-afd-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Ajouter un projet</span>
                    </button>
                </div>

                {/* ── Notification succès / erreur ── */}
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

                {/* ── Tableau des projets ── */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {chargement ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 text-afd-400 animate-spin" />
                        </div>
                    ) : projets.length === 0 ? (
                        <div className="text-center py-20">
                            <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">Aucun projet trouvé.</p>
                            <button onClick={ouvrirCreation} className="mt-4 text-afd-400 hover:underline text-sm">
                                Créer le premier projet →
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Titre</th>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Localisation</th>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Statut</th>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Début</th>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Actif</th>
                                        <th className="text-right px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {projets.map((projet) => (
                                        <tr key={projet.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{projet.title}</p>
                                                <p className="text-xs text-gray-400 mt-0.5 md:hidden">{projet.location}</p>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                                                {projet.location}
                                            </td>
                                            <td className="px-5 py-4">
                                                <BadgeStatut statut={projet.status} />
                                            </td>
                                            <td className="px-5 py-4 text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                                                {projet.start_date ? new Date(projet.start_date).toLocaleDateString('fr-FR') : '—'}
                                            </td>
                                            <td className="px-5 py-4 hidden lg:table-cell">
                                                <span className={`inline-block w-2.5 h-2.5 rounded-full ${projet.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    {/* Bouton Modifier */}
                                                    <button
                                                        onClick={() => ouvrirEdition(projet)}
                                                        className="p-2 text-afd-400 hover:bg-afd-50 dark:hover:bg-afd-900/20 rounded-lg transition-colors"
                                                        aria-label="Modifier"
                                                        title="Modifier"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    {/* Bouton Supprimer */}
                                                    <button
                                                        onClick={() => setSuppressionId(projet.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        aria-label="Supprimer"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* MODALE : Formulaire création / modification               */}
            {/* ══════════════════════════════════════════════════════════ */}
            {modaleOuverte && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Fond sombre */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={fermerModale}
                    />
                    {/* Carte modale */}
                    <div className="relative min-h-screen flex items-start justify-center py-8 px-4">
                        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl">

                            {/* En-tête modale */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {projetEnEdition ? 'Modifier le projet' : 'Nouveau projet'}
                                </h3>
                                <button
                                    onClick={fermerModale}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    aria-label="Fermer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Corps du formulaire */}
                            <form onSubmit={sauvegarder} className="px-6 py-6 space-y-5">

                                {/* Programme associé */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Programme associé
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formulaire.program_id}
                                            onChange={e => mettreAJourChamp('program_id', e.target.value)}
                                            className="w-full appearance-none px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400"
                                        >
                                            <option value="">-- Aucun programme --</option>
                                            {programmes.map(p => (
                                                <option key={p.id} value={p.id}>{p.title}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Titre + Slug sur 2 colonnes */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Titre <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formulaire.title}
                                            onChange={e => mettreAJourChamp('title', e.target.value)}
                                            placeholder="Titre du projet"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Slug <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formulaire.slug}
                                            onChange={e => mettreAJourChamp('slug', e.target.value)}
                                            placeholder="titre-du-projet"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-afd-400"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formulaire.description}
                                        onChange={e => mettreAJourChamp('description', e.target.value)}
                                        placeholder="Description courte du projet"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400 resize-none"
                                    />
                                </div>

                                {/* Localisation + Statut */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Localisation <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formulaire.location}
                                            onChange={e => mettreAJourChamp('location', e.target.value)}
                                            placeholder="Province, ville..."
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Statut <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                required
                                                value={formulaire.status}
                                                onChange={e => mettreAJourChamp('status', e.target.value)}
                                                className="w-full appearance-none px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400"
                                            >
                                                <option value="en_cours">En cours</option>
                                                <option value="futur">À venir</option>
                                                <option value="termine">Terminé</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Date de début <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formulaire.start_date}
                                            onChange={e => mettreAJourChamp('start_date', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Date de fin
                                        </label>
                                        <input
                                            type="date"
                                            value={formulaire.end_date}
                                            onChange={e => mettreAJourChamp('end_date', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400"
                                        />
                                    </div>
                                </div>

                                {/* Budget + Bénéficiaires */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Budget (USD)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formulaire.budget}
                                            onChange={e => mettreAJourChamp('budget', e.target.value)}
                                            placeholder="Ex: 50000"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Nombre de bénéficiaires
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formulaire.beneficiaries}
                                            onChange={e => mettreAJourChamp('beneficiaries', e.target.value)}
                                            placeholder="Ex: 1500"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400"
                                        />
                                    </div>
                                </div>

                                {/* Résultats */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Résultats obtenus
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={formulaire.results}
                                        onChange={e => mettreAJourChamp('results', e.target.value)}
                                        placeholder="Résultats mesurables obtenus..."
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400 resize-none"
                                    />
                                </div>

                                {/* Image du projet */}
                                <ImageUploader
                                    value={formulaire.image_url}
                                    onChange={(url) => mettreAJourChamp('image_url', url)}
                                    bucket="gallery"
                                    dossier="projets"
                                    label="Image du projet"
                                />

                                {/* Actif */}
                                <div className="flex items-center space-x-3">
                                    <input
                                        id="actif"
                                        type="checkbox"
                                        checked={formulaire.active}
                                        onChange={e => mettreAJourChamp('active', e.target.checked)}
                                        className="w-4 h-4 text-afd-400 rounded border-gray-300 focus:ring-afd-400"
                                    />
                                    <label htmlFor="actif" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                        Project actif (visible sur le site public)
                                    </label>
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex items-center justify-end space-x-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={fermerModale}
                                        className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={enregistrement}
                                        className="flex items-center space-x-2 px-6 py-2.5 bg-afd-400 hover:bg-afd-600 disabled:bg-afd-200 text-white font-semibold rounded-lg transition-all"
                                    >
                                        {enregistrement && <Loader2 className="h-4 w-4 animate-spin" />}
                                        <span>{projetEnEdition ? 'Enregistrer' : 'Créer le projet'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════ */}
            {/* DIALOGUE : Confirmation de suppression                    */}
            {/* ══════════════════════════════════════════════════════════ */}
            {suppressionId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSuppressionId(null)} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
                                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Confirmer la suppression</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Cette action est irréversible.
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setSuppressionId(null)}
                                className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmerSuppression}
                                disabled={suppressionEnCours}
                                className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-lg transition-all"
                            >
                                {suppressionEnCours && <Loader2 className="h-4 w-4 animate-spin" />}
                                <span>Supprimer</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </LayoutAdmin>
    );
}
