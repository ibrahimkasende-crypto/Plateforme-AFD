// =============================================================
// NotFound.tsx — Page 404 de l'AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600)
// =============================================================

import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-afd-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          {/* Code 404 — couleur principale AFD */}
          <h1 className="text-9xl font-bold text-afd-400 dark:text-afd-300 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page non trouvée</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        {/* Boutons de navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Retour à l'accueil — bouton plein AFD */}
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-afd-400 text-white rounded-lg hover:bg-afd-600 font-medium transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Link>
          {/* Page précédente — bouton contour AFD */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-afd-400 text-afd-400 dark:text-afd-300 dark:border-afd-300 rounded-lg hover:bg-afd-50 dark:hover:bg-afd-900/20 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
}
