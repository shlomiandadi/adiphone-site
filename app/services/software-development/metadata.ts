import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'פיתוח תוכנה בהתאמה אישית | Top Webstak | בניית מערכות Web ו-Desktop',
  description: 'כאשר תוכנת מדף לא מספיקה, אנחנו בונים לכם פתרון ייעודי. Top Webstak מתמחה בפיתוח תוכנה (Software Development) מאפס, המותאם 100% לצרכים של העסק שלכם.',
  alternates: {
    canonical: absoluteUrl('/services/software-development'),
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
}; 