import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'שירותי בינה מלאכותית (AI) לעסקים | Top Webstak | פתרונות AI מתקדמים',
  description: 'רוצים למנף את הכוח של בינה מלאכותית (AI) בעסק שלכם? Top Webstak מפתחת ומטמיעה פתרונות AI חכמים לאופטימיזציה, הגדלת מכירות ושיפור חווית הלקוח.',
  alternates: {
    canonical: absoluteUrl('/services/ai'),
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
}; 