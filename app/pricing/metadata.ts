import type { Metadata } from 'next';
import { absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'מחירון בניית אתרים',
  description:
    'כמה עולה לבנות אתר? מחירון בניית אתרים של Top Webstak: דף נחיתה מ-2,500 ₪, אתר תדמית מ-6,500 ₪, חנות מ-12,000 ₪ ומערכת מ-20,000 ₪ + מע״מ. שקיפות מלאה, בלי הפתעות.',
  keywords:
    'מחירון בניית אתרים, כמה עולה לבנות אתר, מחיר בניית אתר, בניית אתר מחיר, Top Webstak',
  alternates: {
    canonical: absoluteUrl('/pricing'),
  },
  openGraph: {
    title: 'מחירון בניית אתרים | Top Webstak',
    description:
      'מחירים התחלתיים שקופים לבניית אתר: דף נחיתה, אתר תדמית, חנות אונליין ופיתוח מותאם. כל המחירים + מע״מ.',
    url: absoluteUrl('/pricing'),
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
