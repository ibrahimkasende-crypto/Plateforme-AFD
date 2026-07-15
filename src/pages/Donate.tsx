// =============================================================
// Donate.tsx — Page de don de l'AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600)
// Le vert de succès est conservé (signalétique fonctionnelle).
// =============================================================

import { useState, FormEvent } from 'react';
import { Heart, CreditCard, Smartphone, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Donate() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'CDF'>('USD');
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [donorInfo, setDonorInfo] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /* Montants prédéfinis selon la devise */
  const presetAmounts = currency === 'USD'
    ? [10, 25, 50, 100, 250, 500]
    : [10000, 25000, 50000, 100000, 250000, 500000];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('dons')
        .insert([{
          ...donorInfo,
          amount: parseFloat(amount),
          currency,
          payment_method: paymentMethod,
          // Aucun prestataire de paiement n'est connecté : il s'agit exclusivement
          // d'une intention de don à traiter par l'organisation.
          status: 'pending',
        }]);

      if (error) throw error;

      setIsSuccess(true);
      setAmount('');
      setDonorInfo({ donor_name: '', donor_email: '', donor_phone: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  /* Confirmation de don */
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-afd-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Votre intention de don a bien été reçue.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Aucun paiement n’a été confirmé sur le site. L’AFD vous contactera pour vous transmettre les modalités de contribution.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full px-6 py-3 bg-afd-400 text-white rounded-lg hover:bg-afd-600 font-medium transition-colors"
          >
            Faire un autre don
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
            <Heart className="h-12 w-12" fill="white" />
            <h1 className="text-4xl lg:text-5xl font-bold">Faire un Don</h1>
          </div>
          <p className="text-xl text-afd-100 max-w-3xl">
            Votre soutien nous permet de continuer notre mission d'autonomisation des femmes et de transformation des communautés
          </p>
        </div>
      </section>

      {/* Formulaire de don */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Exemples d'impact des dons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-afd-50 dark:bg-afd-900/20 rounded-xl">
              <div className="text-3xl font-bold text-afd-400 dark:text-afd-300 mb-2">$25</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Finance un kit scolaire complet pour une fille</p>
            </div>
            <div className="text-center p-6 bg-afd-50 dark:bg-afd-900/20 rounded-xl">
              <div className="text-3xl font-bold text-afd-400 dark:text-afd-300 mb-2">$50</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Permet à une femme de suivre une formation professionnelle</p>
            </div>
            <div className="text-center p-6 bg-afd-50 dark:bg-afd-900/20 rounded-xl">
              <div className="text-3xl font-bold text-afd-400 dark:text-afd-300 mb-2">$100</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Soutient le lancement d'une micro-entreprise</p>
            </div>
          </div>

          <div className="bg-afd-50 dark:bg-gray-800 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Sélection de la devise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Devise
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => { setCurrency('USD'); setAmount(''); }}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                      currency === 'USD'
                        ? 'bg-afd-400 text-white'
                        : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCurrency('CDF'); setAmount(''); }}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                      currency === 'CDF'
                        ? 'bg-afd-400 text-white'
                        : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    CDF (FC)
                  </button>
                </div>
              </div>

              {/* Sélection du montant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Montant
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset.toString())}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                        amount === preset.toString()
                          ? 'bg-afd-400 text-white'
                          : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-afd-400'
                      }`}
                    >
                      {currency === 'USD' ? '$' : 'FC '}{preset.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    {currency === 'USD' ? '$' : 'FC'}
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Montant personnalisé"
                    className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Méthode de paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Méthode de paiement
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'mobile_money'
                        ? 'border-afd-400 bg-afd-50 dark:bg-afd-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
                    }`}
                  >
                    <Smartphone className={`h-8 w-8 mb-2 ${
                      paymentMethod === 'mobile_money' ? 'text-afd-400 dark:text-afd-300' : 'text-gray-400'
                    }`} />
                    <span className="font-medium text-gray-900 dark:text-white">Mobile Money</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">M-Pesa, Airtel Money</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-afd-400 bg-afd-50 dark:bg-afd-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
                    }`}
                  >
                    <CreditCard className={`h-8 w-8 mb-2 ${
                      paymentMethod === 'card' ? 'text-afd-400 dark:text-afd-300' : 'text-gray-400'
                    }`} />
                    <span className="font-medium text-gray-900 dark:text-white">Carte bancaire</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Visa, Mastercard</span>
                  </button>
                </div>
              </div>

              {/* Informations du donateur */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="donor_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="donor_name"
                    required
                    value={donorInfo.donor_name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, donor_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="donor_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="donor_email"
                    required
                    value={donorInfo.donor_email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, donor_email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="donor_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="donor_phone"
                    value={donorInfo.donor_phone}
                    onChange={(e) => setDonorInfo({ ...donorInfo, donor_phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-afd-400 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Bouton de finalisation */}
              <button
                type="submit"
                disabled={isSubmitting || !amount}
                className="w-full px-6 py-4 bg-afd-400 text-white rounded-lg hover:bg-afd-600 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Heart className="h-5 w-5" fill="white" />
                <span>{isSubmitting ? 'Enregistrement...' : 'Envoyer mon intention de don'}</span>
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Votre demande est traitée de manière confidentielle. Aucun paiement ne sera prélevé depuis ce formulaire.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
