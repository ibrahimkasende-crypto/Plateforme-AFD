// =============================================================
// App.tsx — Routeur principal de l'application AFD
// Routes publiques et routes admin au même niveau.
// Le FournisseurAuth enveloppe uniquement les pages admin.
// =============================================================

import { Routes, Route, Navigate } from 'react-router-dom';

// --- Site public ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Membership from './pages/Membership';
import Donate from './pages/Donate';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Clusters from './pages/Clusters';
import NotFound from './pages/NotFound';

// --- Espace admin ---
import { FournisseurAuth } from './admin/contextes/ContexteAuth';
import RouteProtegee from './admin/composants/RouteProtegee';
import LoginAdmin from './admin/pages/LoginAdmin';
import DashboardAdmin from './admin/pages/DashboardAdmin';
import GestionProjets from './admin/pages/GestionProjets';
import GestionProgrammes from './admin/pages/GestionProgrammes';
import GestionActualites from './admin/pages/GestionActualites';
import GestionPartenaires from './admin/pages/GestionPartenaires';
import GestionMembres from './admin/pages/GestionMembres';
import ParametresSite from './admin/pages/ParametresSite';
import GestionGalerie from './admin/pages/GestionGalerie';


// ─── Composant de mise en page publique ───────────────────────
function MiseEnPagePublique({ enfant }: { enfant: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />
      <main>{enfant}</main>
      <Footer />
    </div>
  );
}

// ─── Application principale ────────────────────────────────────
function App() {
  return (
    // Le FournisseurAuth doit englober TOUTES les routes
    // pour que le hook useAuth() fonctionne partout dans l'admin
    <FournisseurAuth>
      <Routes>

        {/* ── Routes publiques (avec Navbar + Footer) ── */}
        <Route path="/" element={<MiseEnPagePublique enfant={<Home />} />} />
        <Route path="/about" element={<MiseEnPagePublique enfant={<About />} />} />
        <Route path="/programs" element={<MiseEnPagePublique enfant={<Programs />} />} />
        <Route path="/programs/:slug" element={<MiseEnPagePublique enfant={<ProgramDetail />} />} />
        <Route path="/projects" element={<MiseEnPagePublique enfant={<Projects />} />} />
        <Route path="/projects/:slug" element={<MiseEnPagePublique enfant={<ProjectDetail />} />} />
        <Route path="/clusters" element={<MiseEnPagePublique enfant={<Clusters />} />} />
        <Route path="/clusters/:type" element={<MiseEnPagePublique enfant={<Clusters />} />} />
        <Route path="/membership" element={<MiseEnPagePublique enfant={<Membership />} />} />
        <Route path="/donate" element={<MiseEnPagePublique enfant={<Donate />} />} />
        <Route path="/news" element={<MiseEnPagePublique enfant={<News />} />} />
        <Route path="/news/:slug" element={<MiseEnPagePublique enfant={<NewsDetail />} />} />
        <Route path="/gallery" element={<MiseEnPagePublique enfant={<Gallery />} />} />
        <Route path="/contact" element={<MiseEnPagePublique enfant={<Contact />} />} />

        {/* ── Routes admin (sans Navbar/Footer publics) ── */}
        {/* Page de connexion — accessible sans être connecté */}
        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* Tableau de bord — protégé */}
        <Route
          path="/admin/dashboard"
          element={<RouteProtegee enfant={<DashboardAdmin />} />}
        />

        {/* Gestion des projets — protégée */}
        <Route
          path="/admin/projets"
          element={<RouteProtegee enfant={<GestionProjets />} />}
        />

        {/* Gestion des programmes — protégée */}
        <Route
          path="/admin/programmes"
          element={<RouteProtegee enfant={<GestionProgrammes />} />}
        />

        {/* Gestion des actualités — protégée */}
        <Route
          path="/admin/actualites"
          element={<RouteProtegee enfant={<GestionActualites />} />}
        />

        {/* Gestion des partenaires — protégée */}
        <Route
          path="/admin/partenaires"
          element={<RouteProtegee enfant={<GestionPartenaires />} />}
        />

        {/* Gestion des membres — protégée */}
        <Route
          path="/admin/membres"
          element={<RouteProtegee enfant={<GestionMembres />} />}
        />

        {/* Gestion de la galerie — protégée */}
        <Route
          path="/admin/galerie"
          element={<RouteProtegee enfant={<GestionGalerie />} />}
        />

        {/* Paramètres du site — protégée */}
        <Route
          path="/admin/parametres"
          element={<RouteProtegee enfant={<ParametresSite />} />}
        />

        {/* Redirection /admin → /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Page 404 */}
        <Route path="*" element={<MiseEnPagePublique enfant={<NotFound />} />} />

      </Routes>
    </FournisseurAuth>
  );
}

export default App;
