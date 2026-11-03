import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'קידום אתרים ושירותי SEO לעסקים | Top Webstak',
  description:
    'מחפשים קידום אתרים אורגני שמביא תוצאות? Top Webstak בונה אסטרטגיית SEO מלאה: מחקר מילות מפתח, אופטימיזציה טכנית, תוכן ובניית קישורים.',
  alternates: {
    canonical: absoluteUrl('/services/seo'),
  },
  openGraph: {
    title: 'שירותי SEO וקידום אתרים אורגני | Top Webstak',
    description:
      'אסטרטגיית SEO מלאה לעסקים: מחקר, טכני, תוכן וקישורים — עם מדידה ושקיפות.',
    url: absoluteUrl('/services/seo'),
    type: 'website',
    locale: 'he_IL',
    siteName: 'Top Webstak',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#03173A',
};
