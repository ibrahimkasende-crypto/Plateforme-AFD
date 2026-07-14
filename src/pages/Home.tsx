// =============================================================
// Home.tsx — Page d'accueil du site AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600), #EAF6FD (afd-50)
// Toutes les couleurs décoratives sont harmonisées avec la charte.
// =============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Heart, Globe, TrendingUp, MapPin } from 'lucide-react';

import { supabase, queryWithRetry } from '../lib/supabase';
import { Program, News, Partner } from '../types';
import { fallbackSettings, fallbackPrograms, fallbackPartners, fallbackNews } from '../lib/fallbackData';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import { ProgramImage } from '../components/ProgramImage';
import img1 from '../assets/adf1.jpg';
import img2 from '../assets/adf2.png';

const backgroundImages = [img1, img2];

/**
 * Style inline pour le trait d'accent sous le titre d'une carte programme.
 * Si `programmes.color` est exploitable (couleur CSS valide), il prend le
 * dessus sur la couleur bleue par défaut (classe Tailwind `bg-afd-400`) ;
 * sinon la valeur inline est simplement ignorée par le navigateur et la
 * classe Tailwind reste affichée — repli silencieux et sans casse.
 */
function obtenirStyleAccent(couleur?: string): React.CSSProperties | undefined {
  return couleur ? { backgroundColor: couleur } : undefined;
}

/**
 * Classes d'apparition au défilement (fade-in + léger glissement vertical).
 * `visible` bascule une seule fois via useInView ; le délai (stagger) est
 * appliqué séparément en style inline pour ne pas multiplier les classes.
 */
function classesApparition(visible: boolean): string {
  return `transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`;
}

// Provinces de la RDC avec positions approximatives en %
const provinces = [
  { name: 'Kinshasa', x: 22, y: 68 },
  { name: 'Kikwit/Kwilu', x: 28, y: 65 },
  { name: 'Kwango', x: 25, y: 72 },
  { name: 'Nord Kivu', x: 68, y: 48 },
  { name: 'Ituri', x: 65, y: 35 },
  { name: 'Sud Kivu', x: 67, y: 58 },
  { name: 'Tshopo', x: 60, y: 35 },
  { name: 'Équateur', x: 38, y: 30 },
  { name: 'Tanganyika', x: 60, y: 68 },
  { name: 'Haut Katanga', x: 60, y: 82 },
  { name: 'Lualaba', x: 48, y: 78 },
  { name: 'Sankuru', x: 50, y: 55 },
];

/**
 * StatCounter — Anime un chiffre clé de 0 jusqu'à sa valeur finale
 * lorsque la section « Notre impact » entre dans le viewport.
 * Composant à part pour respecter les règles des hooks (useCountUp
 * ne peut pas être appelé directement dans un .map()).
 */
function StatCounter({ target, suffix, demarrer }: { target: number; suffix: string; demarrer: boolean }) {
  const valeur = useCountUp(target, demarrer);
  return <>{valeur.toLocaleString('fr-FR')}{suffix}</>;
}

export default function Home() {
  const [currentBg, setCurrentBg] = useState(0);

  const [programs, setPrograms] = useState<Program[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  /* Déclencheurs d'animation au défilement — une observation par section */
  const { ref: statsRef, inView: statsInView } = useInView<HTMLDivElement>();
  const { ref: domainesRef, inView: domainesInView } = useInView<HTMLDivElement>();
  const { ref: actualitesRef, inView: actualitesInView } = useInView<HTMLDivElement>();
  const { ref: partenairesRef, inView: partenairesInView } = useInView<HTMLDivElement>();

  useEffect(() => {
    fetchPrograms();
    fetchNews();
    fetchPartners();
    fetchSettings();
    // Rotation automatique des images d'arrière-plan
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);

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
    console.log('[Home] programmes DATA:', data);
    if (error) console.error('[Home] programmes ERROR:', error);
    if (data && data.length > 0) {
      setPrograms(data);
    } else {
      console.warn('[Home] programmes vide ou erreur, utilisation des données de secours');
      setPrograms(fallbackPrograms);
    }
  }

  async function fetchNews() {
    // Diagnostic Supabase — table actualites
    const { data, error } = await queryWithRetry(() =>
      supabase
        .from('actualites')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(3)
    );
    console.log('[Home] actualites DATA:', data);
    if (error) console.error('[Home] actualites ERROR:', error);
    if (data && data.length > 0) {
      setNews(data);
    } else {
      console.warn('[Home] actualites vide ou erreur, utilisation des données de secours');
      setNews(fallbackNews);
    }
  }

  async function fetchPartners() {
    // Diagnostic Supabase — table partenaires
    const { data, error } = await queryWithRetry(() =>
      supabase
        .from('partenaires')
        .select('*')
        .eq('active', true)
        .order('order')
    );
    console.log('[Home] partenaires DATA:', data);
    if (error) console.error('[Home] partenaires ERROR:', error);
    if (data && data.length > 0) {
      setPartners(data);
    } else {
      console.warn('[Home] partenaires vide ou erreur, utilisation des données de secours');
      setPartners(fallbackPartners);
    }
  }

  async function fetchSettings() {
    // Diagnostic Supabase — table parametres_site
    const { data, error } = await queryWithRetry(() =>
      supabase.from('parametres_site').select('*')
    );
    console.log('[Home] parametres_site DATA:', data);
    if (error) console.error('[Home] parametres_site ERROR:', error);
    if (data && data.length > 0) {
      const map: Record<string, string> = {};
      data.forEach((s) => { map[s.key] = s.value; });
      setSettings(map);
    } else {
      console.warn('[Home] parametres_site vide ou erreur, utilisation des données de secours');
      setSettings(fallbackSettings);
    }
  }

  /* Statistiques d'impact — toutes en nuances AFD */
  /* La valeur affichée est animée en count-up ; target/suffix remplacent
     la chaîne déjà formatée pour permettre l'interpolation du nombre. */
  const stats = [
    {
      icon: Users,
      label: 'Bénéficiaires',
      target: settings['beneficiaries'] ? Number(settings['beneficiaries']) : 50000,
      suffix: '+',
      color: 'text-afd-400',
    },
    {
      icon: Heart,
      label: 'Projets actifs',
      target: settings['active_projects'] ? Number(settings['active_projects']) : 10,
      suffix: '',
      color: 'text-afd-600',
    },
    {
      icon: Globe,
      label: 'Provinces',
      target: settings['provinces_count'] ? Number(settings['provinces_count']) : 12,
      suffix: '',
      color: 'text-afd-500',
    },
    {
      icon: TrendingUp,
      label: "Années d'expérience",
      target: settings['experience_years'] ? Number(settings['experience_years']) : 7,
      suffix: ' ans',
      color: 'text-afd-700',
    },
  ];

  return (
    <div>
      {/* Section hero avec images changeantes */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden text-white bg-black">
        {/* Calque des images */}
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentBg ? 'opacity-100' : 'opacity-0'
              }`}
            style={{ backgroundImage: `url(${img})` }}
          >
            {/* Overlay sombre pour la lisibilité */}
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        {/* Contenu textuel du hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            <p className="text-afd-200 font-medium mb-2">
              Fondée en {settings['founded_year'] || '2019'}
            </p>
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Autonomiser la femme, transformer la communauté
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-afd-100 leading-relaxed">
              Ensemble, nous œuvrons pour l'égalité, la dignité et le développement durable en République Démocratique du Congo
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/donate"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-afd-400 rounded-lg font-semibold hover:bg-afd-50 transition-all shadow-lg hover:shadow-xl"
              >
                Faire un don
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
              >
                Découvrir nos programmes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section statistiques d'impact */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Notre impact
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Des chiffres qui témoignent de notre engagement depuis {settings['founded_year'] || '2019'}
            </p>
          </div>
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-xl bg-afd-50 dark:bg-gray-800 hover:shadow-lg transition-all ${classesApparition(statsInView)}`}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                <stat.icon className={`h-12 w-12 ${stat.color} mx-auto mb-4`} />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  <StatCounter target={stat.target} suffix={stat.suffix} demarrer={statsInView} />
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carte interactive des zones d'intervention */}
      <section className="py-16 bg-afd-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Nos zones d'intervention
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Présents dans {settings['provinces_count'] || '12'} provinces de la RDC
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Carte SVG simplifiée de la RDC — couleurs AFD */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 overflow-hidden">
                <svg
                  viewBox="0 0 400 440"
                  className="w-full h-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Fond bleu léger AFD */}
                  <rect width="400" height="440" fill="#EAF6FD" rx="12" />
                  {/* Forme approximative de la RDC */}
                  <path
                    d="M60,100 L80,60 L120,40 L180,35 L230,30 L270,40 L310,55 L340,80 L355,110 L360,150 L350,190 L360,230 L355,270 L340,300 L320,330 L300,360 L270,380 L240,395 L200,400 L170,395 L140,385 L110,370 L85,350 L65,320 L50,285 L40,250 L45,210 L55,175 L50,140 Z"
                    fill="#36A2E0"
                    opacity="0.15"
                    stroke="#36A2E0"
                    strokeWidth="2"
                  />
                  {/* Fleuve Congo simplifié */}
                  <path
                    d="M60,200 Q120,180 180,190 Q240,200 280,180 Q320,160 350,170"
                    fill="none"
                    stroke="#A8DBF5"
                    strokeWidth="3"
                    opacity="0.7"
                  />

                  {/* Points des provinces */}
                  {provinces.map((province) => {
                    const cx = (province.x / 100) * 400;
                    const cy = (province.y / 100) * 440;
                    const isHovered = hoveredProvince === province.name;
                    return (
                      <g key={province.name}>
                        {/* Halo au survol */}
                        {isHovered && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r="14"
                            fill="#36A2E0"
                            opacity="0.2"
                          />
                        )}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 7 : 5}
                          fill={isHovered ? '#1F6FA8' : '#36A2E0'}
                          stroke="white"
                          strokeWidth="2"
                          className="cursor-pointer transition-all"
                          onMouseEnter={() => setHoveredProvince(province.name)}
                          onMouseLeave={() => setHoveredProvince(null)}
                        />
                        {/* Étiquette au survol */}
                        {isHovered && (
                          <text
                            x={cx + 10}
                            y={cy + 4}
                            fontSize="10"
                            fontWeight="bold"
                            fill="#1F6FA8"
                          >
                            {province.name}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Légende */}
                  <circle cx="22" cy="418" r="5" fill="#36A2E0" stroke="white" strokeWidth="2" />
                  <text x="32" y="422" fontSize="9" fill="#6B7280">Zones d'intervention AFD</text>
                </svg>
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Survolez un point pour voir la province
                </p>
              </div>
            </div>

            {/* Liste des provinces */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Provinces couvertes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {provinces.map((province) => (
                  <div
                    key={province.name}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all cursor-pointer ${hoveredProvince === province.name
                      ? 'bg-afd-100 dark:bg-afd-900/30'
                      : 'bg-white dark:bg-gray-900 hover:bg-afd-50 dark:hover:bg-afd-900/20'
                      }`}
                    onMouseEnter={() => setHoveredProvince(province.name)}
                    onMouseLeave={() => setHoveredProvince(null)}
                  >
                    <MapPin className={`h-5 w-5 flex-shrink-0 ${hoveredProvince === province.name ? 'text-afd-600' : 'text-afd-400'
                      }`} />
                    <span className={`font-medium text-sm ${hoveredProvince === province.name
                      ? 'text-afd-700 dark:text-afd-300'
                      : 'text-gray-700 dark:text-gray-300'
                      }`}>
                      {province.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* Section — Nos domaines d'intervention                          */}
      {/* Cartes illustrées : image de terrain + titre + description     */}
      {/* ============================================================= */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* En-tête de section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Nos domaines d'intervention
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Des programmes adaptés aux besoins des communautés
            </p>
          </div>

          {/* Grille responsive : 1 colonne (mobile) → 2 (tablette) → 3 (desktop) */}
          <div ref={domainesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
                <Link
                  key={program.id}
                  to={`/programs/${program.slug}`}
                  className={`group flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 overflow-hidden transition-all duration-500 ${classesApparition(domainesInView)}`}
                  style={{ transitionDelay: `${index * 75}ms` }}
                >
                  {/* ── Image du programme ── */}
                  <div className="relative h-48 overflow-hidden bg-afd-100 dark:bg-afd-900/30 flex-shrink-0">
                    <ProgramImage slug={program.slug} imageUrl={program.image_url} title={program.title} />
                    {/* Dégradé sombre en bas de l'image pour lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* ── Contenu texte ── */}
                  <div className="flex flex-col flex-1 p-6">
                    {/* Titre */}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight group-hover:text-afd-400 dark:group-hover:text-afd-300 transition-colors">
                      {program.title}
                    </h3>

                    {/* Trait d'accent — structure visuelle façon « carte moderne » */}
                    <span
                      className="block w-10 h-1 rounded-full mb-3 bg-afd-400 dark:bg-afd-300"
                      style={obtenirStyleAccent(program.color)}
                      aria-hidden="true"
                    />

                    {/* Description courte */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3 leading-relaxed">
                      {program.description}
                    </p>

                    {/* Lien « En savoir plus » */}
                    <div className="flex items-center text-afd-400 dark:text-afd-300 font-semibold mt-auto">
                      En savoir plus
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
            ))}
          </div>

          {/* Bouton « Voir tous les programmes » */}
          <div className="text-center mt-12">
            <Link
              to="/programs"
              className="inline-flex items-center px-6 py-3 bg-afd-400 text-white rounded-lg font-semibold hover:bg-afd-600 transition-all shadow-md hover:shadow-lg"
            >
              Voir tous les programmes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section appel à l'action — fond bleu AFD */}
      <section className="py-16 bg-afd-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 mx-auto mb-6" fill="white" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
            Votre soutien fait la différence
          </h2>
          <p className="text-xl text-afd-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Chaque contribution nous aide à autonomiser plus de femmes et à transformer plus de vies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donate"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-afd-400 rounded-lg font-semibold hover:bg-afd-50 transition-all shadow-lg"
            >
              Faire un don maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/membership"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              Devenir membre
            </Link>
          </div>
        </div>
      </section>

      {/* Section dernières actualités */}
      {news.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                  Dernières actualités
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                  Restez informés de nos actions
                </p>
              </div>
              <Link
                to="/news"
                className="hidden md:flex items-center text-afd-400 dark:text-afd-300 font-semibold hover:underline"
              >
                Voir toutes les actualités
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div ref={actualitesRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map((article, index) => (
                <Link
                  key={article.id}
                  to={`/news/${article.slug}`}
                  className={`group bg-afd-50 dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ${classesApparition(actualitesInView)}`}
                  style={{ transitionDelay: `${index * 75}ms` }}
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
                    <div className="text-sm text-afd-400 dark:text-afd-300 font-medium mb-2">
                      {article.category === 'article' && 'Article'}
                      {article.category === 'communique' && 'Communiqué'}
                      {article.category === 'evenement' && 'Événement'}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-afd-400 dark:group-hover:text-afd-300 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to="/news"
              className="md:hidden flex items-center justify-center mt-8 text-afd-400 dark:text-afd-300 font-semibold hover:underline"
            >
              Voir toutes les actualités
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      )}

      {/* Section partenaires */}
      <section className="py-16 bg-afd-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Nos partenaires
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Ils nous font confiance
            </p>
          </div>
          <div ref={partenairesRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {partners.map((partner, index) => (
              <div
                key={partner.id}
                className={`flex items-center justify-center p-5 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-500 group ${classesApparition(partenairesInView)}`}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                {/* Logo si renseigné en base, sinon repli élégant sur le nom */}
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="h-10 max-w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-gray-700 dark:text-gray-300 font-semibold text-center text-sm group-hover:text-afd-400 dark:group-hover:text-afd-300 transition-colors">
                    {partner.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}




// Force Vite reload
