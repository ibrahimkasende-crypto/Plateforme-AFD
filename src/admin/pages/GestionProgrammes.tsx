import { useEffect, useState } from 'react';
import {
    Plus, Edit, Trash2, X, Check, AlertCircle, Loader2, Layers
} from 'lucide-react';
import { supabase, queryWithRetry } from '../../lib/supabase';
import LayoutAdmin from '../layout/LayoutAdmin';
import ImageUploader from '../composants/ImageUploader';
import { Program } from '../../types';

// Omit the fields we don't manage in the form directly (like id, timestamps)
type ProgramFormData = Omit<Program, 'id' | 'created_at' | 'updated_at'>;

const formulaireVide: ProgramFormData = {
    title: '',
    slug: '',
    description: '',
    long_description: '',
    icon: 'Layers', // Default icon string
    color: '#0284C7', // Default Sky blue
    order: 0,
    active: true,
    image_url: '',
};

export default function GestionProgrammes() {
    // --- Données ---
    const [programmes, setProgrammes] = useState<Program[]>([]);
    const [chargement, setChargement] = useState(true);
    const [enregistrement, setEnregistrement] = useState(false);

    // --- Modale formulaire ---
    const [modaleOuverte, setModaleOuverte] = useState(false);
    const [programmeEnEdition, setProgrammeEnEdition] = useState<Program | null>(null);
    const [formulaire, setFormulaire] = useState<ProgramFormData>(formulaireVide);

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
            supabase.from('programmes').select('*').order('order', { ascending: true })
        );

        if (error) {
            console.error('[GestionProgrammes] chargement ERROR:', error);
            afficherNotification('erreur', `Erreur lors du chargement : ${error.message}`);
        }
        if (data) setProgrammes(data);
        setChargement(false);
    }

    // ─── Gestion du formulaire ────────────────────────────────────────
    function ouvrirCreation() {
        setProgrammeEnEdition(null);
        setFormulaire({ ...formulaireVide, order: programmes.length + 1 });
        setModaleOuverte(true);
    }

    function ouvrirEdition(programme: Program) {
        setProgrammeEnEdition(programme);
        setFormulaire({
            title: programme.title,
            slug: programme.slug,
            description: programme.description,
            long_description: programme.long_description || '',
            icon: programme.icon || 'Layers',
            color: programme.color || '#0284C7',
            order: programme.order ?? 0,
            active: programme.active ?? true,
            image_url: programme.image_url || '',
        });
        setModaleOuverte(true);
    }

    function fermerModale() {
        setModaleOuverte(false);
        setProgrammeEnEdition(null);
        setFormulaire(formulaireVide);
    }

    function genererSlug(titre: string): string {
        return titre
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function mettreAJourChamp(champ: keyof ProgramFormData, valeur: string | boolean | number) {
        setFormulaire(prev => {
            const nouvel = { ...prev, [champ]: valeur } as ProgramFormData;
            if (champ === 'title' && !programmeEnEdition) {
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
            description: formulaire.description.trim(),
            long_description: formulaire.long_description?.trim() || null,
            icon: formulaire.icon.trim(),
            color: formulaire.color.trim(),
            order: Number(formulaire.order),
            active: formulaire.active,
            image_url: formulaire.image_url?.trim() || null,
            updated_at: new Date().toISOString(),
        };

        let erreur = null;

        if (programmeEnEdition) {
            const { error } = await supabase
                .from('programmes')
                .update(donnees)
                .eq('id', programmeEnEdition.id);
            erreur = error;
        } else {
            const { error } = await supabase
                .from('programmes')
                .insert(donnees);
            erreur = error;
        }

        setEnregistrement(false);

        if (erreur) {
            afficherNotification('erreur', `Erreur : ${erreur.message}`);
        } else {
            afficherNotification('succes', programmeEnEdition
                ? `Le programme a été mis à jour.`
                : `Le programme a été créé avec succès.`
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
            .from('programmes')
            .delete()
            .eq('id', suppressionId);

        setSuppressionEnCours(false);
        setSuppressionId(null);

        if (error) {
            afficherNotification('erreur', `Impossible de supprimer : ${error.message}`);
        } else {
            afficherNotification('succes', 'Programme supprimé avec succès.');
            chargerDonnees();
        }
    }

    function afficherNotification(type: 'succes' | 'erreur', message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    // ─── Rendu ────────────────────────────────────────────────────────
    return (
        <LayoutAdmin>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-afd-50 dark:bg-afd-900/30 p-3 rounded-xl">
                            <Layers className="h-6 w-6 text-afd-400 dark:text-afd-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestion des programmes
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Domaines d'intervention principaux
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={ouvrirCreation}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-afd-400 hover:bg-afd-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Ajouter un programme</span>
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
                    ) : programmes.length === 0 ? (
                        <div className="text-center py-20">
                            <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">Aucun programme trouvé.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="text-center px-4 py-4 font-semibold text-gray-600 dark:text-gray-300 w-16">Ordre</th>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Titre</th>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Description</th>
                                        <th className="text-center px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Statut</th>
                                        <th className="text-right px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {programmes.map((prog) => (
                                        <tr key={prog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-4 py-4 text-center font-mono text-gray-500">{prog.order}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: prog.color }} />
                                                    <p className="font-medium text-gray-900 dark:text-white">{prog.title}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600 dark:text-gray-400 hidden md:table-cell line-clamp-1 max-w-xs">
                                                {prog.description}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${prog.active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                    {prog.active ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button onClick={() => ouvrirEdition(prog)} className="p-2 text-afd-400 hover:bg-afd-50 dark:hover:bg-afd-900/20 rounded-lg">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => setSuppressionId(prog.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
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
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl my-auto">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {programmeEnEdition ? 'Modifier le programme' : 'Nouveau programme'}
                            </h3>
                            <button onClick={fermerModale} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={sauvegarder} className="px-6 py-6 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Titre <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formulaire.title} onChange={e => mettreAJourChamp('title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slug <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formulaire.slug} onChange={e => mettreAJourChamp('slug', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent font-mono text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description courte <span className="text-red-500">*</span></label>
                                <textarea required rows={2} value={formulaire.description} onChange={e => mettreAJourChamp('description', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description complète</label>
                                <textarea rows={4} value={formulaire.long_description} onChange={e => mettreAJourChamp('long_description', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Couleur (Hex)</label>
                                    <div className="flex space-x-2">
                                        <input type="color" value={formulaire.color} onChange={e => mettreAJourChamp('color', e.target.value)} className="h-10 w-10 rounded border" />
                                        <input type="text" value={formulaire.color} onChange={e => mettreAJourChamp('color', e.target.value)} className="flex-1 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent font-mono" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nom Icône (Lucide)</label>
                                    <input type="text" value={formulaire.icon} onChange={e => mettreAJourChamp('icon', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ordre d'affichage</label>
                                    <input type="number" required value={formulaire.order} onChange={e => mettreAJourChamp('order', Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent" />
                                </div>
                            </div>
                            <ImageUploader
                                value={formulaire.image_url || ''}
                                onChange={(url) => mettreAJourChamp('image_url', url)}
                                bucket="gallery"
                                dossier="programmes"
                                label="Image du programme"
                            />
                            <div className="flex items-center space-x-3 pt-2">
                                <input id="actif_prog" type="checkbox" checked={formulaire.active} onChange={e => mettreAJourChamp('active', e.target.checked)} className="w-4 h-4 text-afd-400 rounded" />
                                <label htmlFor="actif_prog" className="text-sm font-medium text-gray-700 dark:text-gray-300">Programme actif</label>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button type="button" onClick={fermerModale} className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
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
                    <div className="fixed inset-0 bg-black/60" onClick={() => setSuppressionId(null)} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-red-100 p-3 rounded-xl"><Trash2 className="h-6 w-6 text-red-600" /></div>
                            <div><h4 className="text-lg font-bold dark:text-white">Confirmer</h4><p className="text-sm text-gray-500">Action irréversible.</p></div>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => setSuppressionId(null)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Annuler</button>
                            <button onClick={confirmerSuppression} disabled={suppressionEnCours} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex justify-center items-center">
                                {suppressionEnCours && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </LayoutAdmin>
    );
}
