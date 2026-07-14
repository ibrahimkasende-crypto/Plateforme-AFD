import { useEffect, useState } from 'react';
import {
    Plus, Edit, Trash2, X, Check, AlertCircle, Loader2,
    Image as ImageIcon, Video,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LayoutAdmin from '../layout/LayoutAdmin';
import ImageUploader from '../composants/ImageUploader';
import { GalleryItem } from '../../types';

// ─── Type du formulaire ───────────────────────────────────────────

type GalerieFormData = {
    title: string;
    description: string;
    media_type: 'photo' | 'video';
    media_url: string;
    thumbnail_url: string;
    active: boolean;
};

// Note V1 : program_id et project_id sont omis du formulaire pour simplifier
// l'interface. Les nouvelles entrées reçoivent null ; les entrées existantes
// conservent leurs valeurs lors d'une modification (elles ne sont pas écrasées).

const formulaireVide: GalerieFormData = {
    title: '',
    description: '',
    media_type: 'photo',
    media_url: '',
    thumbnail_url: '',
    active: true,
};

// ─── Composant principal ──────────────────────────────────────────

export default function GestionGalerie() {
    // --- Données ---
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [chargement, setChargement] = useState(true);
    const [enregistrement, setEnregistrement] = useState(false);

    // --- Miniatures cassées dans le tableau ---
    const [imageCassees, setImageCassees] = useState<Set<string>>(new Set());

    // --- Modale formulaire ---
    const [modaleOuverte, setModaleOuverte] = useState(false);
    const [itemEnEdition, setItemEnEdition] = useState<GalleryItem | null>(null);
    const [formulaire, setFormulaire] = useState<GalerieFormData>(formulaireVide);

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

    async function chargerDonnees() {
        setChargement(true);
        const { data, error } = await supabase
            .from('galerie')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[GestionGalerie] chargement ERROR:', error);
            afficherNotification('erreur', `Erreur lors du chargement : ${error.message}`);
        }
        if (data) setItems(data);
        setChargement(false);
    }

    // ─── Gestion du formulaire ────────────────────────────────────────

    function ouvrirCreation() {
        setItemEnEdition(null);
        setFormulaire(formulaireVide);
        setModaleOuverte(true);
    }

    function ouvrirEdition(item: GalleryItem) {
        setItemEnEdition(item);
        setFormulaire({
            title: item.title,
            description: item.description ?? '',
            media_type: item.media_type,
            media_url: item.media_url,
            thumbnail_url: item.thumbnail_url ?? '',
            active: item.active,
        });
        setModaleOuverte(true);
    }

    function fermerModale() {
        setModaleOuverte(false);
        setItemEnEdition(null);
        setFormulaire(formulaireVide);
    }

    function mettreAJourChamp(champ: keyof GalerieFormData, valeur: string | boolean) {
        setFormulaire(prev => ({ ...prev, [champ]: valeur } as GalerieFormData));
    }

    function gererErreurMiniature(id: string) {
        setImageCassees(prev => new Set(prev).add(id));
    }

    // ─── Soumission (Création / Modification) ─────────────────────────

    async function sauvegarder(e: React.FormEvent) {
        e.preventDefault();
        setEnregistrement(true);

        const champsCommuns = {
            title: formulaire.title.trim(),
            description: formulaire.description.trim() || null,
            media_type: formulaire.media_type,
            media_url: formulaire.media_url.trim(),
            thumbnail_url: formulaire.thumbnail_url.trim() || null,
            active: formulaire.active,
        };

        let erreur = null;

        if (itemEnEdition) {
            // Mise à jour : on ne touche PAS program_id / project_id existants
            const { error } = await supabase
                .from('galerie')
                .update(champsCommuns)
                .eq('id', itemEnEdition.id);
            erreur = error;
        } else {
            // Création : program_id / project_id explicitement null
            const { error } = await supabase
                .from('galerie')
                .insert({ ...champsCommuns, program_id: null, project_id: null });
            erreur = error;
        }

        setEnregistrement(false);

        if (erreur) {
            afficherNotification('erreur', `Erreur : ${erreur.message}`);
        } else {
            afficherNotification('succes', itemEnEdition
                ? 'Le média a été mis à jour.'
                : 'Le média a été ajouté avec succès.'
            );
            fermerModale();
            chargerDonnees();
        }
    }

    // ─── Suppression ──────────────────────────────────────────────────

    async function confirmerSuppression() {
        if (!suppressionId) return;
        setSuppressionEnCours(true);

        const { error } = await supabase
            .from('galerie')
            .delete()
            .eq('id', suppressionId);

        setSuppressionEnCours(false);
        setSuppressionId(null);

        if (error) {
            afficherNotification('erreur', `Impossible de supprimer : ${error.message}`);
        } else {
            afficherNotification('succes', 'Média supprimé avec succès.');
            chargerDonnees();
        }
    }

    // ─── Notifications ────────────────────────────────────────────────

    function afficherNotification(type: 'succes' | 'erreur', message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    // ─── Rendu principal ──────────────────────────────────────────────

    return (
        <LayoutAdmin>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── En-tête de page ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-afd-50 dark:bg-afd-900/30 p-3 rounded-xl">
                            <ImageIcon className="h-6 w-6 text-afd-400 dark:text-afd-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestion de la galerie
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {items.length} média{items.length !== 1 ? 's' : ''} au total
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={ouvrirCreation}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-afd-400 hover:bg-afd-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Ajouter un média</span>
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

                {/* ── Tableau des médias ── */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {chargement ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 text-afd-400 animate-spin" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20">
                            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">Aucun média dans la galerie.</p>
                            <button onClick={ouvrirCreation} className="mt-4 text-afd-400 hover:underline text-sm">
                                Ajouter le premier média →
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Média</th>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Type</th>
                                        <th className="text-center px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Actif</th>
                                        <th className="text-right px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {/* Miniature avec fallback */}
                                                    <div className="h-12 w-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                                                        {item.media_type === 'video' || imageCassees.has(item.id) ? (
                                                            item.media_type === 'video'
                                                                ? <Video className="h-5 w-5 text-gray-400" />
                                                                : <ImageIcon className="h-5 w-5 text-gray-400" />
                                                        ) : (
                                                            <img
                                                                src={item.media_url}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                                onError={() => gererErreurMiniature(item.id)}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                                                        {item.description && (
                                                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 hidden md:table-cell">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${item.media_type === 'photo'
                                                        ? 'bg-afd-50 text-afd-700 dark:bg-afd-900/30 dark:text-afd-300'
                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {item.media_type === 'photo'
                                                        ? <><ImageIcon className="h-3 w-3" /><span>Photo</span></>
                                                        : <><Video className="h-3 w-3" /><span>Vidéo</span></>
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center hidden lg:table-cell">
                                                <span className={`inline-block w-2.5 h-2.5 rounded-full ${item.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => ouvrirEdition(item)}
                                                        className="p-2 text-afd-400 hover:bg-afd-50 dark:hover:bg-afd-900/20 rounded-lg transition-colors"
                                                        aria-label="Modifier"
                                                        title="Modifier"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setSuppressionId(item.id)}
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
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={fermerModale}
                    />
                    <div className="relative min-h-screen flex items-start justify-center py-8 px-4">
                        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl">

                            {/* En-tête modale */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {itemEnEdition ? 'Modifier le média' : 'Nouveau média'}
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

                                {/* Titre + Type sur 2 colonnes */}
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
                                            placeholder="Titre du média"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Type de média <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formulaire.media_type}
                                            onChange={e => mettreAJourChamp('media_type', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400"
                                        >
                                            <option value="photo">Photo</option>
                                            <option value="video">Vidéo</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={formulaire.description}
                                        onChange={e => mettreAJourChamp('description', e.target.value)}
                                        placeholder="Description courte (optionnel)"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400 resize-none"
                                    />
                                </div>

                                {/* Média principal : import depuis l'ordinateur ou saisie d'URL */}
                                <ImageUploader
                                    value={formulaire.media_url}
                                    onChange={(url) => mettreAJourChamp('media_url', url)}
                                    bucket="gallery"
                                    dossier="galerie"
                                    label="URL du média"
                                    required
                                />

                                {/* Miniature : import ou URL externe (ex. vignette YouTube) */}
                                <ImageUploader
                                    value={formulaire.thumbnail_url}
                                    onChange={(url) => mettreAJourChamp('thumbnail_url', url)}
                                    bucket="gallery"
                                    dossier="galerie/thumbnails"
                                    label="Miniature (optionnel — vignette pour les vidéos)"
                                />

                                {/* Actif */}
                                <div className="flex items-center space-x-3">
                                    <input
                                        id="actif_galerie"
                                        type="checkbox"
                                        checked={formulaire.active}
                                        onChange={e => mettreAJourChamp('active', e.target.checked)}
                                        className="w-4 h-4 text-afd-400 rounded border-gray-300 focus:ring-afd-400"
                                    />
                                    <label htmlFor="actif_galerie" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                        Visible sur le site public
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
                                        <span>{itemEnEdition ? 'Enregistrer' : 'Ajouter le média'}</span>
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
