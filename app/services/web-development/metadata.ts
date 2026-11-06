import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

const title = 'בניית אתרים לעסקים | Top Webstak';
const description =
  'דף נחיתה מ-2,500 ₪, אתר תדמית מ-6,500 ₪. עיצוב מותאם, מובייל ומהירות. חייגו 050-9159951';

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
  themeColor: '#03173A',
};
