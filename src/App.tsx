// =============================================================
// App.tsx — Routeur principal de l'application AFD
// Routes publiques et routes admin au même niveau.
// Le FournisseurAuth enveloppe uniquement les pages admin.
// =============================================================

import { Routes, Route } from 'react-router-dom';

// --- Site public ---
import PublicLayout from './layouts/PublicLayout';
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
import Organisation from './pages/Organisation';
import OrganisationInfo from './pages/OrganisationInfo';
import Team from './pages/Team';
import Impact from './pages/Impact';
import Partners from './pages/Partners';
import Legal from './pages/Legal';

// --- Espace admin ---
import { FournisseurAuth } from './admin/contextes/ContexteAuth';
import RouteProtegee from './admin/composants/RouteProtegee';
import LoginAdmin from './admin/pages/LoginAdmin';
import AdminDashboardV2 from './admin/pages/AdminDashboardV2';
import AdminModulePlaceholder from './admin/pages/AdminModulePlaceholder';
import GestionProjets from './admin/pages/GestionProjets';
import GestionProgrammes from './admin/pages/GestionProgrammes';
import GestionActualites from './admin/pages/GestionActualites';
import GestionPartenaires from './admin/pages/GestionPartenaires';
import GestionMembres from './admin/pages/GestionMembres';
import ParametresSite from './admin/pages/ParametresSite';
import GestionGalerie from './admin/pages/GestionGalerie';


// ─── Application principale ────────────────────────────────────
function App() {
  return (
    // Le FournisseurAuth doit englober TOUTES les routes
    // pour que le hook useAuth() fonctionne partout dans l'admin
    <FournisseurAuth>
      <Routes>

        {/* ── Routes publiques (avec Navbar + Footer) ── */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/programs" element={<PublicLayout><Programs /></PublicLayout>} />
        <Route path="/programs/:slug" element={<PublicLayout><ProgramDetail /></PublicLayout>} />
        <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
        <Route path="/projects/:slug" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
        <Route path="/clusters" element={<PublicLayout><Clusters /></PublicLayout>} />
        <Route path="/clusters/:type" element={<PublicLayout><Clusters /></PublicLayout>} />
        <Route path="/membership" element={<PublicLayout><Membership /></PublicLayout>} />
        <Route path="/donate" element={<PublicLayout><Donate /></PublicLayout>} />
        <Route path="/news" element={<PublicLayout><News /></PublicLayout>} />
        <Route path="/news/:slug" element={<PublicLayout><NewsDetail /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/organisation" element={<PublicLayout><Organisation /></PublicLayout>} />
        <Route path="/organisation/notre-histoire" element={<PublicLayout><OrganisationInfo /></PublicLayout>} />
        <Route path="/organisation/mission-et-valeurs" element={<PublicLayout><OrganisationInfo /></PublicLayout>} />
        <Route path="/organisation/equipe" element={<PublicLayout><Team /></PublicLayout>} />
        <Route path="/organisation/gouvernance" element={<PublicLayout><OrganisationInfo /></PublicLayout>} />
        <Route path="/impact" element={<PublicLayout><Impact /></PublicLayout>} />
        <Route path="/partenaires" element={<PublicLayout><Partners /></PublicLayout>} />
        <Route path="/mentions-legales" element={<PublicLayout><Legal /></PublicLayout>} />
        <Route path="/politique-confidentialite" element={<PublicLayout><Legal /></PublicLayout>} />

        {/* Aliases français V2 : les URLs historiques restent disponibles. */}
        <Route path="/programmes" element={<PublicLayout><Programs /></PublicLayout>} />
        <Route path="/programmes/:slug" element={<PublicLayout><ProgramDetail /></PublicLayout>} />
        <Route path="/projets" element={<PublicLayout><Projects /></PublicLayout>} />
        <Route path="/projets/:slug" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
        <Route path="/actualites" element={<PublicLayout><News /></PublicLayout>} />
        <Route path="/actualites/:slug" element={<PublicLayout><NewsDetail /></PublicLayout>} />
        <Route path="/mediatheque" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/adhesion" element={<PublicLayout><Membership /></PublicLayout>} />
        <Route path="/don" element={<PublicLayout><Donate /></PublicLayout>} />

        {/* ── Routes admin (sans Navbar/Footer publics) ── */}
        {/* Page de connexion — accessible sans être connecté */}
        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* Tableau de bord — protégé */}
        <Route
          path="/admin/dashboard"
          element={<RouteProtegee enfant={<AdminDashboardV2 />} />}
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

        {['equipe', 'clusters', 'mediatheque', 'messages', 'adhesions', 'dons', 'statistiques', 'rapports'].map((module) => (
          <Route key={module} path={`/admin/${module}`} element={<RouteProtegee enfant={<AdminModulePlaceholder />} />} />
        ))}

        {/* Redirection /admin → /admin/dashboard */}
        <Route path="/admin" element={<RouteProtegee enfant={<AdminDashboardV2 />} />} />

        {/* Page 404 */}
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />

      </Routes>
    </FournisseurAuth>
  );
}

export default App;
