import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';
import { SERVICE_DOCUMENT_TITLES } from '../../../lib/serviceTitles';

export const metadata: Metadata = {
  title: { absolute: SERVICE_DOCUMENT_TITLES.ai },
  description: 'רוצים למנף את הכוח של בינה מלאכותית (AI) בעסק שלכם? Top Webstak מפתחת ומטמיעה פתרונות AI חכמים לאופטימיזציה, הגדלת מכירות ושיפור חווית הלקוח.',
  alternates: {
    canonical: absoluteUrl('/services/ai'),
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#03173A',
}; 