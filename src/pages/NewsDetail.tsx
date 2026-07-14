// =============================================================
// NewsDetail.tsx — Détail d'une actualité AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600)
// Modèle repris de ProgramDetail.tsx (en-tête dégradé + panneau latéral).
// =============================================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { supabase, queryWithRetry } from '../lib/supabase';
import { News } from '../types';
import { fallbackNews } from '../lib/fallbackData';

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<News | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      setArticle(null);
      setNotFound(false);
      fetchArticle();
    }
  }, [slug]);

  async function fetchArticle() {
    // Diagnostic Supabase — table actualites (détail)
    const { data, error } = await queryWithRetry<News>(() =>
      supabase
        .from('actualites')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()
    );
    console.log('[NewsDetail] actualite DATA:', data);
    if (error) console.error('[NewsDetail] actualite ERROR:', error);
    if (data) {
      setArticle(data);
    } else {
      console.warn('[NewsDetail] actualite non trouvée ou erreur, recherche dans les données de secours');
      const fallback = fallbackNews.find(n => n.slug === slug);
      if (fallback) {
        setArticle(fallback);
      } else {
        setNotFound(true);
      }
    }
  }

  /* Formateur de date en français */
  function formatDate(dateString: string) {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString));
  }

  /* Article introuvable */
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Cette actualité est introuvable.</p>
          <Link to="/news" className="text-afd-400 dark:text-afd-300 hover:underline font-medium">
            Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  /* État de chargement */
  if (!article) {
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
      {/* En-tête de l'article — dégradé AFD */}
      <section className="bg-gradient-to-br from-afd-400 to-afd-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Lien retour */}
          <Link
            to="/news"
            className="inline-flex items-center text-afd-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour aux actualités
          </Link>

          {/* Badge catégorie */}
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full mb-4">
            <Tag className="h-3 w-3" />
            <span>
              {article.category === 'article' && 'Article'}
              {article.category === 'communique' && 'Communiqué'}
              {article.category === 'evenement' && 'Événement'}
            </span>
          </span>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{article.title}</h1>

          <div className="flex items-center text-afd-100 text-sm space-x-4">
            {article.published_at && (
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(article.published_at)}
              </span>
            )}
            <span>Par {article.author}</span>
          </div>
        </div>
      </section>

      {/* Contenu principal de l'article */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Image et contenu */}
            <div className="lg:col-span-2">
              {article.image_url && (
                <div className="aspect-video rounded-xl overflow-hidden mb-8">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                <p>{article.content}</p>
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
    </div>
  );
}
