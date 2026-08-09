# Contenu source — Offre Mambasa

## URL source

https://afd-rdc.org/emplois/chef-de-projet-base-a-mambasa

## Date d’import

2026-07-18

## Méthode de récupération

1. La page HTML est une SPA (shell Vite) : contenu non présent dans le HTML initial.
2. Analyse du bundle JS public : table Supabase `offres_emploi`.
3. Lecture via l’API REST publique du projet Supabase déjà utilisé par le site officiel (clé `anon` exposée dans le frontend de l’ancien site).
4. Téléchargement du PDF via l’URL Storage publique fournie par l’enregistrement.

Aucune authentification, CAPTCHA ou espace privé n’a été contourné.

## Fichier téléchargé

- Nom original : `1784241669013-offre-afd-chef-de-projet-et-officier-sante-nutrition.pdf`
- Emplacement Original : `C:\Users\IKAS\Documents\Banque des documents AFD\Offres-emploi\Chef-projet-Mambasa\Original\`
- Copie Web : `...\Web\chef-projet-mambasa-afd.pdf`
- Copie plateforme : `public/documents/offres/chef-de-projet-mambasa/chef-projet-mambasa-afd.pdf`
- Taille : 7 858 560 octets
- MIME : application/pdf
- URL source document :  
  `/documents/offres/chef-de-projet-mambasa/chef-projet-mambasa-afd.pdf`

## Extraction PDF

Le PDF (4 pages) est **scanné / image** : extraction texte `pypdf` = vide.  
Aucune mission, profil, compétence ou date limite n’a donc été inventée à partir du PDF.  
Le document reste téléchargeable tel quel pour consultation humaine.

## Informations extraites (vérifiées API `offres_emploi`)

| Champ | Valeur |
|-------|--------|
| id source | `2bac6964-f1be-4069-8b56-783dd57fb093` |
| titre (API) | Recrutement des postes |
| slug | `chef-de-projet-base-a-mambasa` |
| description | Chef de projet basé à MAMBASA et Officier Santé nutrition basé aussi à MAMBASA |
| lieu | MAMBASA |
| pays | RDC |
| published | true |
| published_at | 2026-07-16T22:56:18.063+00:00 |
| statut source | publie |
| pdf_url | (voir ci-dessus) |
| nombre_postes | 1 |
| type_contrat | *(chaîne vide)* |
| reference | *(chaîne vide)* |
| date_limite | `null` |
| duree | `null` |
| missions | `null` |
| profil | `null` |
| competences | `[]` |
| documents_requis | `[]` |
| salaire | `null` |
| province | `null` |

Contact RH visible sur la page recrutement de l’ancien site (mailto spontané) :  
`ressourceshumainesafd871@gmail.com` — utiliséé uniquement comme contact institutionnel de candidature, pas comme date limite.

## Informations absentes (donc `null` / non affichées)

- référence d’offre
- type de contrat
- durée
- date limite
- responsabilités détaillées (texte)
- profil recherché (texte)
- compétences listées
- niveau d’études
- expérience
- langues
- pièces à fournir (hors document PDF)
- procédure détaillée (hors formulaire plateforme)
- salaire
- province / territoire (hors « MAMBASA » / RDC)

## Différences page / document

- Le slug et l’URL mettent en avant « Chef de projet basé à Mambasa ».
- Le titre API est générique (« Recrutement des postes »).
- La description API et le nom du PDF mentionnent **deux** postes : Chef de projet **et** Officier Santé nutrition, tous deux à Mambasa.
- Sans texte extractible du PDF, le détail métier n’est pas retranscrit en HTML.

