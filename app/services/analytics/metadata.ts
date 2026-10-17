import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'שירותי אנליטיקס וניתוח נתונים | Top Webstak | קבלת החלטות מבוססות דאטה',
  description: 'הפסיקו לנחש והתחילו למדוד! Top Webstak מספקת שירותי אנליטיקס מתקדמים להבנת קהל היעד, שיפור ביצועים והגדלת ROI. הפכו את הנתונים שלכם לתובנות עסקיות קריטיות.',
  alternates: {
    canonical: absoluteUrl('/services/analytics'),
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#03173A',
}; 