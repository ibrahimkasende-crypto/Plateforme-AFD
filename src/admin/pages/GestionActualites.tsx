import { useEffect, useState } from 'react';
import {
    Plus, Edit, Trash2, X, Check, AlertCircle, Loader2, Newspaper, Calendar
} from 'lucide-react';
import { supabase, queryWithRetry } from '../../lib/supabase';
import LayoutAdmin from '../layout/LayoutAdmin';
import ImageUploader from '../composants/ImageUploader';
import { News } from '../../types';

type NewsFormData = Omit<News, 'id' | 'created_at' | 'updated_at'>;

const formulaireVide: NewsFormData = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'article',
    image_url: '',
    published: false,
    published_at: new Date().toISOString().split('T')[0], // Par défaut aujourd'hui
    author: 'Admin AFD',
};

export default function GestionActualites() {
    // --- Données ---
    const [actualites, setActualites] = useState<News[]>([]);
    const [chargement, setChargement] = useState(true);
    const [enregistrement, setEnregistrement] = useState(false);

    // --- Modale formulaire ---
    const [modaleOuverte, setModaleOuverte] = useState(false);
    const [actuEnEdition, setActuEnEdition] = useState<News | null>(null);
    const [formulaire, setFormulaire] = useState<NewsFormData>(formulaireVide);

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
        const { data, error } = await queryWithRetry(() =>
            supabase.from('actualites').select('*').order('published_at', { ascending: false })
        );

        if (error) {
            console.error('[GestionActualites] chargement ERROR:', error);
            afficherNotification('erreur', `Erreur lors du chargement : ${error.message}`);
        }
        if (data) setActualites(data);
        setChargement(false);
    }

    // ─── Gestion du formulaire ────────────────────────────────────────
    function ouvrirCreation() {
        setActuEnEdition(null);
        setFormulaire(formulaireVide);
        setModaleOuverte(true);
    }

    function ouvrirEdition(actu: News) {
        setActuEnEdition(actu);
        setFormulaire({
            title: actu.title,
            slug: actu.slug,
            excerpt: actu.excerpt,
            content: actu.content,
            category: actu.category,
            image_url: actu.image_url || '',
            published: actu.published,
            published_at: actu.published_at ? actu.published_at.split('T')[0] : '',
            author: actu.author || 'Admin AFD',
        });
        setModaleOuverte(true);
    }

    function fermerModale() {
        setModaleOuverte(false);
        setActuEnEdition(null);
        setFormulaire(formulaireVide);
    }

    function genererSlug(titre: string): string {
        return titre
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function mettreAJourChamp(champ: keyof NewsFormData, valeur: string | boolean) {
        setFormulaire(prev => {
            const nouvel = { ...prev, [champ]: valeur } as NewsFormData;
            if (champ === 'title' && !actuEnEdition) {
                nouvel.slug = genererSlug(valeur as string);
            }
            return nouvel;
        });
    }

    // ─── Soumission ───────────────────────────────────────────────────
    async function sauvegarder(e: React.FormEvent) {
        e.preventDefault();
        setEnregistrement(true);

        const donnees = {
            title: formulaire.title.trim(),
            slug: formulaire.slug.trim(),
            excerpt: formulaire.excerpt.trim(),
            content: formulaire.content.trim(),
            category: formulaire.category,
            image_url: formulaire.image_url?.trim() || null,
            published: formulaire.published,
            published_at: formulaire.published ? new Date(formulaire.published_at!).toISOString() : null,
            author: formulaire.author.trim(),
            updated_at: new Date().toISOString(),
        };

        let erreur = null;

        if (actuEnEdition) {
            const { error } = await supabase
                .from('actualites')
                .update(donnees)
                .eq('id', actuEnEdition.id);
            erreur = error;
        } else {
            const { error } = await supabase
                .from('actualites')
                .insert(donnees);
            erreur = error;
        }

        setEnregistrement(false);

        if (erreur) {
            afficherNotification('erreur', `Erreur : ${erreur.message}`);
        } else {
            afficherNotification('succes', actuEnEdition
                ? `L'actualité a été mise à jour.`
                : `L'actualité a été créée avec succès.`
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
            .from('actualites')
            .delete()
            .eq('id', suppressionId);

        setSuppressionEnCours(false);
        setSuppressionId(null);

        if (error) {
            afficherNotification('erreur', `Impossible de supprimer : ${error.message}`);
        } else {
            afficherNotification('succes', 'Actualité supprimée avec succès.');
            chargerDonnees();
        }
    }

    function afficherNotification(type: 'succes' | 'erreur', message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    function formaterDate(dateString: string | undefined) {
        if (!dateString) return 'Non définie';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    }

    // ─── Rendu ────────────────────────────────────────────────────────
    return (
        <LayoutAdmin>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-afd-50 dark:bg-afd-900/30 p-3 rounded-xl">
                            <Newspaper className="h-6 w-6 text-afd-400 dark:text-afd-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestion des actualités
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Articles, événements et communiqués
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={ouvrirCreation}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-afd-400 hover:bg-afd-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Rédiger un article</span>
                    </button>
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

                {/* Tableau */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {chargement ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 text-afd-400 animate-spin" />
                        </div>
                    ) : actualites.length === 0 ? (
                        <div className="text-center py-20">
                            <Newspaper className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">Aucune actualité trouvée.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Titre</th>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Catégorie</th>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Date de publication</th>
                                        <th className="text-center px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Statut</th>
                                        <th className="text-right px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {actualites.map((actu) => (
                                        <tr key={actu.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {actu.image_url ? (
                                                        <img src={actu.image_url} alt="" className="h-10 w-10 rounded object-cover flex-shrink-0" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                                            <Newspaper className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{actu.title}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 xl:hidden capitalize">{actu.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600 dark:text-gray-400 hidden md:table-cell capitalize">
                                                {actu.category}
                                            </td>
                                            <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center space-x-1.5">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span>{formaterDate(actu.published_at)}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${actu.published ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                    {actu.published ? 'Publiée' : 'Brouillon'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button onClick={() => ouvrirEdition(actu)} className="p-2 text-afd-400 hover:bg-afd-50 dark:hover:bg-afd-900/20 rounded-lg">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => setSuppressionId(actu.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
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

            {/* Modale */}
            {modaleOuverte && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={fermerModale} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl my-auto">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {actuEnEdition ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
                            </h3>
                            <button onClick={fermerModale} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={sauvegarder} className="px-6 py-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Titre <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formulaire.title} onChange={e => mettreAJourChamp('title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slug <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formulaire.slug} onChange={e => mettreAJourChamp('slug', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent font-mono text-sm text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Catégorie <span className="text-red-500">*</span></label>
                                    <select value={formulaire.category} onChange={e => mettreAJourChamp('category', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                        <option value="article">Article</option>
                                        <option value="communique">Communiqué</option>
                                        <option value="evenement">Événement</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Extrait court <span className="text-red-500">*</span></label>
                                <textarea required rows={2} value={formulaire.excerpt} onChange={e => mettreAJourChamp('excerpt', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent" placeholder="Description courte affichée sur la page d'accueil" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contenu complet <span className="text-red-500">*</span></label>
                                <textarea required rows={8} value={formulaire.content} onChange={e => mettreAJourChamp('content', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent font-sans text-sm" placeholder="Contenu de votre article (le HTML ou Markdown basique peut être supporté selon le rendu front)" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <ImageUploader
                                        value={formulaire.image_url ?? ''}
                                        onChange={(url) => mettreAJourChamp('image_url', url)}
                                        bucket="gallery"
                                        dossier="actualites"
                                        label="Image de l'actualité"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Auteur</label>
                                    <input type="text" value={formulaire.author} onChange={e => mettreAJourChamp('author', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent" />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <input id="published_actu" type="checkbox" checked={formulaire.published} onChange={e => mettreAJourChamp('published', e.target.checked)} className="w-5 h-5 text-afd-400 rounded cursor-pointer" />
                                    <label htmlFor="published_actu" className="text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer">Publier sur le site public</label>
                                </div>
                                <div className="flex items-center space-x-3 px-4 border-l border-gray-300 dark:border-gray-600">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Date de publication :</label>
                                    <input type="date" value={formulaire.published_at} onChange={e => mettreAJourChamp('published_at', e.target.value)} disabled={!formulaire.published} className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm disabled:opacity-50" />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button type="button" onClick={fermerModale} className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">Annuler</button>
                                <button type="submit" disabled={enregistrement} className="px-6 py-2.5 bg-afd-400 hover:bg-afd-600 text-white font-semibold rounded-lg flex items-center">
                                    {enregistrement && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Suppression Modale */}
            {suppressionId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSuppressionId(null)} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl"><Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" /></div>
                            <div><h4 className="text-lg font-bold dark:text-white">Confirmer</h4><p className="text-sm text-gray-500">Voulez-vous vraiment supprimer cet article ?</p></div>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => setSuppressionId(null)} className="flex-1 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">Annuler</button>
                            <button onClick={confirmerSuppression} disabled={suppressionEnCours} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex justify-center items-center font-medium">
                                {suppressionEnCours && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </LayoutAdmin>
    );
}
