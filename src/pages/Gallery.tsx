// =============================================================
// Gallery.tsx — Galerie photo et vidéo de l'AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600)
// =============================================================

import { useEffect, useState } from 'react';
import { Image as ImageIcon, Video } from 'lucide-react';
import { supabase, queryWithRetry } from '../lib/supabase';
import { GalleryItem } from '../types';

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  // Ensemble des IDs dont l'image n'a pas pu se charger (onError).
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.media_type === filter));
    }
  }, [filter, items]);

  async function fetchGalleryItems() {
    const { data, error } = await queryWithRetry(() =>
      supabase.from('galerie').select('*').eq('active', true).order('created_at', { ascending: false })
    );
    console.log('[Gallery] galerie DATA:', data);
    if (error) console.error('[Gallery] galerie ERROR:', error);
    if (data) {
      setItems(data);
      setFilteredItems(data);
    }
  }

  function handleImageError(id: string) {
    setBrokenImages(prev => new Set(prev).add(id));
  }

  return (
    <div>
      {/* En-tête de page */}
      <section className="bg-gradient-to-br from-afd-400 to-afd-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Galerie</h1>
          <p className="text-xl text-afd-100 max-w-3xl">
            Découvrez en images nos actions sur le terrain et l'impact de nos programmes
          </p>
        </div>
      </section>

      {/* Grille de la galerie avec filtres */}
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
              Tout ({items.length})
            </button>
            <button
              onClick={() => setFilter('photo')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'photo'
                  ? 'bg-afd-400 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Photos ({items.filter(i => i.media_type === 'photo').length})</span>
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'video'
                  ? 'bg-afd-400 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Video className="h-4 w-4" />
              <span>Vidéos ({items.filter(i => i.media_type === 'video').length})</span>
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">La galerie sera bientôt disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-afd-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                >
                  {/* Zone image — hauteur fixée par aspect-square */}
                  <div className="aspect-square overflow-hidden bg-afd-100 dark:bg-afd-900/30">
                    {brokenImages.has(item.id) ? (
                      /* Placeholder si l'image ne charge pas */
                      <div className="w-full h-full flex items-center justify-center">
                        {item.media_type === 'video' ? (
                          <Video className="h-12 w-12 text-afd-400 dark:text-afd-300" />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-afd-400 dark:text-afd-300" />
                        )}
                      </div>
                    ) : (
                      <img
                        src={item.media_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={() => handleImageError(item.id)}
                      />
                    )}
                  </div>

                  {/* Indicateur vidéo */}
                  {item.media_type === 'video' && !brokenImages.has(item.id) && (
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/70 p-1.5 sm:p-2 rounded-full">
                      <Video className="h-5 w-5 text-white" />
                    </div>
                  )}

                  <div className="p-2 sm:p-4">
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 hidden sm:block">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
