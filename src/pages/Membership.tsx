// =============================================================
// Membership.tsx — Formulaire d'adhésion à l'AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600)
// Le rouge d'erreur est conservé (signalétique fonctionnelle).
// =============================================================

import { useState, FormEvent } from 'react';
import { UserPlus, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Membership() {
  const [formData, setFormData] = useState({
    full_name: '',
    gender: 'femme',
    email: '',
    phone: '',
    address: '',
    motivation: '',
    member_type: 'adherent',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('membres')
        .insert([formData]);

      if (submitError) throw submitError;

      setIsSuccess(true);
      setFormData({
        full_name: '',
        gender: 'femme',
        email: '',
        phone: '',
        address: '',
        motivation: '',
        member_type: 'adherent',
      });
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  /* Confirmation d'envoi */
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-afd-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Demande envoyée avec succès !
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Merci pour votre intérêt à rejoindre l'AFD. Nous examinerons votre candidature et vous contacterons sous peu.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full px-6 py-3 bg-afd-400 text-white rounded-lg hover:bg-afd-600 font-medium transition-colors"
          >
            Soumettre une autre demande
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête de page */}
      <section className="bg-gradient-to-br from-afd-400 to-afd-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-6">
            <UserPlus className="h-12 w-12" />
            <h1 className="text-4xl lg:text-5xl font-bold">Devenir Membre</h1>
          </div>
          <p className="text-xl text-afd-100 max-w-3xl">
            Rejoignez notre communauté de femmes engagées pour le développement durable en RDC
          </p>
        </div>
      </section>

      {/* Types de membres et formulaire */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Présentation des types de membres */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-afd-50 dark:bg-afd-900/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Adhérent</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Participez activement à nos programmes et bénéficiez de formations, du réseau et du soutien de l'AFD
              </p>
            </div>
            <div className="bg-afd-50 dark:bg-afd-900/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sympathisant</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Soutenez notre mission sans engagement actif. Recevez nos actualités et participez aux événements
              </p>
            </div>
            <div className="bg-afd-50 dark:bg-afd-900/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Avantages</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Accès aux formations, réseau professionnel, opportunités d'engagement, et impact direct dans votre communauté
              </p>
            </div>
          </div>

          {/* Formulaire d'adhésion */}
          <div className="bg-afd-50 dark:bg-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Formulaire d'adhésion</h2>

            {/* Message d'erreur — rouge fonctionnel conservé */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sexe *
                </label>
                <select
                  id="gender"
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                >
                  <option value="femme">Femme</option>
                  <option value="homme">Homme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="member_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de membre *
                </label>
                <select
                  id="member_type"
                  required
                  value={formData.member_type}
                  onChange={(e) => setFormData({ ...formData, member_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                >
                  <option value="adherent">Adhérent</option>
                  <option value="sympathisant">Sympathisant</option>
                </select>
              </div>

              <div>
                <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motivation *
                </label>
                <textarea
                  id="motivation"
                  required
                  rows={5}
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  placeholder="Expliquez pourquoi vous souhaitez rejoindre l'AFD et comment vous pensez contribuer à notre mission..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-afd-400 text-white rounded-lg hover:bg-afd-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre ma candidature'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
