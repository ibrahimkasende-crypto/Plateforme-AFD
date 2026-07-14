// =============================================================
// Navbar.tsx — Barre de navigation principale du site AFD
// Utilise la palette AFD (#36A2E0 principal, #1F6FA8 secondaire)
// =============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import logo from '../assets/adf-logo.jpg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [clustersOpen, setClustersOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  /* Liens de navigation principaux */
  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/about' },
    { name: 'Programmes', path: '/programs' },
    { name: 'Projets', path: '/projects' },
    { name: 'Actualités', path: '/news' },
    { name: 'Galerie', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  /* Sous-menu Clusters */
  const clusters  = [
    { name: 'Clusters & Groupes de Travail ', path: '/clusters' },
  ];


  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo et titre */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="logo" className="h-16 w-16" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">AFD</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Alliance des Femmes pour le Développement</p>
            </div>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 dark:text-gray-300 hover:text-afd-400 dark:hover:text-afd-300 font-medium transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}

            {/* Menu déroulant Clusters & GT */}
            <div
              className="relative"
              onMouseEnter={() => setClustersOpen(true)}
              onMouseLeave={() => setClustersOpen(false)}
            >
              <button
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-afd-400 dark:hover:text-afd-300 font-medium transition-colors text-sm"
              >
                Clusters & GT
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {clustersOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 py-2">
                  <div className="px-3 py-1.5">
                    {clusters.map((c) => (
                      <Link
                        key={c.path}
                        to="/clusters"
                        className="block px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-afd-400 dark:hover:text-afd-300 hover:bg-afd-50 dark:hover:bg-afd-900/20 rounded-lg transition-colors"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                 
                </div>
              )}
            </div>

            {/* Actions : thème, adhésion, don */}
            <div className="flex items-center space-x-2 ml-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-300" />
                )}
              </button>

              {/* Bouton « Devenir membre » — contour */}
              <Link
                to="/membership"
                className="px-4 py-2 text-afd-400 dark:text-afd-300 border border-afd-400 dark:border-afd-300 rounded-lg hover:bg-afd-50 dark:hover:bg-afd-900/20 font-semibold transition-colors text-sm"
              >
                Devenir membre
              </Link>

              {/* Bouton « Faire un don » — plein */}
              <Link
                to="/donate"
                className="px-4 py-2 bg-afd-400 text-white rounded-lg hover:bg-afd-600 font-semibold transition-colors text-sm"
              >
                Faire un don
              </Link>
            </div>
          </div>

          {/* Boutons mobile */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-gray-300" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile déplié */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t dark:border-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-gray-700 dark:text-gray-300 hover:text-afd-400 dark:hover:text-afd-300 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* Clusters mobile */}
            <div className="py-2 border-t border-gray-100 dark:border-gray-800 mt-2">
              <p className="text-xs font-semibold text-afd-400 dark:text-afd-300 uppercase tracking-wider mb-2">Clusters</p>
              {clusters.map((c) => (
                <Link
                  key={c.path}
                  to="/clusters"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 pl-3 text-gray-700 dark:text-gray-300 hover:text-afd-400 dark:hover:text-afd-300 font-medium transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            {/* Boutons d'action mobile */}
            <div className="mt-4 space-y-2">
              <Link
                to="/membership"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 text-center text-afd-400 dark:text-afd-300 border border-afd-400 dark:border-afd-300 rounded-lg hover:bg-afd-50 dark:hover:bg-afd-900/20 font-semibold transition-colors"
              >
                Devenir membre
              </Link>
              <Link
                to="/donate"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 text-center bg-afd-400 text-white rounded-lg hover:bg-afd-600 font-semibold transition-colors"
              >
                Faire un don
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}



