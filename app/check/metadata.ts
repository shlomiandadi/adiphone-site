import type { Metadata } from 'next';
import { absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'בדיקת אתר חינם',
  description:
    'בדיקת אתר חינם תוך 24 שעות מ-Top Webstak: מהירות ומובייל, נראות בגוגל וב-AI, וחסמי המרה ולידים. השאירו כתובת אתר וטלפון.',
  keywords:
    'בדיקת אתר חינם, בדיקת אתר, מהירות אתר, מובייל, נראות בגוגל, AI, המרות, לידים, Top Webstak',
  alternates: {
    canonical: absoluteUrl('/check'),
  },
  openGraph: {
    title: 'בדיקת אתר חינם | Top Webstak',
    description:
      'בדיקת אתר חינם תוך 24 שעות: מהירות ומובייל, נראות בגוגל וב-AI, וחסמי המרה ולידים.',
    url: absoluteUrl('/check'),
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
