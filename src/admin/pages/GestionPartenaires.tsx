import { useEffect, useState } from 'react';
import {
    Plus, Edit, Trash2, X, Check, AlertCircle, Loader2, Star,
} from 'lucide-react';
import { supabase, queryWithRetry } from '../../lib/supabase';
import LayoutAdmin from '../layout/LayoutAdmin';
import ImageUploader from '../composants/ImageUploader';
import { Partner } from '../../types';

type PartnerFormData = Omit<Partner, 'id' | 'created_at'>;

const formulaireVide: PartnerFormData = {
    name: '',
    logo_url: '',
    category: 'international',
    order: 0,
    active: true,
};

export default function GestionPartenaires() {
    // --- Données ---
    const [partenaires, setPartenaires] = useState<Partner[]>([]);
    const [chargement, setChargement] = useState(true);
    const [enregistrement, setEnregistrement] = useState(false);

    // --- Modale formulaire ---
    const [modaleOuverte, setModaleOuverte] = useState(false);
    const [partenaireEnEdition, setPartenaireEnEdition] = useState<Partner | null>(null);
    const [formulaire, setFormulaire] = useState<PartnerFormData>(formulaireVide);

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
            supabase.from('partenaires').select('*').order('order', { ascending: true })
        );

        if (error) {
            console.error('[GestionPartenaires] chargement ERROR:', error);
            afficherNotification('erreur', `Erreur lors du chargement : ${error.message}`);
        }
        if (data) setPartenaires(data);
        setChargement(false);
    }

    // ─── Gestion du formulaire ────────────────────────────────────────
    function ouvrirCreation() {
        setPartenaireEnEdition(null);
        setFormulaire({ ...formulaireVide, order: partenaires.length + 1 });
        setModaleOuverte(true);
    }

    function ouvrirEdition(partenaire: Partner) {
        setPartenaireEnEdition(partenaire);
        setFormulaire({
            name: partenaire.name,
            logo_url: partenaire.logo_url || '',
            category: partenaire.category,
            order: partenaire.order ?? 0,
            active: partenaire.active ?? true,
        });
        setModaleOuverte(true);
    }

    function fermerModale() {
        setModaleOuverte(false);
        setPartenaireEnEdition(null);
        setFormulaire(formulaireVide);
    }

    function mettreAJourChamp(champ: keyof PartnerFormData, valeur: string | boolean | number) {
        setFormulaire(prev => ({ ...prev, [champ]: valeur } as PartnerFormData));
    }

    // ─── Soumission ───────────────────────────────────────────────────
    async function sauvegarder(e: React.FormEvent) {
        e.preventDefault();
        setEnregistrement(true);

        const donnees = {
            name: formulaire.name.trim(),
            logo_url: formulaire.logo_url?.trim() || null,
            category: formulaire.category,
            order: Number(formulaire.order),
            active: formulaire.active,
        };

        let erreur = null;

        if (partenaireEnEdition) {
            const { error } = await supabase
                .from('partenaires')
                .update(donnees)
                .eq('id', partenaireEnEdition.id);
            erreur = error;
        } else {
            const { error } = await supabase
                .from('partenaires')
                .insert(donnees);
            erreur = error;
        }

        setEnregistrement(false);

        if (erreur) {
            afficherNotification('erreur', `Erreur : ${erreur.message}`);
        } else {
            afficherNotification('succes', partenaireEnEdition
                ? `Le partenaire a été mis à jour.`
                : `Le partenaire a été créé avec succès.`
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
            .from('partenaires')
            .delete()
            .eq('id', suppressionId);

        setSuppressionEnCours(false);
        setSuppressionId(null);

        if (error) {
            afficherNotification('erreur', `Impossible de supprimer : ${error.message}`);
        } else {
            afficherNotification('succes', 'Partenaire supprimé avec succès.');
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
                            <Star className="h-6 w-6 text-afd-400 dark:text-afd-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestion des partenaires
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Réseau et collaborateurs (bailleurs, ONG, gouvernement)
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={ouvrirCreation}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-afd-400 hover:bg-afd-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Ajouter un partenaire</span>
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
                    ) : partenaires.length === 0 ? (
                        <div className="text-center py-20">
                            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">Aucun partenaire trouvé.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="text-center px-4 py-4 font-semibold text-gray-600 dark:text-gray-300 w-16">Ordre</th>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Nom du partenaire</th>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Catégorie</th>
                                        <th className="text-center px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Statut</th>
                                        <th className="text-right px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {partenaires.map((part) => (
                                        <tr key={part.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-4 py-4 text-center font-mono text-gray-500">{part.order}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {part.logo_url ? (
                                                        <div className="p-1 bg-white border border-gray-100 rounded-lg flex-shrink-0">
                                                            <img src={part.logo_url} alt="" className="h-10 w-14 object-contain" />
                                                        </div>
                                                    ) : (
                                                        <div className="h-10 w-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                                            <Star className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{part.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600 dark:text-gray-400 hidden md:table-cell capitalize">
                                                {part.category.replace('_', ' ')}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${part.active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                    {part.active ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button onClick={() => ouvrirEdition(part)} className="p-2 text-afd-400 hover:bg-afd-50 dark:hover:bg-afd-900/20 rounded-lg">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => setSuppressionId(part.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
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
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg my-auto">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {partenaireEnEdition ? 'Modifier le partenaire' : 'Nouveau partenaire'}
                            </h3>
                            <button onClick={fermerModale} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={sauvegarder} className="px-6 py-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nom du partenaire <span className="text-red-500">*</span></label>
                                <input type="text" required value={formulaire.name} onChange={e => mettreAJourChamp('name', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Catégorie <span className="text-red-500">*</span></label>
                                    <select value={formulaire.category} onChange={e => mettreAJourChamp('category', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 capitalize">
                                        <option value="international">International</option>
                                        <option value="gouvernement">Gouvernement</option>
                                        <option value="ong">ONG</option>
                                        <option value="privé">Privé</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ordre d'affichage</label>
                                    <input type="number" required value={formulaire.order} onChange={e => mettreAJourChamp('order', Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent" />
                                </div>
                            </div>

                            <ImageUploader
                                value={formulaire.logo_url ?? ''}
                                onChange={(url) => mettreAJourChamp('logo_url', url)}
                                bucket="gallery"
                                dossier="partenaires"
                                label="Logo du partenaire"
                            />

                            <div className="flex items-center space-x-3 pt-2">
                                <input id="active_part" type="checkbox" checked={formulaire.active} onChange={e => mettreAJourChamp('active', e.target.checked)} className="w-4 h-4 text-afd-400 rounded cursor-pointer" />
                                <label htmlFor="active_part" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Afficher le partenaire sur le site</label>
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
                            <div><h4 className="text-lg font-bold dark:text-white">Confirmer</h4><p className="text-sm text-gray-500">Action irréversible.</p></div>
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
