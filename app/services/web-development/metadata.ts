import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: { absolute: 'בניית אתרים ואתרי תדמית | Top Webstak' },
  description:
    'בניית אתרים ואתרי תדמית לעסקים: תהליך עבודה, מה כלול באתר, וקישור למדריך העלות ל-2026. אתר מהיר ומותאם לנייד. שיחת ייעוץ של 15 דקות.',
  alternates: {
    canonical: absoluteUrl('/services/web-development'),
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};
