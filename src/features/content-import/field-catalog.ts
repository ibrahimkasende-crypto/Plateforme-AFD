import type { ContentEntityType } from "@/features/content-import/types";

export type FieldDef = {
  key: string;
  label: string;
  required?: boolean;
  patterns: RegExp[];
};

const SHARED_LOCATION: FieldDef[] = [
  {
    key: "province",
    label: "Province",
    patterns: [
      /province\s*[:\-–]\s*([^\n,;]+)/i,
      /\b(Kinshasa|Nord-Kivu|Sud-Kivu|Ituri|Haut-Katanga|Kasaï|Kongo-Central|Équateur|Maniema|Tanganyika|Haut-Uele|Bas-Uele|Tshopo|Mongala|Sud-Ubangi|Nord-Ubangi|Mai-Ndombe|Kwango|Kwilu|Lualaba|Haut-Lomami|Lomami|Sankuru|Tshuapa)\b/i,
    ],
  },
  {
    key: "territoire",
    label: "Territoire",
    patterns: [/territoire\s*[:\-–]\s*([^\n,;]+)/i],
  },
  {
    key: "zone",
    label: "Zone",
    patterns: [
      /zone\s*(?:d['’]intervention)?\s*[:\-–]\s*([^\n,;]+)/i,
      /localisation\s*[:\-–]\s*([^\n]+)/i,
    ],
  },
];

const SHARED_DATES: FieldDef[] = [
  {
    key: "date_debut",
    label: "Date de début",
    patterns: [
      /date\s*de\s*d[ée]but\s*[:\-–]\s*([0-9]{1,2}[\/.\-][0-9]{1,2}[\/.\-][0-9]{2,4}|[0-9]{4}-[0-9]{2}-[0-9]{2})/i,
      /du\s+([0-9]{1,2}[\/.\-][0-9]{1,2}[\/.\-][0-9]{2,4})\s+au\b/i,
    ],
  },
  {
    key: "date_fin",
    label: "Date de fin",
    patterns: [
      /date\s*de\s*fin\s*[:\-–]\s*([0-9]{1,2}[\/.\-][0-9]{1,2}[\/.\-][0-9]{2,4}|[0-9]{4}-[0-9]{2}-[0-9]{2})/i,
      /\bau\s+([0-9]{1,2}[\/.\-][0-9]{1,2}[\/.\-][0-9]{2,4})/i,
    ],
  },
];

const SHARED_BUDGET: FieldDef[] = [
  {
    key: "budget",
    label: "Budget",
    patterns: [
      /budget\s*(?:total)?\s*[:\-–]?\s*([0-9][0-9\s.,]*)\s*(USD|\$|CDF|FC|EUR|€)?/i,
      /montant\s*[:\-–]?\s*([0-9][0-9\s.,]*)\s*(USD|\$|CDF|FC|EUR|€)?/i,
    ],
  },
  {
    key: "devise",
    label: "Devise",
    patterns: [/\b(USD|CDF|EUR|FC)\b/],
  },
];

export const FIELD_CATALOG: Record<ContentEntityType, FieldDef[]> = {
  projet: [
    {
      key: "titre",
      label: "Titre",
      required: true,
      patterns: [
        /(?:projet|intitul[ée]|titre)\s*[:\-–]\s*([^\n]+)/i,
        /^#\s*(.+)$/m,
      ],
    },
    {
      key: "programme",
      label: "Programme",
      patterns: [/programme\s*[:\-–]\s*([^\n]+)/i],
    },
    {
      key: "description",
      label: "Description",
      required: true,
      patterns: [
        /(?:description|r[ée]sum[ée]|pr[ée]sentation)\s*[:\-–]\s*([\s\S]{40,800}?)(?:\n\s*\n|objectifs?|r[ée]sultats?|$)/i,
      ],
    },
    {
      key: "objectifs",
      label: "Objectifs",
      patterns: [
        /objectifs?\s*[:\-–]?\s*([\s\S]{20,600}?)(?:\n\s*\n|r[ée]sultats?|beneficiaires?|budget|$)/i,
      ],
    },
    {
      key: "resultats_attendus",
      label: "Résultats attendus",
      patterns: [
        /r[ée]sultats?\s*attendus?\s*[:\-–]?\s*([\s\S]{20,500}?)(?:\n\s*\n|r[ée]sultats?\s*obtenus|budget|$)/i,
      ],
    },
    {
      key: "resultats_obtenus",
      label: "Résultats obtenus",
      patterns: [
        /r[ée]sultats?\s*obtenus?\s*[:\-–]?\s*([\s\S]{20,500}?)(?:\n\s*\n|budget|partenaires|$)/i,
      ],
    },
    ...SHARED_LOCATION,
    ...SHARED_DATES,
    ...SHARED_BUDGET,
    {
      key: "partenaires",
      label: "Partenaires",
      patterns: [/partenaires?\s*[:\-–]\s*([^\n]+)/i],
    },
    {
      key: "bailleurs",
      label: "Bailleurs",
      patterns: [/(?:bailleurs?|financeurs?|donateurs?)\s*[:\-–]\s*([^\n]+)/i],
    },
    {
      key: "beneficiaires",
      label: "Nombre de bénéficiaires",
      patterns: [
        /(?:b[ée]n[ée]ficiaires?|personnes?\s*accompagn[ée]es?)\s*[:\-–]?\s*([0-9][0-9\s]*)/i,
      ],
    },
    {
      key: "secteur",
      label: "Secteur",
      patterns: [/(?:secteur|domaine)\s*(?:d['’]intervention)?\s*[:\-–]\s*([^\n]+)/i],
    },
    {
      key: "chef_projet",
      label: "Chef de projet",
      patterns: [
        /(?:chef\s*de\s*projet|responsable\s*projet|point\s*focal)\s*[:\-–]\s*([^\n]+)/i,
      ],
    },
    {
      key: "statut",
      label: "Statut",
      patterns: [
        /statut\s*[:\-–]\s*([^\n]+)/i,
        /\b(en\s*cours|termin[ée]|planifi[ée]|futur)\b/i,
      ],
    },
    {
      key: "gps",
      label: "Coordonnées GPS",
      patterns: [
        /(?:gps|coordonn[ée]es)\s*[:\-–]?\s*(-?\d+[.,]\d+)\s*[,;\s]+\s*(-?\d+[.,]\d+)/i,
      ],
    },
  ],
  programme: [
    {
      key: "titre",
      label: "Titre",
      required: true,
      patterns: [/(?:programme|titre|intitul[ée])\s*[:\-–]\s*([^\n]+)/i],
    },
    {
      key: "description",
      label: "Description",
      required: true,
      patterns: [
        /(?:description|r[ée]sum[ée])\s*[:\-–]\s*([\s\S]{30,600}?)(?:\n\s*\n|objectifs?|$)/i,
      ],
    },
    {
      key: "long_description",
      label: "Description détaillée",
      patterns: [
        /(?:description\s*d[ée]taill[ée]e|pr[ée]sentation)\s*[:\-–]\s*([\s\S]{40,1200}?)(?:\n\s*\n|$)/i,
      ],
    },
    ...SHARED_DATES,
  ],
  activite: [
    {
      key: "titre",
      label: "Titre",
      required: true,
      patterns: [/(?:activit[ée]|titre|intitul[ée])\s*[:\-–]\s*([^\n]+)/i],
    },
    {
      key: "type",
      label: "Type",
      patterns: [
        /type\s*[:\-–]\s*([^\n]+)/i,
        /\b(formation|sensibilisation|distribution|mission|atelier)\b/i,
      ],
    },
    {
      key: "description",
      label: "Description",
      patterns: [/description\s*[:\-–]\s*([\s\S]{20,500}?)(?:\n\s*\n|$)/i],
    },
    {
      key: "activity_date",
      label: "Date",
      patterns: [
        /date\s*[:\-–]\s*([0-9]{1,2}[\/.\-][0-9]{1,2}[\/.\-][0-9]{2,4}|[0-9]{4}-[0-9]{2}-[0-9]{2})/i,
      ],
    },
    ...SHARED_LOCATION,
    {
      key: "beneficiaires",
      label: "Bénéficiaires",
      patterns: [/b[ée]n[ée]ficiaires?\s*[:\-–]?\s*([0-9][0-9\s]*)/i],
    },
  ],
  actualite: [
    {
      key: "titre",
      label: "Titre",
      required: true,
      patterns: [/(?:titre|headline)\s*[:\-–]\s*([^\n]+)/i, /^#\s*(.+)$/m],
    },
    {
      key: "resume",
      label: "Résumé",
      patterns: [/(?:r[ée]sum[ée]|chap[oô]|extrait)\s*[:\-–]\s*([\s\S]{20,400}?)(?:\n\s*\n|$)/i],
    },
    {
      key: "contenu",
      label: "Contenu",
      required: true,
      patterns: [/(?:contenu|article|texte)\s*[:\-–]\s*([\s\S]{40,2000})/i],
    },
    {
      key: "date_publication",
      label: "Date de publication",
      patterns: [
        /date\s*(?:de\s*)?publication\s*[:\-–]\s*([0-9]{1,2}[\/.\-][0-9]{1,2}[\/.\-][0-9]{2,4}|[0-9]{4}-[0-9]{2}-[0-9]{2})/i,
      ],
    },
  ],
  appel_offres: [
    {
      key: "titre",
      label: "Titre",
      required: true,
      patterns: [/(?:appel\s*d['’]offres?|titre)\s*[:\-–]\s*([^\n]+)/i],
    },
    {
      key: "description",
      label: "Description",
      patterns: [/description\s*[:\-–]\s*([\s\S]{30,800})/i],
    },
    ...SHARED_DATES,
  ],
  rapport: [
    {
      key: "titre",
      label: "Titre",
      required: true,
      patterns: [/(?:rapport|titre)\s*[:\-–]\s*([^\n]+)/i],
    },
    {
      key: "description",
      label: "Description",
      patterns: [/(?:r[ée]sum[ée]|synth[èe]se)\s*[:\-–]\s*([\s\S]{30,600})/i],
    },
    ...SHARED_DATES,
  ],
  histoire_impact: [
    {
      key: "titre",
      label: "Titre",
      required: true,
      patterns: [/(?:histoire|titre|t[ée]moignage)\s*[:\-–]\s*([^\n]+)/i],
    },
    {
      key: "description",
      label: "Récit",
      patterns: [/(?:r[ée]cit|histoire|t[ée]moignage)\s*[:\-–]\s*([\s\S]{40,1200})/i],
    },
    ...SHARED_LOCATION,
  ],
  partenaire: [
    {
      key: "titre",
      label: "Nom",
      required: true,
      patterns: [/(?:partenaire|organisation|nom)\s*[:\-–]\s*([^\n]+)/i],
    },
    {
      key: "description",
      label: "Description",
      patterns: [/description\s*[:\-–]\s*([\s\S]{20,400})/i],
    },
  ],
  bibliotheque: [
    {
      key: "titre",
      label: "Titre",
      required: true,
      patterns: [/(?:titre|album|libell[ée])\s*[:\-–]\s*([^\n]+)/i],
    },
    {
      key: "description",
      label: "Description",
      patterns: [/description\s*[:\-–]\s*([\s\S]{20,400})/i],
    },
    ...SHARED_LOCATION,
    {
      key: "tags",
      label: "Tags",
      patterns: [/(?:tags?|mots[-\s]?cl[ée]s)\s*[:\-–]\s*([^\n]+)/i],
    },
  ],
  document: [
    {
      key: "titre",
      label: "Titre",
      required: true,
      patterns: [/(?:titre|document)\s*[:\-–]\s*([^\n]+)/i],
    },
    {
      key: "description",
      label: "Description",
      patterns: [/description\s*[:\-–]\s*([\s\S]{20,400})/i],
    },
  ],
};

export const ENTITY_LABELS: Record<ContentEntityType, string> = {
  projet: "projet",
  programme: "programme",
  activite: "activité",
  actualite: "actualité",
  appel_offres: "appel d’offres",
  rapport: "rapport",
  histoire_impact: "histoire d’impact",
  partenaire: "partenaire",
  bibliotheque: "élément de bibliothèque",
  document: "document",
};
