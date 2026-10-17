import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'פיתוח אפליקציות iOS ואנדרואיד | Top Webstak | הופכים רעיון למציאות',
  description: 'מחפשים חברה לפיתוח אפליקציות? Top Webstak מתמחה בפיתוח אפליקציות נייטיב והיברידיות בהתאמה אישית, משלב האפיון ועד ההשקה בחנויות.',
  alternates: {
    canonical: absoluteUrl('/services/mobile-apps'),
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#03173A',
}; 