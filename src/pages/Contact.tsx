// =============================================================
// Contact.tsx — Page de contact de l'AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600)
// Le rouge d'erreur est conservé (signalétique fonctionnelle).
// =============================================================

import { useState, FormEvent } from 'react';
import { MapPin, Phone, Mail, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
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
        .from('messages')
        .insert([formData]);

      if (submitError) throw submitError;

      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  /* Confirmation après envoi */
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-afd-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Message envoyé avec succès !
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full px-6 py-3 bg-afd-400 text-white rounded-lg hover:bg-afd-600 font-medium transition-colors"
          >
            Envoyer un autre message
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
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Contactez-nous</h1>
          <p className="text-xl text-afd-100 max-w-3xl">
            Nous sommes à votre écoute. N'hésitez pas à nous contacter pour toute question ou collaboration
          </p>
        </div>
      </section>

      {/* Formulaire et coordonnées */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Colonne coordonnées */}
            <div className="lg:col-span-1 space-y-6">
              {/* Adresse */}
              <div className="bg-afd-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-afd-100 dark:bg-afd-900/30 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-afd-400 dark:text-afd-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Adresse</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Kinshasa<br />
                      République Démocratique du Congo
                    </p>
                  </div>
                </div>
              </div>

              {/* Téléphone */}
              <div className="bg-afd-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-afd-100 dark:bg-afd-900/30 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-afd-400 dark:text-afd-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Téléphone</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      +243 XX XXX XXXX
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-afd-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-afd-100 dark:bg-afd-900/30 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-afd-400 dark:text-afd-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      contact@afd-rdc.org
                    </p>
                  </div>
                </div>
              </div>

              {/* Heures d'ouverture */}
              <div className="bg-afd-50 dark:bg-afd-900/20 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Heures d'ouverture</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Lundi - Vendredi: 8h00 - 17h00</p>
                  <p>Samedi: 9h00 - 13h00</p>
                  <p>Dimanche: Fermé</p>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="lg:col-span-2">
              <div className="bg-afd-50 dark:bg-gray-800 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Envoyez-nous un message</h2>

                {/* Message d'erreur — rouge fonctionnel conservé */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-800 dark:text-red-400">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                      />
                    </div>

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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sujet *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-afd-400 text-white rounded-lg hover:bg-afd-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
