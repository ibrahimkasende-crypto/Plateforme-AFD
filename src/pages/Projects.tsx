// =============================================================
// Projects.tsx — Liste des projets de l'AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600)
// Les boutons de filtre utilisent tous afd-* pour la cohérence.
// =============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { supabase, queryWithRetry } from '../lib/supabase';
import { Project } from '../types';
import { fallbackProjects } from '../lib/fallbackData';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'en_cours' | 'termine' | 'futur'>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.status === filter));
    }
  }, [filter, projects]);

  async function fetchProjects() {
    const { data, error } = await queryWithRetry(() =>
      supabase
        .from('projets')
        .select('*')
        .eq('active', true)
        .order('start_date', { ascending: false })
    );

    if (data && data.length > 0) {
      setProjects(data);
      setFilteredProjects(data);
    } else {
      if (error) console.error('[Projects] erreur récupération projets:', error);
      setProjects(fallbackProjects);
      setFilteredProjects(fallbackProjects);
    }
  }

  return (
    <div>
      {/* En-tête de page */}
      <section className="bg-gradient-to-br from-afd-400 to-afd-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Nos Projets</h1>
          <p className="text-xl text-afd-100 max-w-3xl">
            Découvrez nos actions concrètes sur le terrain pour améliorer la vie des communautés
          </p>
        </div>
      </section>

      {/* Grille des projets avec filtres */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Barre de filtres */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400 font-medium">Filtrer par statut :</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Filtre Tous */}
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-afd-400 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Tous ({projects.length})
              </button>
              {/* Filtre En cours — vert conservé pour signalétique fonctionnelle */}
              <button
                onClick={() => setFilter('en_cours')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'en_cours'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                En cours ({projects.filter(p => p.status === 'en_cours').length})
              </button>
              {/* Filtre Terminés */}
              <button
                onClick={() => setFilter('termine')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'termine'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Terminés ({projects.filter(p => p.status === 'termine').length})
              </button>
              {/* Filtre À venir — bleu AFD */}
              <button
                onClick={() => setFilter('futur')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'futur'
                    ? 'bg-afd-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                À venir ({projects.filter(p => p.status === 'futur').length})
              </button>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">Aucun projet trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="group bg-afd-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                >
                  {project.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      {/* Badge de statut — signalétique fonctionnelle conservée */}
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        project.status === 'en_cours'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : project.status === 'termine'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                          : 'bg-afd-100 text-afd-700 dark:bg-afd-900/30 dark:text-afd-300'
                      }`}>
                        {project.status === 'en_cours' && 'En cours'}
                        {project.status === 'termine' && 'Terminé'}
                        {project.status === 'futur' && 'À venir'}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-afd-400 dark:group-hover:text-afd-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-afd-400 dark:text-afd-300 mb-3">
                      {project.location}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                      {project.description}
                    </p>
                    {project.beneficiaries && (
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        <span className="font-semibold">{project.beneficiaries.toLocaleString()}</span> bénéficiaires
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
