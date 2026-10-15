import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

const title = 'אתרי תדמית לעסקים – מחירים, תהליך ודוגמאות | Top Webstak';
const description =
  'אתרי תדמית לעסקים: מחירים, תהליך העבודה ודוגמאות מהתיק. מה כלול באתר, התאמה לנייד, ושיחת ייעוץ של 15 דקות.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: 'בניית אתרי תדמית, אתר תדמית לעסק, אתר תדמית, Top Webstak, עדי פון תקשורת',
  alternates: {
    canonical: absoluteUrl('/services/website-tadmit'),
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl('/services/website-tadmit'),
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
