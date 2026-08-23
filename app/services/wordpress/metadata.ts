import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'פיתוח אתרי וורדפרס | Top Webstak | מומחים לבניית אתרי WordPress',
  description:
    'מחפשים מומחי וורדפרס? Top Webstak מתמחה בבניית אתרי וורדפרס מותאמים אישית, מהירים ומאובטחים. פתרון גמיש וחזק לאתרי תדמית, בלוגים וחנויות.',
  alternates: {
    canonical: absoluteUrl('/services/wordpress'),
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};
