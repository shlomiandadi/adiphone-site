import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: { absolute: 'בניית אתר תדמית | Top Webstak' },
  description:
    'בניית אתר תדמית ובניית אתרי תדמית לעסקים: עמודים ברורים, התאמה לנייד ותשתית לגוגל. מה כלול, איך התהליך עובד, ודוגמאות מהתיק. שיחת ייעוץ של 15 דקות.',
  keywords:
    'בניית אתר תדמית, בניית אתרי תדמית, אתר תדמית לעסק, אתר תדמית, Top Webstak, עדי פון תקשורת',
  alternates: {
    canonical: absoluteUrl('/services/website-tadmit'),
  },
  openGraph: {
    title: 'בניית אתר תדמית | Top Webstak',
    description:
      'בניית אתר תדמית לעסק: מבנה ברור, התאמה לנייד, ודוגמאות אמיתיות מהתיק. שיחת ייעוץ של 15 דקות.',
    url: absoluteUrl('/services/website-tadmit'),
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
