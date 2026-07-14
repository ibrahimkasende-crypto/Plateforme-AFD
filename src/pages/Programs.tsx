// =============================================================
// Programs.tsx — Liste des programmes de l'AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600)
// =============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { supabase, queryWithRetry } from '../lib/supabase';
import { Program } from '../types';
import { fallbackPrograms } from '../lib/fallbackData';
import { ProgramImage } from '../components/ProgramImage';

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms() {
    // Diagnostic Supabase — table programmes
    const { data, error } = await queryWithRetry(() =>
      supabase
        .from('programmes')
        .select('*')
        .eq('active', true)
        .order('order')
    );
    console.log('[Programs] programmes DATA:', data);
    if (error) console.error('[Programs] programmes ERROR:', error);
    if (data && data.length > 0) {
      setPrograms(data);
    } else {
      console.warn('[Programs] programmes vide ou erreur, utilisation des données de secours');
      setPrograms(fallbackPrograms);
    }
  }

  return (
    <div>
      {/* En-tête de page */}
      <section className="bg-gradient-to-br from-afd-400 to-afd-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Nos Programmes</h1>
          <p className="text-xl text-afd-100 max-w-3xl">
            Des interventions ciblées et intégrées pour répondre aux besoins des femmes et des communautés
          </p>
        </div>
      </section>

      {/* Grille des programmes */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => {
              const IconComponent = ((Icons as Record<string, unknown>)[program.icon] as LucideIcon | undefined) || Icons.Heart;
              return (
                <Link
                  key={program.id}
                  to={`/programs/${program.slug}`}
                  className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 overflow-hidden transition-all duration-500"
                >
                  {/* Image du programme */}
                  <div className="relative h-48 overflow-hidden bg-afd-100 dark:bg-afd-900/30 flex-shrink-0">
                    <ProgramImage
                      slug={program.slug}
                      imageUrl={program.image_url}
                      title={program.title}
                      FallbackIcon={IconComponent}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Contenu texte */}
                  <div className="flex flex-col flex-1 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight group-hover:text-afd-400 dark:group-hover:text-afd-300 transition-colors">
                      {program.title}
                    </h2>
                    <span
                      className="block w-10 h-1 rounded-full mb-3 bg-afd-400 dark:bg-afd-300"
                      style={program.color ? { backgroundColor: program.color } : undefined}
                      aria-hidden="true"
                    />
                    <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3 leading-relaxed">
                      {program.description}
                    </p>
                    <div className="flex items-center text-afd-400 dark:text-afd-300 font-semibold mt-auto">
                      Découvrir le programme
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
