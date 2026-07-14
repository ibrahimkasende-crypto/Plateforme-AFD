// =============================================================
// News.tsx — Page des actualités AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600)
// =============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag } from 'lucide-react';
import { supabase, queryWithRetry } from '../lib/supabase';
import { News as NewsType } from '../types';
import { fallbackNews } from '../lib/fallbackData';

export default function News() {
  const [news, setNews] = useState<NewsType[]>([]);
  const [filter, setFilter] = useState<'all' | 'article' | 'communique' | 'evenement'>('all');
  const [filteredNews, setFilteredNews] = useState<NewsType[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter(n => n.category === filter));
    }
  }, [filter, news]);

  async function fetchNews() {
    // Diagnostic Supabase — table actualites
    const { data, error } = await queryWithRetry(() =>
      supabase
        .from('actualites')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
    );
    console.log('[News] actualites DATA:', data);
    if (error) console.error('[News] actualites ERROR:', error);
    if (data && data.length > 0) {
      setNews(data);
      setFilteredNews(data);
    } else {
      console.warn('[News] actualites vide ou erreur, utilisation des données de secours');
      setNews(fallbackNews);
      setFilteredNews(fallbackNews);
    }
  }

  /* Formateur de date en français */
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  return (
    <div>
      {/* En-tête de page */}
      <section className="bg-gradient-to-br from-afd-400 to-afd-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Actualités</h1>
          <p className="text-xl text-afd-100 max-w-3xl">
            Restez informés de nos actions, événements et réalisations
          </p>
        </div>
      </section>

      {/* Grille des articles avec filtres */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Boutons de filtre */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-afd-400 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Tout ({news.length})
            </button>
            <button
              onClick={() => setFilter('article')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'article'
                  ? 'bg-afd-400 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Articles ({news.filter(n => n.category === 'article').length})
            </button>
            <button
              onClick={() => setFilter('communique')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'communique'
                  ? 'bg-afd-400 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Communiqués ({news.filter(n => n.category === 'communique').length})
            </button>
            <button
              onClick={() => setFilter('evenement')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'evenement'
                  ? 'bg-afd-400 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Événements ({news.filter(n => n.category === 'evenement').length})
            </button>
          </div>

          {filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">Aucune actualité disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.slug}`}
                  className="group bg-afd-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                >
                  {article.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      {/* Badge catégorie — palette AFD */}
                      <span className="inline-flex items-center space-x-1 px-3 py-1 bg-afd-100 dark:bg-afd-900/30 text-afd-600 dark:text-afd-300 text-xs font-medium rounded-full">
                        <Tag className="h-3 w-3" />
                        <span>
                          {article.category === 'article' && 'Article'}
                          {article.category === 'communique' && 'Communiqué'}
                          {article.category === 'evenement' && 'Événement'}
                        </span>
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-afd-400 dark:group-hover:text-afd-300 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {/* Date de publication */}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {article.published_at && formatDate(article.published_at)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                      {article.excerpt}
                    </p>
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
