import { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';
import { SERVICE_DOCUMENT_TITLES } from '../../../lib/serviceTitles';

export const metadata: Metadata = {
  title: { absolute: SERVICE_DOCUMENT_TITLES.ecommerce },
  description: 'רוצים למכור אונליין? Top Webstak מתמחה בהקמת חנויות אינטרנטיות (איקומרס) ממירות, מאובטחות וקלות לניהול. מהקמת החנות ועד שיווק וקידום. התחילו למכור עוד היום!',
  alternates: {
    canonical: absoluteUrl('/services/ecommerce'),
  },
  openGraph: {
    title: 'הקמת חנויות אינטרנטיות (Ecommerce) | Top Webstak | פתרונות מסחר מתקדמים',
    description: 'רוצים למכור אונליין? Top Webstak מתמחה בהקמת חנויות אינטרנטיות (איקומרס) ממירות, מאובטחות וקלות לניהול. מהקמת החנות ועד שיווק וקידום. התחילו למכור עוד היום!',
    type: 'website',
    locale: 'he_IL',
    siteName: 'Top Webstak',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'הקמת חנויות אינטרנטיות (Ecommerce) | Top Webstak | פתרונות מסחר מתקדמים',
    description: 'רוצים למכור אונליין? Top Webstak מתמחה בהקמת חנויות אינטרנטיות (איקומרס) ממירות, מאובטחות וקלות לניהול. מהקמת החנה ועד שיווק וקידום. התחילו למכור עוד היום!',
  },
}; 