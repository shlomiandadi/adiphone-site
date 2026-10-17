import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'פתרונות תוכנה לעסקים | Top Webstak | ייעוץ, אינטגרציה והתאמה אישית',
  description: 'מחפשים פתרון תוכנה שיפתור בעיה עסקית? Top Webstak מתמחה באפיון, ייעוץ ובחירת פתרונות תוכנה, אינטגרציה בין מערכות וחיבורן לעסק שלכם.',
  alternates: {
    canonical: absoluteUrl('/services/software-development'),
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#03173A',
}; 