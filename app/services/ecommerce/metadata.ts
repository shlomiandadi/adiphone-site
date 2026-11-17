import { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

const title = 'בניית חנות אינטרנטית לעסקים | Top Webstak | פתרונות מסחר מתקדמים';
const description =
  'בניית חנות אינטרנטית לעסקים: חנות אונליין ממירה, מאובטחת וקלה לניהול. מעיצוב ועד סליקה וקידום עם Top Webstak.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: absoluteUrl('/services/ecommerce'),
  },
  openGraph: {
    title,
    description,
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