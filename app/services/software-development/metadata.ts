import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';
import { SERVICE_DOCUMENT_TITLES } from '../../../lib/serviceTitles';

export const metadata: Metadata = {
  title: { absolute: SERVICE_DOCUMENT_TITLES.softwareDevelopment },
  description: 'כאשר תוכנת מדף לא מספיקה, אנחנו בונים לכם פתרון ייעודי. Top Webstak מתמחה בפיתוח תוכנה (Software Development) מאפס, המותאם 100% לצרכים של העסק שלכם.',
  alternates: {
    canonical: absoluteUrl('/services/software-development'),
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#03173A',
}; 