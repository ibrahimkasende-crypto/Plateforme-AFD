// =============================================================
// Footer.tsx — Pied de page du site AFD
// Utilise la palette AFD (#36A2E0 principal, #1F6FA8 secondaire)
// =============================================================

import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import logo from '../assets/adf-logo.jpg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Bloc logo et réseaux sociaux */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="logo" className="h-16 w-16" />
              <div>
                <h3 className="text-white font-bold">AFD</h3>
                <p className="text-xs">Alliance des Femmes pour le Développement</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Autonomiser la femme, transformer la communauté
            </p>
            {/* Icônes des réseaux sociaux — hover bleu AFD */}
            <div className="flex space-x-4">
              <a href="#" className="hover:text-afd-400 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-afd-400 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-afd-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-afd-400 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation rapide */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-afd-400 transition-colors">Accueil</Link></li>
              <li><Link to="/about" className="hover:text-afd-400 transition-colors">À propos</Link></li>
              <li><Link to="/programs" className="hover:text-afd-400 transition-colors">Programmes</Link></li>
              <li><Link to="/projects" className="hover:text-afd-400 transition-colors">Projets</Link></li>
              <li><Link to="/news" className="hover:text-afd-400 transition-colors">Actualités</Link></li>
            </ul>
          </div>

          {/* Liens d'engagement */}
          <div>
            <h4 className="text-white font-semibold mb-4">S'engager</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/membership" className="hover:text-afd-400 transition-colors">Devenir membre</Link></li>
              <li><Link to="/donate" className="hover:text-afd-400 transition-colors">Faire un don</Link></li>
              <li><Link to="/gallery" className="hover:text-afd-400 transition-colors">Galerie</Link></li>
              <li><Link to="/contact" className="hover:text-afd-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Coordonnées de contact — icônes bleu AFD */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-afd-400 flex-shrink-0 mt-0.5" />
                <span>Kinshasa Songololo 145, RDC</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-afd-400 flex-shrink-0" />
                <span>+243 XX XXX XXXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-afd-400 flex-shrink-0" />
                <span>contact@afd-rdc.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre de copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} Alliance des Femmes pour le Développement. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}


