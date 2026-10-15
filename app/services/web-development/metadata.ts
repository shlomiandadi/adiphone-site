import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

const title = 'בניית אתר תדמית לעסקים | בהתאמה אישית | Top Webstak';
const description =
  'זקוקים לאתר תדמית מקצועי? אנו ב-Top Webstak מתמחים בבניית אתרים בהתאמה אישית לעסקים, המעוצבים בקפידה ומותאמים לצרכים הייחודיים שלכם. צרו קשר עוד היום!';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: absoluteUrl('/services/web-development'),
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl('/services/web-development'),
    type: 'website',
    locale: 'he_IL',
    siteName: 'Top Webstak',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};
