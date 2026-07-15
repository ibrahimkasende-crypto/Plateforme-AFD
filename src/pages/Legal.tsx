import { useLocation } from 'react-router-dom';
import { PageHero } from '../components/common';
import { Card, Container, Section } from '../components/ui';
import { usePageMeta } from '../hooks/usePageMeta';

const legalSections = {
  '/mentions-legales': {
    title: 'Mentions légales',
    description: 'Informations légales relatives au site de l’Alliance des Femmes pour le Développement.',
    items: [['Éditeur du site', 'Alliance des Femmes pour le Développement (AFD). Les informations d’immatriculation et l’adresse complète doivent être complétées et validées par l’organisation.'], ['Responsabilité éditoriale', 'La personne responsable de la publication doit être renseignée par l’organisation.'], ['Hébergement', 'Les informations relatives à l’hébergeur doivent être complétées avant publication.']],
  },
  '/politique-confidentialite': {
    title: 'Politique de confidentialité',
    description: 'Comment l’AFD traite les données personnelles collectées via ce site.',
    items: [['Données collectées', 'Les formulaires peuvent collecter les coordonnées et le contenu nécessaire au traitement d’une demande.'], ['Finalités', 'Ces données servent à répondre aux messages, traiter les demandes d’adhésion ou suivre les intentions de don.'], ['Conservation et droits', 'Les durées de conservation, le contact responsable et les modalités d’exercice des droits doivent être complétés et validés par l’organisation.'], ['Cookies', 'Les éventuels cookies non essentiels seront présentés avec un mécanisme de consentement avant leur activation.']],
  },
};

export default function Legal() {
  const location = useLocation();
  const content = legalSections[location.pathname as keyof typeof legalSections] ?? legalSections['/mentions-legales'];
  usePageMeta({ title: content.title, description: content.description });
  return <div><PageHero title={content.title} description={content.description} /><Section><Container className="max-w-4xl"><div className="space-y-5">{content.items.map(([heading, text]) => <Card key={heading} className="p-7"><h2 className="text-xl font-bold">{heading}</h2><p className="mt-3 leading-7 text-brand-muted">{text}</p></Card>)}</div></Container></Section></div>;
}
