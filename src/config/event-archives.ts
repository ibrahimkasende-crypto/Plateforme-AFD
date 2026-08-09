import { afdBankImage } from "@/config/afd-images";

export type EventArchiveImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string | null;
  isCover: boolean;
  orderIndex: number;
  takenAt: string | null;
  consentStatus: "approved" | "to-review" | "not-required" | "refused" | "absent";
};

export type EventArchive = {
  id: string;
  slug: string;
  domainSlug: string;
  categorySlug?: string;
  categoryLabel?: string;
  title: string;
  summary: string;
  description: string;
  eventDate: string | null;
  startTime: string | null;
  endTime: string | null;
  locationName: string | null;
  address: string | null;
  province: string | null;
  territory: string | null;
  locality: string | null;
  latitude: number | null;
  longitude: number | null;
  project?: string | null;
  partners?: string[];
  tags: string[];
  coverImageUrl: string | null;
  published: boolean;
  featured: boolean;
  relatedArticleSlug: string | null;
  relatedArticleTitle: string | null;
  images: EventArchiveImage[];
};

function image(path: string) {
  return afdBankImage(path);
}

const archives: readonly EventArchive[] = [
  {
    id: "archive-economie-aprocm-tshopo",
    slug: "rencontre-aprocm-promotion-entrepreneuriat-tshopo",
    domainSlug: "autonomisation-economique",
    title: "Rencontre APROCM autour de la promotion économique et de l’entrepreneuriat",
    summary:
      "Trace photographique d’une rencontre institutionnelle liée à la promotion des classes moyennes, de l’entrepreneuriat et du développement des PME.",
    description:
      "Cette archive documente la présence de l’AFD dans un cadre lié à la promotion économique et à l’entrepreneuriat. Elle rattache l’activité au domaine de l’autonomisation économique des femmes et conserve les preuves visuelles utiles aux futurs partenaires.",
    eventDate: "2026-06-29",
    startTime: "23:18",
    endTime: null,
    locationName: "APROCM / coordination provinciale de la Tshopo",
    address: "Kisangani",
    province: "Tshopo",
    territory: null,
    locality: "Kisangani",
    latitude: null,
    longitude: null,
    tags: ["Entrepreneuriat", "Promotion économique", "PME", "Tshopo"],
    coverImageUrl: image(
      "19_gouvernance/afd_gouvernance_remise_documents_coordination_tshopo_005.jpg",
    ),
    published: true,
    featured: true,
    relatedArticleSlug: null,
    relatedArticleTitle: null,
    images: [
      {
        id: "archive-economie-aprocm-tshopo-1",
        src: image(
          "19_gouvernance/afd_gouvernance_remise_documents_coordination_tshopo_005.jpg",
        ),
        alt: "Équipe AFD devant une affiche de promotion économique et entrepreneuriat.",
        title: "Promotion économique APROCM",
        caption:
          "Équipe AFD devant une affiche APROCM liée à l’entrepreneuriat et aux PME.",
        isCover: true,
        orderIndex: 1,
        takenAt: "2026-06-29T23:18:44.000Z",
        consentStatus: "to-review",
      },
      {
        id: "archive-economie-aprocm-tshopo-2",
        src: image(
          "19_gouvernance/afd_gouvernance_remise_documents_coordination_tshopo_001.jpg",
        ),
        alt: "Remise officielle de documents dans un bureau institutionnel.",
        title: "Remise de documents Tshopo",
        caption: "Rencontre officielle de remise de documents à la coordination Tshopo.",
        isCover: false,
        orderIndex: 2,
        takenAt: "2026-06-29T23:18:07.000Z",
        consentStatus: "to-review",
      },
    ],
  },
  {
    id: "archive-protection-camp-kabila",
    slug: "sensibilisation-droits-femmes-camp-kabila",
    domainSlug: "protection-vbg-droits-femmes",
    title: "Sensibilisation sur les droits des femmes au Camp Kabila",
    summary:
      "Activité communautaire de sensibilisation autour des droits des femmes et de la dignité des filles.",
    description:
      "Cette archive rassemble les images classées de la sensibilisation organisée autour du 8 mars au Camp Kabila. Elle appuie les preuves de travail de l’AFD dans la protection, les droits des femmes et la prévention des violences.",
    eventDate: "2026-03-08",
    startTime: null,
    endTime: null,
    locationName: "Camp Kabila",
    address: null,
    province: null,
    territory: null,
    locality: "Camp Kabila",
    latitude: null,
    longitude: null,
    tags: ["Droits des femmes", "Sensibilisation", "8 mars", "Protection"],
    coverImageUrl: image(
      "22_sensibilisation/afd_sensibilisation_sensibilisation_8_mars_camp_kabila_004.jpg",
    ),
    published: true,
    featured: true,
    relatedArticleSlug: null,
    relatedArticleTitle: null,
    images: [
      {
        id: "archive-protection-camp-kabila-1",
        src: image(
          "22_sensibilisation/afd_sensibilisation_sensibilisation_8_mars_camp_kabila_004.jpg",
        ),
        alt: "Activité de sensibilisation avec participantes et équipe AFD.",
        title: "Sensibilisation 8 mars Camp Kabila",
        caption:
          "Groupe mobilisé pendant une sensibilisation sur les droits des femmes.",
        isCover: true,
        orderIndex: 1,
        takenAt: null,
        consentStatus: "to-review",
      },
      {
        id: "archive-protection-camp-kabila-2",
        src: image(
          "22_sensibilisation/afd_sensibilisation_sensibilisation_8_mars_camp_kabila_007.jpg",
        ),
        alt: "Groupe réuni lors d’une sensibilisation sur les droits des femmes.",
        title: "Équipe et participantes",
        caption: "Photo de groupe lors de la sensibilisation au Camp Kabila.",
        isCover: false,
        orderIndex: 2,
        takenAt: null,
        consentStatus: "to-review",
      },
    ],
  },
  {
    id: "archive-sante-cpn-salama",
    slug: "sensibilisation-cpn-salama-prevention-ebola",
    domainSlug: "sante-maternelle-infantile",
    title: "Sensibilisation CPN SALAMA et prévention communautaire Ebola",
    summary:
      "Séance de sensibilisation en santé communautaire dans l’aire de santé SALAMA, avec messages de prévention et mobilisation des femmes.",
    description:
      "L’archive documente une activité de sensibilisation CPN SALAMA. Les métadonnées de la banque d’images indiquent une prise de vue le 8 juillet 2026 autour de la santé maternelle, de la prévention et de la mobilisation communautaire.",
    eventDate: "2026-07-08",
    startTime: "12:48",
    endTime: null,
    locationName: "Aire de santé SALAMA",
    address: "Centre de santé SALAMA",
    province: "Ituri",
    territory: "Mambasa",
    locality: "SALAMA",
    latitude: null,
    longitude: null,
    tags: ["Santé maternelle", "CPN", "Ebola", "Prévention"],
    coverImageUrl: image("01_sante/afd_sante_sensibilisation_cpn_salama_011.jpg"),
    published: true,
    featured: true,
    relatedArticleSlug: "lutte-contre-ebola-sensibilisation-prevention",
    relatedArticleTitle:
      "Lutte contre Ebola : l’AFD ASBL renforce la sensibilisation et la prévention communautaire",
    images: [
      {
        id: "archive-sante-cpn-salama-1",
        src: image("01_sante/afd_sante_sensibilisation_cpn_salama_011.jpg"),
        alt: "Femmes participant à une sensibilisation de santé communautaire.",
        title: "Sensibilisation CPN SALAMA",
        caption:
          "Femmes réunies devant un centre de santé pendant une sensibilisation CPN.",
        isCover: true,
        orderIndex: 1,
        takenAt: "2026-07-08T12:48:57.000Z",
        consentStatus: "to-review",
      },
      {
        id: "archive-sante-cpn-salama-2",
        src: image("01_sante/afd_sante_sensibilisation_cpn_salama_012.jpg"),
        alt: "Groupe de femmes et personnel de santé pendant une sensibilisation.",
        title: "Participation communautaire SALAMA",
        caption: "Participants et personnel pendant la sensibilisation CPN SALAMA.",
        isCover: false,
        orderIndex: 2,
        takenAt: "2026-07-08T12:48:59.000Z",
        consentStatus: "to-review",
      },
      {
        id: "archive-sante-cpn-salama-3",
        src: image("01_sante/afd_sante_sensibilisation_cpn_salama_013.jpg"),
        alt: "Participants à une action de prévention santé communautaire.",
        title: "Message de prévention",
        caption: "Sensibilisation en santé avec références de prévention visibles.",
        isCover: false,
        orderIndex: 3,
        takenAt: "2026-07-08T12:49:07.000Z",
        consentStatus: "to-review",
      },
    ],
  },
  {
    id: "archive-wash-ceca-makoko",
    slug: "dotation-lavage-mains-ceca-20-makoko",
    domainSlug: "eau-hygiene-assainissement",
    title: "Dotation et sensibilisation lavage des mains au site CECA-20 MAKOKO",
    summary:
      "Activité WASH autour des dispositifs de lavage des mains et des pratiques d’hygiène.",
    description:
      "Cette archive rattache les images de dotation et de sensibilisation WASH au site CECA-20 MAKOKO. Elle permet de documenter les preuves terrain liées à l’eau, l’hygiène et l’assainissement.",
    eventDate: "2026-06-03",
    startTime: null,
    endTime: null,
    locationName: "Site CECA-20 MAKOKO",
    address: "Mambasa",
    province: "Ituri",
    territory: "Mambasa",
    locality: "CECA-20 MAKOKO",
    latitude: null,
    longitude: null,
    tags: ["WASH", "Hygiène", "Lavage des mains", "Site de déplacés"],
    coverImageUrl: image(
      "06_wash/afd_wash_sensibilisation_dotation_lavage_mains_site_ceca_20_makoko_1_007.jpg",
    ),
    published: true,
    featured: true,
    relatedArticleSlug: "urgence-ituri-deplaces-ceca-20-makoko-mambasa",
    relatedArticleTitle:
      "Urgence en Ituri : L’AFD évalue les besoins des déplacés du site CECA-20 MAKOKO à Mambasa",
    images: [
      {
        id: "archive-wash-ceca-makoko-1",
        src: image(
          "06_wash/afd_wash_sensibilisation_dotation_lavage_mains_site_ceca_20_makoko_1_007.jpg",
        ),
        alt: "Dispositifs de lavage des mains installés sur un site communautaire.",
        title: "Dispositifs de lavage des mains",
        caption: "Dispositifs préparés pour une activité WASH.",
        isCover: true,
        orderIndex: 1,
        takenAt: null,
        consentStatus: "to-review",
      },
      {
        id: "archive-wash-ceca-makoko-2",
        src: image(
          "06_wash/afd_wash_sensibilisation_dotation_lavage_mains_site_ceca_20_makoko_1_017.jpg",
        ),
        alt: "Démonstration communautaire sur le lavage des mains.",
        title: "Démonstration hygiène",
        caption: "Démonstration autour de l’hygiène des mains.",
        isCover: false,
        orderIndex: 2,
        takenAt: null,
        consentStatus: "to-review",
      },
    ],
  },
  {
    id: "archive-gouvernance-mambasa",
    slug: "civilites-autorites-territoriales-mambasa",
    domainSlug: "femmes-leadership-gouvernance-communautaire",
    title: "Civilités avec les autorités territoriales de Mambasa",
    summary:
      "Rencontre institutionnelle de proximité avec les autorités territoriales, utile à la gouvernance communautaire et à la coordination locale.",
    description:
      "Cette archive documente une visite officielle de l’AFD auprès des autorités territoriales de Mambasa. Elle soutient le domaine leadership et gouvernance communautaire par les preuves de dialogue institutionnel.",
    eventDate: "2026-07-02",
    startTime: "10:27",
    endTime: null,
    locationName: "Administration territoriale de Mambasa",
    address: "Mambasa",
    province: "Ituri",
    territory: "Mambasa",
    locality: "Mambasa",
    latitude: null,
    longitude: null,
    tags: ["Gouvernance", "Autorités territoriales", "Coordination", "Mambasa"],
    coverImageUrl: image(
      "24_visites_institutionnelles/afd_visites_institutionnelles_civilites_autorites_mambasa_001.jpg",
    ),
    published: true,
    featured: true,
    relatedArticleSlug: "expansion-afd-maillage-territorial-7-provinces",
    relatedArticleTitle:
      "Expansion de l’AFD ASBL : Un maillage territorial renforcé à travers 7 provinces de la RDC",
    images: [
      {
        id: "archive-gouvernance-mambasa-1",
        src: image(
          "24_visites_institutionnelles/afd_visites_institutionnelles_civilites_autorites_mambasa_001.jpg",
        ),
        alt: "Équipe AFD devant un bâtiment administratif à Mambasa.",
        title: "Civilités à Mambasa",
        caption: "Équipe AFD lors de civilités avec des autorités territoriales.",
        isCover: true,
        orderIndex: 1,
        takenAt: "2026-07-02T10:27:09.000Z",
        consentStatus: "to-review",
      },
      {
        id: "archive-gouvernance-mambasa-2",
        src: image(
          "24_visites_institutionnelles/afd_visites_institutionnelles_civilites_autorites_mambasa_002.jpg",
        ),
        alt: "Équipe AFD et autorités locales devant un bâtiment administratif.",
        title: "Autorités territoriales",
        caption: "Rencontre officielle avec les autorités territoriales de Mambasa.",
        isCover: false,
        orderIndex: 2,
        takenAt: "2026-07-02T10:27:09.000Z",
        consentStatus: "to-review",
      },
    ],
  },
  {
    id: "archive-humanitaire-ceca-makoko",
    slug: "visite-evaluation-site-deplaces-ceca-20-makoko",
    domainSlug: "femmes-reponse-humanitaire-urgence",
    title: "Évaluation des besoins au site de déplacés CECA-20 MAKOKO",
    summary:
      "Mission terrain d’évaluation des besoins des personnes déplacées, avec attention aux enjeux protection, santé, WASH et VBG.",
    description:
      "Cette archive regroupe les photos d’évaluation terrain au site CECA-20 MAKOKO à Mambasa. Elle rattache l’activité au domaine de la réponse humanitaire et d’urgence.",
    eventDate: "2026-06-03",
    startTime: null,
    endTime: null,
    locationName: "Site de déplacés CECA-20 MAKOKO",
    address: "Mambasa",
    province: "Ituri",
    territory: "Mambasa",
    locality: "CECA-20 MAKOKO",
    latitude: null,
    longitude: null,
    tags: ["Urgence", "Humanitaire", "Déplacés", "Évaluation des besoins"],
    coverImageUrl: image(
      "17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_010.jpg",
    ),
    published: true,
    featured: true,
    relatedArticleSlug: "urgence-ituri-deplaces-ceca-20-makoko-mambasa",
    relatedArticleTitle:
      "Urgence en Ituri : L’AFD évalue les besoins des déplacés du site CECA-20 MAKOKO à Mambasa",
    images: [
      {
        id: "archive-humanitaire-ceca-makoko-1",
        src: image(
          "17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_010.jpg",
        ),
        alt: "Équipe AFD évaluant les besoins dans un site de déplacés.",
        title: "Évaluation CECA-20 MAKOKO",
        caption: "Équipe AFD en visite d’évaluation dans un site de déplacés.",
        isCover: true,
        orderIndex: 1,
        takenAt: null,
        consentStatus: "to-review",
      },
      {
        id: "archive-humanitaire-ceca-makoko-2",
        src: image(
          "17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_011.jpg",
        ),
        alt: "Équipe terrain dans un site de déplacés à Mambasa.",
        title: "Mission terrain Mambasa",
        caption: "Visite d’évaluation des besoins au site CECA-20 MAKOKO.",
        isCover: false,
        orderIndex: 2,
        takenAt: null,
        consentStatus: "to-review",
      },
      {
        id: "archive-humanitaire-ceca-makoko-3",
        src: image(
          "17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_012.jpg",
        ),
        alt: "Échanges communautaires pendant une mission humanitaire.",
        title: "Échanges communautaires",
        caption: "Échanges terrain avec les populations déplacées.",
        isCover: false,
        orderIndex: 3,
        takenAt: null,
        consentStatus: "to-review",
      },
    ],
  },
  {
    id: "archive-education-preparation-cap-kinshasa",
    slug: "preparation-enquete-cap-rentree-scolaire-enfants-deplaces",
    domainSlug: "femmes-reponse-humanitaire-urgence",
    categorySlug: "education",
    categoryLabel: "Éducation",
    title:
      "Préparation de l’enquête CAP sur les besoins d’appui à la rentrée scolaire",
    summary:
      "Séance de travail AFD, AJDP et CSDI autour de l’outil de collecte destiné aux sites de Lutendele, Pakadjuma et Nsele.",
    description:
      "Le 20 juillet 2026, l’AFD a accueilli AJDP et CSDI dans ses locaux afin d’harmoniser les indicateurs clés et de finaliser le questionnaire de l’enquête CAP. L’outil doit aider à cartographier les besoins prioritaires des familles déplacées en fournitures scolaires, frais d’accès et appui psychosocial.",
    eventDate: "2026-07-20",
    startTime: null,
    endTime: null,
    locationName: "Locaux de l’AFD Kinshasa",
    address: "Kinshasa",
    province: "Kinshasa",
    territory: null,
    locality: "Kinshasa",
    latitude: null,
    longitude: null,
    project: "Enquête CAP rentrée scolaire 2026-2027",
    partners: ["AJDP", "CSDI"],
    tags: ["Éducation", "Enquête CAP", "Rentrée scolaire", "Déplacés"],
    coverImageUrl: image(
      "02_education/afd_education_preparation_enquete_cap_enfants_deplaces_kinshasa_2026_002.jpeg",
    ),
    published: true,
    featured: true,
    relatedArticleSlug:
      "preparation-enquete-cap-rentree-scolaire-enfants-deplaces",
    relatedArticleTitle:
      "Des grandes réflexions se préparent pour l’éducation des enfants déplacés",
    images: [1, 2, 3, 4].map((index) => ({
      id: `archive-education-preparation-cap-kinshasa-${index}`,
      src: image(
        `02_education/afd_education_preparation_enquete_cap_enfants_deplaces_kinshasa_2026_${String(index).padStart(3, "0")}.jpeg`,
      ),
      alt: "Séance de travail sur l’enquête CAP pour la rentrée scolaire des enfants déplacés.",
      title: "Préparation de l’enquête CAP",
      caption:
        "AFD, AJDP et CSDI harmonisent l’outil de collecte de données.",
      isCover: index === 2,
      orderIndex: index,
      takenAt: "2026-07-20T09:00:00.000Z",
      consentStatus: "to-review",
    })),
  },
  {
    id: "archive-education-formation-enqueteurs-cap-kinshasa",
    slug: "formation-enqueteurs-cap-rentree-scolaire-kinshasa",
    domainSlug: "femmes-reponse-humanitaire-urgence",
    categorySlug: "education",
    categoryLabel: "Éducation",
    title:
      "Formation des enquêteurs CAP pour l’appui à la rentrée scolaire 2026-2027",
    summary:
      "Onze enquêteurs, dont cinq femmes, ont été formés à l’utilisation du formulaire CAP pour documenter les besoins des enfants déplacés.",
    description:
      "Le 27 juillet 2026, à la CONEPT RDC à Kinshasa, le consortium AFD, CSDI et AJDP a organisé une session de formation sur le formulaire de l’enquête CAP. L’activité prépare la collecte de données prévue dans les sites de Maluku, Pakadjuma/Nsele et Lutendele/Mont-Ngafula.",
    eventDate: "2026-07-27",
    startTime: null,
    endTime: null,
    locationName: "Salle de réunion de la CONEPT RDC",
    address: "Kinshasa",
    province: "Kinshasa",
    territory: null,
    locality: "Kinshasa",
    latitude: null,
    longitude: null,
    project: "Projet de renforcement de l’accès à l’éducation des enfants déplacés en RDC",
    partners: ["AJDP", "CSDI"],
    tags: ["Formation", "Enquêteurs", "Éducation", "Enfants déplacés"],
    coverImageUrl: image(
      "02_education/afd_education_formation_enqueteurs_cap_enfants_deplaces_kinshasa_2026_001.jpeg",
    ),
    published: true,
    featured: true,
    relatedArticleSlug: "formation-enqueteurs-cap-rentree-scolaire-kinshasa",
    relatedArticleTitle:
      "Formation des enquêteurs CAP pour faciliter le retour à l’école",
    images: [1, 2, 3, 4, 5, 6, 7, 8].map((index) => ({
      id: `archive-education-formation-enqueteurs-cap-kinshasa-${index}`,
      src: image(
        `02_education/afd_education_formation_enqueteurs_cap_enfants_deplaces_kinshasa_2026_${String(index).padStart(3, "0")}.jpeg`,
      ),
      alt: "Formation des enquêteurs sur le formulaire CAP à Kinshasa.",
      title: "Formation des enquêteurs CAP",
      caption:
        "Session de formation sur le formulaire d’enquête CAP pour les besoins d’appui à la rentrée scolaire.",
      isCover: index === 1,
      orderIndex: index,
      takenAt: "2026-07-27T09:00:00.000Z",
      consentStatus: "to-review",
    })),
  },
  {
    id: "archive-sante-mve-dps-tshopo",
    slug: "suivi-evaluation-mve-dps-tshopo",
    domainSlug: "sante-maternelle-infantile",
    categorySlug: "sante",
    categoryLabel: "Santé",
    title:
      "Suivi et évaluation de la MVE à la Division provinciale de la santé de la Tshopo",
    summary:
      "Participation de l’AFD à une réunion de coordination sanitaire sur la situation épidémiologique et les recommandations de prévention.",
    description:
      "Le 1er août 2026, l’AFD a participé à une réunion de suivi et d’évaluation de la maladie à virus Ebola dans la salle de réunion de la Division provinciale de la santé de la Tshopo. Les échanges ont porté sur les problèmes identifiés, les recommandations, les échantillons au laboratoire et les fiches d’investigation.",
    eventDate: "2026-08-01",
    startTime: null,
    endTime: null,
    locationName: "Division provinciale de la santé de la Tshopo",
    address: "Kisangani",
    province: "Tshopo",
    territory: null,
    locality: "Kisangani",
    latitude: null,
    longitude: null,
    project: "Prévention et suivi communautaire MVE",
    partners: ["Division provinciale de la santé de la Tshopo", "Médecins Sans Frontières"],
    tags: ["MVE", "Ebola", "Santé publique", "Prévention"],
    coverImageUrl: image(
      "01_sante/afd_sante_reunion_suivi_evaluation_mve_dps_tshopo_2026_001.jpeg",
    ),
    published: true,
    featured: true,
    relatedArticleSlug: "suivi-evaluation-mve-dps-tshopo",
    relatedArticleTitle:
      "Suivi et évaluation de la MVE : l’AFD participe à la coordination sanitaire à la DPS Tshopo",
    images: [1, 2, 3, 4].map((index) => ({
      id: `archive-sante-mve-dps-tshopo-${index}`,
      src: image(
        `01_sante/afd_sante_reunion_suivi_evaluation_mve_dps_tshopo_2026_${String(index).padStart(3, "0")}.jpeg`,
      ),
      alt: "Réunion de suivi et d’évaluation de la MVE à la DPS Tshopo.",
      title: "Suivi MVE à la DPS Tshopo",
      caption:
        "Réunion de coordination sanitaire autour de la prévention et de la surveillance de la MVE.",
      isCover: index === 1,
      orderIndex: index,
      takenAt: "2026-08-01T09:00:00.000Z",
      consentStatus: "to-review",
    })),
  },
  {
    id: "archive-plaidoyer-loi-sante-publique",
    slug: "mobilisation-osc-revision-loi-sante-publique",
    domainSlug: "protection-vbg-droits-femmes",
    categorySlug: "plaidoyer",
    categoryLabel: "Plaidoyer",
    title:
      "Mobilisation des OSC sur la révision de la loi relative à la santé publique",
    summary:
      "L’AFD a pris part aux échanges sur l’article 81, alinéa 2, afin de soutenir une disposition plus réaliste et accessible.",
    description:
      "L’AFD ASBL a participé à une matinée de mobilisation des organisations de la société civile organisée par la CGND avec Si Jeunesse Savait. Les échanges ont porté sur la modification de la loi relative à la santé publique, notamment l’accès aux méthodes de contraception non réversibles dans les zones où les médecins spécialisés sont peu disponibles.",
    eventDate: "2026-08-03",
    startTime: null,
    endTime: null,
    locationName: "Kinshasa",
    address: null,
    province: "Kinshasa",
    territory: null,
    locality: "Kinshasa",
    latitude: null,
    longitude: null,
    project: "Plaidoyer santé publique et droits des femmes",
    partners: ["CGND", "Si Jeunesse Savait"],
    tags: ["Plaidoyer", "Santé publique", "Droits des femmes", "OSC"],
    coverImageUrl: image(
      "21_plaidoyer/afd_plaidoyer_mobilisation_osc_loi_sante_publique_kinshasa_2026_001.jpeg",
    ),
    published: true,
    featured: false,
    relatedArticleSlug: "mobilisation-osc-revision-loi-sante-publique",
    relatedArticleTitle:
      "L’AFD participe à la mobilisation des OSC sur la loi relative à la santé publique",
    images: [
      {
        id: "archive-plaidoyer-loi-sante-publique-1",
        src: image(
          "21_plaidoyer/afd_plaidoyer_mobilisation_osc_loi_sante_publique_kinshasa_2026_001.jpeg",
        ),
        alt: "Représentants présents lors d’une mobilisation d’OSC à Kinshasa.",
        title: "Mobilisation OSC santé publique",
        caption:
          "Participation de l’AFD à une mobilisation autour de la loi relative à la santé publique.",
        isCover: true,
        orderIndex: 1,
        takenAt: "2026-08-03T09:00:00.000Z",
        consentStatus: "to-review",
      },
    ],
  },
  {
    id: "archive-sante-intime-femmes-gogynax",
    slug: "sensibilisation-sante-intime-femmes-gogynax",
    domainSlug: "sante-maternelle-infantile",
    categorySlug: "sante",
    categoryLabel: "Santé",
    title: "Sensibilisation sur la santé intime et la dignité des femmes",
    summary:
      "Séance d’information auprès des femmes autour de la santé intime, de la prévention et de l’accès à des produits adaptés.",
    description:
      "Cette archive regroupe les images d’une sensibilisation consacrée à la santé intime des femmes. Les supports visibles indiquent une activité autour des produits Gogynax et de la prévention des infections. La date et le lieu exacts doivent être confirmés dans le dashboard avant publication officielle définitive.",
    eventDate: null,
    startTime: null,
    endTime: null,
    locationName: "Lieu à confirmer",
    address: null,
    province: null,
    territory: null,
    locality: null,
    latitude: null,
    longitude: null,
    project: "Santé intime et dignité des femmes",
    partners: ["Gogynax"],
    tags: ["Santé intime", "Femmes", "Prévention", "Dignité"],
    coverImageUrl: image(
      "01_sante/afd_sante_sensibilisation_sante_intime_femmes_gogynax_2026_004.jpeg",
    ),
    published: true,
    featured: true,
    relatedArticleSlug: "sensibilisation-sante-intime-femmes-gogynax",
    relatedArticleTitle:
      "Santé intime des femmes : une sensibilisation axée sur la prévention et la dignité",
    images: [1, 2, 3, 4, 5, 6, 7, 8].map((index) => ({
      id: `archive-sante-intime-femmes-gogynax-${index}`,
      src: image(
        `01_sante/afd_sante_sensibilisation_sante_intime_femmes_gogynax_2026_${String(index).padStart(3, "0")}.jpeg`,
      ),
      alt: "Sensibilisation sur la santé intime des femmes avec participantes et supports Gogynax.",
      title: "Santé intime des femmes",
      caption:
        "Échanges et présentation de supports autour de la prévention et de la santé intime.",
      isCover: index === 4,
      orderIndex: index,
      takenAt: null,
      consentStatus: "to-review",
    })),
  },
] as const;

export const FALLBACK_EVENT_ARCHIVES = archives;

function compareEventDateDesc(a: EventArchive, b: EventArchive) {
  const da = a.eventDate ? Date.parse(a.eventDate) : 0;
  const db = b.eventDate ? Date.parse(b.eventDate) : 0;
  return db - da;
}

export function getFallbackEventArchivesByDomain(domainSlug: string): EventArchive[] {
  return archives
    .filter((event) => event.domainSlug === domainSlug && event.published)
    .sort(compareEventDateDesc)
    .map((event) => ({ ...event, images: event.images.map((imageItem) => ({ ...imageItem })) }));
}

export function getFallbackEventArchiveBySlug(
  domainSlug: string,
  eventSlug: string,
): EventArchive | null {
  const event = archives.find(
    (item) => item.domainSlug === domainSlug && item.slug === eventSlug && item.published,
  );
  return event
    ? { ...event, images: event.images.map((imageItem) => ({ ...imageItem })) }
    : null;
}
