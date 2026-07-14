import { useEffect, useState } from 'react';
import {
    Check, AlertCircle, Loader2, Users, CheckCircle, XCircle, Info
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LayoutAdmin from '../layout/LayoutAdmin';
import { Member } from '../../types';

export default function GestionMembres() {
    // --- Données ---
    const [membres, setMembres] = useState<Member[]>([]);
    const [chargement, setChargement] = useState(true);

    // --- Detail Modale ---
    const [membreSelectionne, setMembreSelectionne] = useState<Member | null>(null);

    // --- Action en cours ---
    const [actionEnCours, setActionEnCours] = useState<string | null>(null); // stocke l'ID du membre en cours de modif

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
            .from('membres')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[GestionMembres] chargement ERROR:', error);
            afficherNotification('erreur', `Erreur lors du chargement : ${error.message}`);
        }
        if (data) setMembres(data);
        setChargement(false);
    }

    // ─── Actions sur les membres ──────────────────────────────────────
    async function changerStatut(id: string, nouveauStatut: 'approved' | 'rejected') {
        setActionEnCours(id);

        const { error } = await supabase
            .from('membres')
            .update({ status: nouveauStatut })
            .eq('id', id);

        setActionEnCours(null);

        if (error) {
            afficherNotification('erreur', `Erreur lors du changement de statut : ${error.message}`);
        } else {
            afficherNotification('succes', `Le statut a été mis à jour avec succès.`);
            // Mise à jour locale sans recharger toute la liste
            setMembres(prev =>
                prev.map(m => m.id === id ? { ...m, status: nouveauStatut } : m)
            );
            if (membreSelectionne?.id === id) {
                setMembreSelectionne(prev => prev ? { ...prev, status: nouveauStatut } : null);
            }
        }
    }

    function afficherNotification(type: 'succes' | 'erreur', message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    function formaterDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    // ─── Rendu ────────────────────────────────────────────────────────
    return (
        <LayoutAdmin>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* En-tête */}
                <div className="flex items-center space-x-3">
                    <div className="bg-afd-50 dark:bg-afd-900/30 p-3 rounded-xl">
                        <Users className="h-6 w-6 text-afd-400 dark:text-afd-300" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Gestion des membres
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Demandes d'adhésion et sympathisants
                        </p>
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

                {/* Tableau */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {chargement ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 text-afd-400 animate-spin" />
                        </div>
                    ) : membres.length === 0 ? (
                        <div className="text-center py-20">
                            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">Aucun membre ou demande d'adhésion.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Nom complet</th>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Contact</th>
                                        <th className="text-left px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Type</th>
                                        <th className="text-center px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Statut</th>
                                        <th className="text-right px-5 py-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {membres.map((membre) => (
                                        <tr key={membre.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 dark:text-white">{membre.full_name}</span>
                                                    <span className="text-xs text-gray-500 capitalize">{membre.gender}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                                                <div className="flex flex-col">
                                                    <span>{membre.email}</span>
                                                    <span className="text-xs font-mono">{membre.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 capitalize text-gray-600 dark:text-gray-400">
                                                <span className={`px-2 py-1 text-xs rounded-md ${membre.member_type === 'adherent' ? 'bg-afd-50 text-afd-600 dark:bg-afd-900/30 dark:text-afd-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                    {membre.member_type}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-center">
                                                    {membre.status === 'pending' && <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">En attente</span>}
                                                    {membre.status === 'approved' && <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Approuvé</span>}
                                                    {membre.status === 'rejected' && <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Rejeté</span>}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button onClick={() => setMembreSelectionne(membre)} className="p-2 text-gray-500 hover:text-afd-400 hover:bg-afd-50 dark:hover:bg-afd-900/20 rounded-lg transition-colors" title="Voir les détails">
                                                        <Info className="h-4 w-4" />
                                                    </button>
                                                    {membre.status !== 'approved' && (
                                                        <button
                                                            disabled={actionEnCours === membre.id}
                                                            onClick={() => changerStatut(membre.id, 'approved')}
                                                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg disabled:opacity-50"
                                                            title="Approuver"
                                                        >
                                                            {actionEnCours === membre.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                                        </button>
                                                    )}
                                                    {membre.status !== 'rejected' && (
                                                        <button
                                                            disabled={actionEnCours === membre.id}
                                                            onClick={() => changerStatut(membre.id, 'rejected')}
                                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50"
                                                            title="Rejeter"
                                                        >
                                                            {actionEnCours === membre.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                                        </button>
                                                    )}
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

            {/* Modale Détails */}
            {membreSelectionne && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMembreSelectionne(null)} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
                        <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Détails de la demande</h3>
                                <p className="text-sm text-gray-500">Soumise le {formaterDate(membreSelectionne.created_at)}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${membreSelectionne.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    membreSelectionne.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                }`}>
                                {membreSelectionne.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Nom complet</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{membreSelectionne.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Genre</p>
                                    <p className="font-medium text-gray-900 dark:text-white capitalize">{membreSelectionne.gender}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{membreSelectionne.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Téléphone</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{membreSelectionne.phone}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Adresse</p>
                                <p className="font-medium text-gray-900 dark:text-white">{membreSelectionne.address}</p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Motivation</p>
                                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{membreSelectionne.motivation}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button onClick={() => setMembreSelectionne(null)} className="px-5 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                Fermer
                            </button>
                            {membreSelectionne.status === 'pending' && (
                                <>
                                    <button
                                        disabled={actionEnCours !== null}
                                        onClick={() => changerStatut(membreSelectionne.id, 'rejected')}
                                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg disabled:opacity-50 transition-colors"
                                    >
                                        Rejeter
                                    </button>
                                    <button
                                        disabled={actionEnCours !== null}
                                        onClick={() => changerStatut(membreSelectionne.id, 'approved')}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                                    >
                                        Approuver
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </LayoutAdmin>
    );
}
