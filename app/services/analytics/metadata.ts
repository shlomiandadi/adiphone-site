import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';
import { SERVICE_DOCUMENT_TITLES } from '../../../lib/serviceTitles';

export const metadata: Metadata = {
  title: { absolute: SERVICE_DOCUMENT_TITLES.analytics },
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