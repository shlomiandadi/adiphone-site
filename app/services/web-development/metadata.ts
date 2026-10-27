import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

const title = 'בניית אתר תדמית לעסקים | בהתאמה אישית | Top Webstak';
const description =
  'בניית אתר תדמית לעסק: עיצוב מותאם, התאמה מלאה לנייד ומהירות. אתר ממוקד מוכן לרוב תוך 14–21 יום כשהתכנים מוכנים. חייגו 050-9159951';

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
