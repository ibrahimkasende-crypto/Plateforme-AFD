import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  image?: string;
}

const siteName = 'Alliance des Femmes pour le Développement';

function setMeta(selector: string, attribute: 'name' | 'property', content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, selector.replace(`[${attribute}="`, '').replace('"]', ''));
    document.head.appendChild(element);
  }
  element.content = content;
}

export function usePageMeta({ title, description, image }: PageMeta) {
  useEffect(() => {
    document.title = `${title} | ${siteName}`;
    setMeta('meta[name="description"]', 'name', description);
    setMeta('meta[property="og:title"]', 'property', `${title} | ${siteName}`);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[property="og:type"]', 'property', 'website');
    setMeta('meta[name="twitter:card"]', 'name', 'summary_large_image');
    if (image) setMeta('meta[property="og:image"]', 'property', image);
  }, [description, image, title]);
}
