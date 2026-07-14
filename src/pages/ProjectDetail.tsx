// =============================================================
// ProjectDetail.tsx — Détail d'un projet AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600)
// Modèle repris de ProgramDetail.tsx (en-tête dégradé + panneau latéral).
// =============================================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase, queryWithRetry } from '../lib/supabase';
import { Project } from '../types';
import { fallbackProjects, fallbackPrograms } from '../lib/fallbackData';

interface ProgrammeAssocie {
  title: string;
  slug: string;
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [programme, setProgramme] = useState<ProgrammeAssocie | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      setProject(null);
      setProgramme(null);
      setNotFound(false);
      fetchProject();
    }
  }, [slug]);

  useEffect(() => {
    if (project?.program_id) {
      fetchProgramme(project.program_id);
    }
  }, [project]);

  async function fetchProject() {
    // Diagnostic Supabase — table projets (détail)
    const { data, error } = await queryWithRetry<Project>(() =>
      supabase
        .from('projets')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()
    );
    console.log('[ProjectDetail] projet DATA:', data);
    if (error) console.error('[ProjectDetail] projet ERROR:', error);
    if (data) {
      setProject(data);
    } else {
      console.warn('[ProjectDetail] projet non trouvé ou erreur, recherche dans les données de secours');
      const fallback = fallbackProjects.find(p => p.slug === slug);
      if (fallback) {
        setProject(fallback);
      } else {
        setNotFound(true);
      }
    }
  }

  async function fetchProgramme(programId: string) {
    // Diagnostic Supabase — programme associé au projet
    const { data, error } = await queryWithRetry<ProgrammeAssocie>(() =>
      supabase
        .from('programmes')
        .select('title, slug')
        .eq('id', programId)
        .maybeSingle()
    );
    if (error) console.error('[ProjectDetail] programme associé ERROR:', error);
    if (data) {
      setProgramme(data);
    } else {
      const fallback = fallbackPrograms.find(p => p.id === programId);
      setProgramme(fallback ? { title: fallback.title, slug: fallback.slug } : null);
    }
  }

  /* Projet introuvable */
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Ce projet est introuvable.</p>
          <Link to="/projects" className="text-afd-400 dark:text-afd-300 hover:underline font-medium">
            Retour aux projets
          </Link>
        </div>
      </div>
    );
  }

  /* État de chargement */
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête du projet — dégradé AFD */}
      <section className="bg-gradient-to-br from-afd-400 to-afd-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Lien retour */}
          <Link
            to="/projects"
            className="inline-flex items-center text-afd-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour aux projets
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-afd-100 max-w-3xl">{project.location}</p>
        </div>
      </section>

      {/* Contenu principal du projet */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Description et résultats */}
            <div className="lg:col-span-2">
              {project.image_url && (
                <div className="aspect-video rounded-xl overflow-hidden mb-8">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Description du projet</h2>
              <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
                <p>{project.description}</p>
              </div>

              {project.results && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Résultats obtenus</h3>
                  <p className="text-gray-600 dark:text-gray-400">{project.results}</p>
                </div>
              )}
            </div>

            {/* Panneau latéral — informations clés + soutien */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-afd-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Informations clés</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Statut</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {project.status === 'en_cours' && 'En cours'}
                      {project.status === 'termine' && 'Terminé'}
                      {project.status === 'futur' && 'À venir'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Localisation</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{project.location}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Date de début</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {new Date(project.start_date).toLocaleDateString('fr-FR')}
                    </dd>
                  </div>
                  {project.beneficiaries && (
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Bénéficiaires</dt>
                      <dd className="font-medium text-gray-900 dark:text-white">
                        {project.beneficiaries.toLocaleString()}
                      </dd>
                    </div>
                  )}
                  {programme && (
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Programme associé</dt>
                      <dd>
                        <Link
                          to={`/programs/${programme.slug}`}
                          className="font-medium text-afd-400 dark:text-afd-300 hover:underline"
                        >
                          {programme.title}
                        </Link>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="bg-afd-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Vous souhaitez nous soutenir ?</h3>
                <div className="space-y-4">
                  {/* Bouton don — principal AFD */}
                  <Link
                    to="/donate"
                    className="block w-full px-6 py-3 bg-afd-400 text-white text-center rounded-lg hover:bg-afd-600 font-medium transition-colors"
                  >
                    Faire un don
                  </Link>
                  {/* Bouton adhésion — contour AFD */}
                  <Link
                    to="/membership"
                    className="block w-full px-6 py-3 border-2 border-afd-400 text-afd-400 dark:text-afd-300 dark:border-afd-300 text-center rounded-lg hover:bg-afd-50 dark:hover:bg-afd-900/20 font-medium transition-colors"
                  >
                    Devenir membre
                  </Link>
                  {/* Bouton contact — neutre */}
                  <Link
                    to="/contact"
                    className="block w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-center rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
