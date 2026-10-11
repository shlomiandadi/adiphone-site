import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'בניית אתרים בפרדס חנה לעסקים | Top Webstak – 050-9159951',
  description:
    'בניית אתרים בפרדס חנה והסביבה: אתרי תדמית וחנויות אונליין מהירים, מותאמים לנייד וידידותיים לגוגל. סוכנות מקומית מפרדס חנה. לייעוץ והצעת מחיר חייגו 050-9159951.',
  keywords:
    'בניית אתרים פרדס חנה, בניית אתרים פרדס חנה כרכור, בניית אתר לעסק פרדס חנה, בניית אתרים חדרה, בניית אתרים קיסריה, Top Webstak',
  alternates: {
    canonical: absoluteUrl('/services/bniyat-atarim-pardes-hana'),
  },
  openGraph: {
    title: 'בניית אתרים בפרדס חנה לעסקים | Top Webstak',
    description:
      'סוכנות מקומית לבניית אתרים בפרדס חנה והסביבה: אתרי תדמית, חנויות אונליין ווורדפרס. לייעוץ והצעת מחיר: 050-9159951.',
    url: absoluteUrl('/services/bniyat-atarim-pardes-hana'),
    type: 'website',
    locale: 'he_IL',
    siteName: 'Top Webstak',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};
