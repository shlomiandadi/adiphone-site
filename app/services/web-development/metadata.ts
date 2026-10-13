import type { Metadata } from 'next';
import { absoluteUrl, DEFAULT_OG_IMAGE } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'בניית אתרים | Top Webstak | פיתוח אתרי תדמית, קטלוג ומערכות Web',
  description: 'זקוקים לאתר אינטרנט שמייצג אתכם בכבוד ומביא תוצאות? Top Webstak מתמחה בבניית אתרים מהירים, מאובטחים ומותאמים אישית. בואו נבנה יחד את הנוכחות הדיגיטלית שלכם.',
  alternates: {
    canonical: absoluteUrl('/services/web-development'),
  },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};