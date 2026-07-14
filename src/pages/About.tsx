// =============================================================
// About.tsx — Page « À propos » de l'AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600), #EAF6FD (afd-50)
// Les dégradés d'avatar et badges de genre utilisent la palette AFD.
// La section équipe utilise le composant TeamCarousel (carousel infini).
// =============================================================

import { useEffect, useState } from 'react';
import { Target, Eye, Award, Users } from 'lucide-react';
import { supabase, queryWithRetry } from '../lib/supabase';
import { TeamMember } from '../types';
import { fallbackSettings, fallbackTeam } from '../lib/fallbackData';
import TeamCarousel from '../components/TeamCarousel';

export default function About() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [address, setAddress] = useState('Kinshasa Songololo 145');
  const [foundedYear, setFoundedYear] = useState('2019');

  useEffect(() => {
    fetchTeam();
    fetchSettings();
  }, []);

  async function fetchTeam() {
    // Diagnostic Supabase — table membres_equipe
    const { data, error } = await queryWithRetry(() =>
      supabase
        .from('membres_equipe')
        .select('*')
        .eq('active', true)
        .order('order')
    );
    console.log('[About] membres_equipe DATA:', data);
    if (error) console.error('[About] membres_equipe ERROR:', error);
    if (data && data.length > 0) {
      setTeam(data);
    } else {
      console.warn('[About] membres_equipe vide ou erreur, utilisation des données de secours');
      setTeam(fallbackTeam);
    }
  }

  async function fetchSettings() {
    // Diagnostic Supabase — table parametres_site
    const { data, error } = await queryWithRetry(() =>
      supabase
        .from('parametres_site')
        .select('*')
        .in('key', ['address', 'founded_year'])
    );
    console.log('[About] parametres_site DATA:', data);
    if (error) console.error('[About] parametres_site ERROR:', error);
    if (data && data.length > 0) {
      data.forEach((s) => {
        if (s.key === 'address') setAddress(s.value);
        if (s.key === 'founded_year') setFoundedYear(s.value);
      });
    } else {
      console.warn('[About] parametres_site vide ou erreur, utilisation des données de secours');
      if (fallbackSettings.address) setAddress(fallbackSettings.address);
      if (fallbackSettings.founded_year) setFoundedYear(fallbackSettings.founded_year);
    }
  }

  /* Valeurs fondamentales de l'AFD */
  const values = [
    {
      icon: Users,
      title: 'Solidarité',
      description: "Nous croyons en la force du collectif et en l'entraide communautaire pour construire un avenir meilleur.",
    },
    {
      icon: Award,
      title: 'Travail',
      description: "L'engagement et la persévérance sont au cœur de notre action pour un développement durable.",
    },
    {
      icon: Target,
      title: 'Égalité',
      description: "Nous luttons pour l'égalité des genres et l'autonomisation des femmes et des filles.",
    },
  ];

  /* Note : avatarGradient est maintenant géré dans TeamCarousel.tsx */

  return (
    <div>
      {/* En-tête de page — dégradé bleu AFD */}
      <section className="bg-gradient-to-br from-afd-400 to-afd-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">À propos de l'AFD</h1>
          <p className="text-xl text-afd-100 max-w-3xl">
            L'Alliance des Femmes pour le Développement œuvre depuis {foundedYear} pour l'autonomisation des femmes
            et le développement communautaire en République Démocratique du Congo
          </p>
        </div>
      </section>

      {/* Histoire de l'AFD */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Notre Histoire</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Fondée en {foundedYear} par un groupe de femmes leaders congolaises, l'Alliance des Femmes pour
                  le Développement (AFD) est née d'une vision commune : créer une société où les femmes et les filles
                  ont les mêmes opportunités que les hommes.
                </p>
                <p>
                  Dans un contexte marqué par les conflits armés, la pauvreté et les inégalités de genre, l'AFD s'est
                  donnée pour mission d'autonomiser les femmes à travers l'éducation, la formation professionnelle, et
                  l'accès aux ressources économiques.
                </p>
                <p>
                  Depuis sa création, l'AFD a touché plus de 50 000 bénéficiaires directs à travers 12 provinces de
                  la RDC. Nos programmes ont permis à des milliers de femmes de créer leurs propres entreprises,
                  d'accéder aux soins de santé, et de devenir des actrices du changement dans leurs communautés.
                </p>
                <p>
                  Aujourd'hui, l'AFD est reconnue comme l'une des organisations de référence dans le domaine de
                  l'autonomisation des femmes en RDC, travaillant en partenariat avec des organisations
                  internationales, le gouvernement, et les communautés locales.
                </p>
                {/* Encart adresse du siège */}
                <div className="mt-4 p-4 bg-afd-50 dark:bg-afd-900/20 rounded-lg flex items-start space-x-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Adresse du siège</p>
                    <p className="text-afd-600 dark:text-afd-300">{address}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">République Démocratique du Congo</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Images illustratives */}
            <div className="space-y-6">
              <div className="aspect-video rounded-xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg"
                  alt="Femmes ensemble"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg"
                    alt="Formation"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/6646914/pexels-photo-6646914.jpeg"
                    alt="Communauté"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission et Vision */}
      <section className="py-16 bg-afd-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Carte Mission */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-afd-50 dark:bg-afd-900/30 p-3 rounded-lg mr-4">
                  <Target className="h-8 w-8 text-afd-400 dark:text-afd-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notre Mission</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Autonomiser les femmes et les filles congolaises à travers des programmes intégrés d'éducation, de
                santé, d'autonomisation économique et de protection, afin qu'elles puissent réaliser leur plein
                potentiel et devenir des agents de changement dans leurs communautés.
              </p>
            </div>

            {/* Carte Vision */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-afd-50 dark:bg-afd-900/30 p-3 rounded-lg mr-4">
                  <Eye className="h-8 w-8 text-afd-400 dark:text-afd-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notre Vision</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Une société congolaise où les femmes et les filles jouissent de l'égalité des droits, ont accès aux
                opportunités économiques et sociales, vivent à l'abri de la violence, et participent pleinement
                au développement de leur pays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs fondamentales */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Nos Valeurs</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Les principes qui guident notre action</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-afd-50 dark:bg-afd-900/30 rounded-full mb-4">
                  <value.icon className="h-8 w-8 text-afd-400 dark:text-afd-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Équipe de direction — Carousel automatique infini ────── */}
      <section className="py-16 bg-afd-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête de section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Notre Équipe de Direction
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Des femmes engagées au service de la communauté
            </p>
          </div>

          {team.length > 0 ? (
            /*
             * Carousel professionnel avec défilement automatique.
             * Le composant TeamCarousel gère :
             *   - La duplication des cartes pour un rendu infini
             *   - La pause au survol / reprise à la sortie
             *   - Les effets de fondu sur les bords
             *   - La responsivité mobile / tablette / desktop
             */
            <TeamCarousel members={team} />
          ) : (
            // ── Données de secours si Supabase n'est pas connecté ──
            // Utilise aussi le carousel pour une expérience cohérente
            <TeamCarousel
              members={[
                {
                  id: 'fallback-1',
                  name: 'Marie Kabamba',
                  role: 'Présidente',
                  description: "Leader visionnaire avec 20 ans d'expérience dans le développement communautaire",
                  gender: 'femme',
                  order: 1,
                  active: true,
                  created_at: '',
                  updated_at: '',
                },
                {
                  id: 'fallback-2',
                  name: 'Jeanne Mukendi',
                  role: 'Directrice Exécutive',
                  description: 'Experte en gestion de projets humanitaires et développement durable',
                  gender: 'femme',
                  order: 2,
                  active: true,
                  created_at: '',
                  updated_at: '',
                },
                {
                  id: 'fallback-3',
                  name: 'Grace Tshilombo',
                  role: 'Coordinatrice des Programmes',
                  description: 'Spécialiste en santé maternelle et infantile',
                  gender: 'femme',
                  order: 3,
                  active: true,
                  created_at: '',
                  updated_at: '',
                },
                {
                  id: 'fallback-4',
                  name: 'Espérance Nsimba',
                  role: 'Responsable Communication',
                  description: 'Journaliste et militante pour les droits des femmes',
                  gender: 'femme',
                  order: 4,
                  active: true,
                  created_at: '',
                  updated_at: '',
                },
              ] as TeamMember[]}
            />
          )}
        </div>
      </section>

      {/* Gouvernance */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Gouvernance</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Une structure transparente et démocratique</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-afd-50 dark:bg-gray-800 rounded-xl p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Assemblée Générale</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Organe suprême composé de tous les membres, se réunit annuellement pour définir les orientations
                  stratégiques et approuver les rapports d'activités.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Conseil d'Administration</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Composé de 7 membres élus, il supervise la gestion de l'organisation et veille au respect de la
                  mission et des valeurs.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Direction Exécutive</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Assure la gestion quotidienne de l'organisation, la mise en œuvre des programmes et la coordination
                  des équipes.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Comités Techniques</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Composés d'experts dans différents domaines (santé, éducation, protection, etc.), ils apportent leur
                  expertise technique aux programmes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}




