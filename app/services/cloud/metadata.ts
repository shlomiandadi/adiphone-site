import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'שירותי ענן לעסקים | Top Webstak | פתרונות Cloud, אבטחה ו-DevOps',
  description: 'מעבירים את העסק לענן? Top Webstak מספקת שירותי ענן מלאים: תכנון, הגירה, ניהול ואבטחה ב-AWS, Google Cloud ו-Azure, עם חיסכון בעלויות.',
  alternates: {
    canonical: absoluteUrl('/services/cloud'),
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#03173A',
}; 