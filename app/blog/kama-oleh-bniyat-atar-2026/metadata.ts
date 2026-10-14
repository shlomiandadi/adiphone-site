import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

const path = '/blog/kama-oleh-bniyat-atar-2026';

export const metadata: Metadata = {
  title: { absolute: 'כמה עולה בניית אתר ב-2026? טווחי מחירים | Top Webstak' },
  description:
    'כמה עולה בניית אתר ב-2026 בישראל: דף נחיתה מ-2,500 ₪, אתר תדמית מ-6,500 ₪, חנות מ-12,000 ₪ ומערכת מ-20,000 ₪. טבלה, מה משפיע על המחיר ושאלות נפוצות.',
  keywords: 'כמה עולה בניית אתר, מחיר בניית אתר 2026, מחירון אתרים, אתר תדמית מחיר, דף נחיתה מחיר',
  alternates: {
    canonical: path,
  },
  openGraph: {
    title: 'כמה עולה בניית אתר ב-2026? | Top Webstak',
    description: 'טווחי מחירים שקופים לדף נחיתה, אתר תדמית, חנות ומערכת – לפי המחירון של Top Webstak.',
    url: absoluteUrl(path),
    type: 'article',
    locale: 'he_IL',
    siteName: 'Top Webstak',
  },
};
