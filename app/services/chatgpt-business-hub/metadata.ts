import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'הקמת עסק ב-ChatGPT Business Hub | Top Webstak',
  description:
    'תביעה, אימות והקמת פרופיל עסקי ב-ChatGPT Business Hub: עדכון פרטים ומעקב אחרי אזכורים וקליקים לאתר ב-Insights. שירות לעסקים בישראל, Top Webstak.',
  keywords:
    'ChatGPT Business Hub, פרופיל עסקי ב-ChatGPT, הקמת עסק ב-ChatGPT, ChatGPT לעסקים, Businesses in ChatGPT, Business Hub, Top Webstak',
  alternates: {
    canonical: absoluteUrl('/services/chatgpt-business-hub'),
  },
  openGraph: {
    title: 'הקמת עסק ב-ChatGPT Business Hub | Top Webstak',
    description:
      'תביעה, אימות והקמת פרופיל עסקי ב-ChatGPT Business Hub: עדכון פרטים ומעקב אחרי אזכורים וקליקים לאתר.',
    url: absoluteUrl('/services/chatgpt-business-hub'),
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
