// =============================================================
// Clusters.tsx — Page des clusters et groupes de travail AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600), #EAF6FD (afd-50)
// Les dégradés de cartes utilisent des nuances de la palette AFD
// au lieu de couleurs hétérogènes (pink, rose, orange, etc.).
// =============================================================

import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { supabase, queryWithRetry } from '../lib/supabase';
import { Cluster } from '../types';

export default function ClustersPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [workingGroups, setWorkingGroups] = useState<Cluster[]>([]);

  useEffect(() => {
    fetchClusters();
  }, []);

  async function fetchClusters() {
    const { data, error } = await queryWithRetry(() =>
      supabase.from('clusters').select('*').eq('active', true).order('order')
    );
    if (error) console.error('[Clusters] clusters ERROR:', error);
    if (data) {
      setClusters(data.filter((c) => c.type === 'cluster'));
      setWorkingGroups(data.filter((c) => c.type === 'working_group'));
    }
  }

  /* Dégradés de couleurs pour les clusters — nuances AFD uniquement */
  const clusterColors = [
    'from-afd-400 to-afd-600',
    'from-afd-500 to-afd-700',
    'from-afd-300 to-afd-500',
    'from-afd-600 to-afd-800',
    'from-afd-400 to-afd-700',
  ];

  /* Dégradés pour les groupes de travail — nuances AFD */
  const gtColors = [
    'from-afd-500 to-afd-700',
    'from-afd-400 to-afd-600',
    'from-afd-600 to-afd-800',
  ];

  /** Convertit un nom d'icône kebab-case en composant Lucide */
  function getIconComponent(iconName: string): React.ElementType {
    const nomCompose = iconName
      .split('-')
      .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w.charAt(0).toUpperCase() + w.slice(1)))
      .join('');
    return ((Icons as Record<string, unknown>)[nomCompose] as LucideIcon | undefined) || Icons.Users;
  }

  return (
    <div>
      {/* En-tête de page — dégradé AFD */}
      <section className="bg-gradient-to-br from-afd-400 to-afd-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Clusters & Groupes de Travail</h1>
          <p className="text-xl text-afd-100 max-w-3xl">
            L'AFD participe activement aux mécanismes de coordination humanitaire en RDC à travers les clusters
            sectoriels et les groupes de travail thématiques.
          </p>
        </div>
      </section>

      {/* Description introductive */}
      <section className="py-12 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Dans le cadre de la réponse humanitaire coordonnée en République Démocratique du Congo, l'AFD co-anime
              et participe à plusieurs clusters sectoriels et groupes de travail, assurant une coordination efficace
              des interventions humanitaires sur le terrain.
            </p>
          </div>
        </div>
      </section>

      {/* Grille des clusters sectoriels */}
      <section className="py-16 bg-afd-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Clusters sectoriels
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Coordination sectorielle de la réponse humanitaire
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clusters.map((cluster, index) => {
              const IconComponent = getIconComponent(cluster.icon);
              const grad = clusterColors[index % clusterColors.length];
              return (
                <div
                  key={cluster.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className={`bg-gradient-to-br ${grad} p-6 flex items-center space-x-4`}>
                    <div className="bg-white/20 rounded-xl p-3">
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{cluster.name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-400">
                      {cluster.description || 'Coordination des interventions sectorielles dans les zones humanitaires de la RDC.'}
                    </p>
                    {/* Badge « Cluster actif » — palette AFD */}
                    <div className="mt-4 inline-flex items-center px-3 py-1.5 bg-afd-50 dark:bg-afd-900/30 rounded-full">
                      <span className="text-xs font-semibold text-afd-600 dark:text-afd-300">Cluster actif</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Données de secours si aucune donnée Supabase */}
            {clusters.length === 0 && [
              { name: 'Cluster Protection', icon: 'Shield', desc: 'Coordination des interventions de protection des civils, des femmes et des enfants dans les zones de crise.' },
              { name: 'Cluster Santé', icon: 'HeartPulse', desc: 'Coordination des services de santé d\'urgence, y compris la santé reproductive et maternelle.' },
              { name: 'Cluster Éducation', icon: 'BookOpen', desc: 'Coordination des activités d\'éducation en situations d\'urgence.' },
              { name: 'Cluster WASH', icon: 'Droplet', desc: 'Coordination des interventions eau, hygiène et assainissement dans les zones affectées.' },
              { name: 'Cluster Nutrition', icon: 'Apple', desc: 'Coordination de la réponse nutritionnelle pour lutter contre la malnutrition aiguë sévère.' },
            ].map((c, i) => {
              const IconComponent = ((Icons as Record<string, unknown>)[c.icon] as LucideIcon | undefined) || Icons.Users;
              return (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <div className={`bg-gradient-to-br ${clusterColors[i]} p-6 flex items-center space-x-4`}>
                    <div className="bg-white/20 rounded-xl p-3">
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{c.name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-400">{c.desc}</p>
                    <div className="mt-4 inline-flex items-center px-3 py-1.5 bg-afd-50 dark:bg-afd-900/30 rounded-full">
                      <span className="text-xs font-semibold text-afd-600 dark:text-afd-300">Cluster actif</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grille des groupes de travail */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Groupes de Travail (GT)
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Coordination thématique transversale
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workingGroups.map((gt, index) => {
              const IconComponent = getIconComponent(gt.icon);
              const grad = gtColors[index % gtColors.length];
              return (
                <div
                  key={gt.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
                >
                  <div className={`bg-gradient-to-br ${grad} p-6 flex items-center space-x-4`}>
                    <div className="bg-white/20 rounded-xl p-3">
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{gt.name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-400">
                      {gt.description || 'Coordination thématique inter-cluster pour une réponse cohérente.'}
                    </p>
                    {/* Badge « GT actif » — palette AFD (remplace pink) */}
                    <div className="mt-4 inline-flex items-center px-3 py-1.5 bg-afd-50 dark:bg-afd-900/30 rounded-full">
                      <span className="text-xs font-semibold text-afd-600 dark:text-afd-300">Groupe de Travail actif</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Données de secours pour les GT */}
            {workingGroups.length === 0 && [
              { name: 'GT Santé Sexuelle et Reproductive (SSR)', icon: 'Activity', desc: 'Accès aux soins de santé sexuelle et reproductive en situation d\'urgence.' },
              { name: 'GT Violences Basées sur le Genre (VBG)', icon: 'ShieldAlert', desc: 'Prévention et réponse aux violences basées sur le genre.' },
              { name: 'GT Logistique', icon: 'Truck', desc: 'Coordination logistique pour la livraison de l\'aide humanitaire.' },
            ].map((gt, i) => {
              const IconComponent = ((Icons as Record<string, unknown>)[gt.icon] as LucideIcon | undefined) || Icons.Users;
              return (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                  <div className={`bg-gradient-to-br ${gtColors[i]} p-6 flex items-center space-x-4`}>
                    <div className="bg-white/20 rounded-xl p-3">
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{gt.name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-400">{gt.desc}</p>
                    <div className="mt-4 inline-flex items-center px-3 py-1.5 bg-afd-50 dark:bg-afd-900/30 rounded-full">
                      <span className="text-xs font-semibold text-afd-600 dark:text-afd-300">Groupe de Travail actif</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Appel à l'action — rejoindre les mécanismes de coordination */}
      <section className="py-16 bg-gradient-to-br from-afd-400 to-afd-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez nos mécanismes de coordination</h2>
          <p className="text-xl text-afd-100 mb-8 max-w-2xl mx-auto">
            Vous êtes une organisation humanitaire ? Participez à nos réunions de cluster et groupes de travail.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-afd-400 rounded-lg font-semibold hover:bg-afd-50 transition-all shadow-lg"
          >
            Nous contacter
          </a>
        </div>
      </section>
    </div>
  );
}

