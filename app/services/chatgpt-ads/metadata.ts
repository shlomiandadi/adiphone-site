import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'פרסום ממומן ב-ChatGPT | Top Webstak',
  description:
    'פרסום ממומן ב-ChatGPT לעסקים בישראל: הקמת חשבון, מודעות ומדידה ב-Ads Manager. תקציב המדיה ל-OpenAI נפרד מדמי הניהול. Top Webstak אינה קשורה ל-OpenAI.',
  keywords:
    'ChatGPT Ads, פרסום ממומן ב-ChatGPT, פרסום ב-ChatGPT, ChatGPT Ads Manager, מודעות ב-ChatGPT, קמפיין ב-ChatGPT, Top Webstak',
  alternates: {
    canonical: absoluteUrl('/services/chatgpt-ads'),
  },
  openGraph: {
    title: 'פרסום ממומן ב-ChatGPT | Top Webstak',
    description:
      'פרסום ממומן ב-ChatGPT לעסקים בישראל: הקמת חשבון, מודעות ומדידה ב-Ads Manager. תקציב המדיה ל-OpenAI נפרד מדמי הניהול.',
    url: absoluteUrl('/services/chatgpt-ads'),
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
