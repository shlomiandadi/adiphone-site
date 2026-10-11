import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'קידום במנועי AI – AEO ו-GEO לעסקים | Top Webstak',
  description:
    'מה זה AEO ו-GEO? אופטימיזציה שגורמת לעסק שלכם להופיע בתשובות של מנועי AI כמו ChatGPT, Google AI Overviews ו-Perplexity. לייעוץ חייגו 050-9159951.',
  keywords:
    'AEO, GEO, קידום AEO, מה זה AEO, קידום GEO, קידום במנועי AI, Answer Engine Optimization, Generative Engine Optimization, Top Webstak',
  alternates: {
    canonical: absoluteUrl('/services/aeo-geo'),
  },
  openGraph: {
    title: 'קידום במנועי AI – AEO ו-GEO לעסקים | Top Webstak',
    description:
      'אופטימיזציה שגורמת לעסק שלכם להופיע בתשובות של מנועי AI כמו ChatGPT, Google AI Overviews ו-Perplexity.',
    url: absoluteUrl('/services/aeo-geo'),
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
