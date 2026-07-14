// =============================================================
// ProgramDetail.tsx — Détail d'un programme AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600)
// =============================================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { supabase, queryWithRetry } from '../lib/supabase';
import { Program, Project } from '../types';
import { fallbackPrograms, fallbackProjects } from '../lib/fallbackData';

export default function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (slug) {
      fetchProgram();
      fetchProjects();
    }
  }, [slug]);

  async function fetchProgram() {
    // Diagnostic Supabase — table programmes (détail)
    const { data, error } = await queryWithRetry(() =>
      supabase
        .from('programmes')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()
    );
    console.log('[ProgramDetail] programme DATA:', data);
    if (error) console.error('[ProgramDetail] programme ERROR:', error);
    if (data) {
      setProgram(data);
    } else {
      console.warn('[ProgramDetail] programme non trouvé ou erreur, recherche dans les données de secours');
      const fallback = fallbackPrograms.find(p => p.slug === slug);
      if (fallback) {
        setProgram(fallback);
      }
    }
  }

  async function fetchProjects() {
    // Diagnostic Supabase — récupération de l'id du programme
    const { data: programData, error: progError } = await queryWithRetry<{ id: string }>(() =>
      supabase
        .from('programmes')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
    );
    if (progError) console.error('[ProgramDetail] programmes (id) ERROR:', progError);

    let fetchedProjects = null;
    let fetchedError = null;

    if (programData) {
      // Diagnostic Supabase — table projets liés
      const { data, error } = await queryWithRetry(() =>
        supabase
          .from('projets')
          .select('*')
          .eq('program_id', programData.id)
          .eq('active', true)
          .order('start_date', { ascending: false })
      );
      fetchedProjects = data;
      fetchedError = error;
    }

    console.log('[ProgramDetail] projets DATA:', fetchedProjects);
    if (fetchedError) console.error('[ProgramDetail] projets ERROR:', fetchedError);

    if (fetchedProjects && fetchedProjects.length > 0) {
      setProjects(fetchedProjects);
    } else {
      console.warn('[ProgramDetail] projets vide ou erreur, filtrage dans les données de secours');
      const progIdFallback = fallbackPrograms.find(p => p.slug === slug)?.id;
      if (progIdFallback) {
        const fallbacks = fallbackProjects.filter(p => p.program_id === progIdFallback);
        setProjects(fallbacks);
      }
    }
  }

  /* État de chargement */
  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  const IconComponent = ((Icons as Record<string, unknown>)[program.icon] as LucideIcon | undefined) || Icons.Heart;

  return (
    <div>
      {/* En-tête de programme — dégradé AFD */}
      <section className="bg-gradient-to-br from-afd-400 to-afd-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Lien retour */}
          <Link
            to="/programs"
            className="inline-flex items-center text-afd-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour aux programmes
          </Link>
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-4 rounded-lg">
              <IconComponent className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold">{program.title}</h1>
          </div>
          <p className="text-xl text-afd-100 max-w-3xl">
            {program.description}
          </p>
        </div>
      </section>

      {/* Contenu principal du programme */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Description longue et objectifs */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Présentation du programme</h2>
              <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
                <p>{program.long_description}</p>
              </div>

              {/* Objectifs spécifiques — icônes vertes conservées (fonctionnelles) */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Objectifs spécifiques</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Renforcer les capacités des femmes et des filles dans leur domaine d'intervention
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Améliorer l'accès aux services essentiels et aux opportunités
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Promouvoir l'égalité des genres et l'autonomisation des femmes
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Créer un environnement favorable au développement durable
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Panneau latéral — soutien */}
            <div className="lg:col-span-1">
              <div className="bg-afd-50 dark:bg-gray-800 rounded-xl p-6 sticky top-24">
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

      {/* Projets liés à ce programme */}
      {projects.length > 0 && (
        <section className="py-16 bg-afd-50 dark:bg-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Projets liés à ce programme</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
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
                    <div className="flex items-center space-x-2 mb-2">
                      {/* Badge statut — signalétique fonctionnelle */}
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
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
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {project.location}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
