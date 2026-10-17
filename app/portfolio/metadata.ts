import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'תיק עבודות – אתרים וחנויות שבנינו | Top Webstak' },
  description: 'גלו את תיק העבודות שלנו - פרויקטים מוצלחים של פיתוח אתרים, בניית חנויות אונליין, אפליקציות מובייל ועוד. דוגמאות אמיתיות לעבודות מקצועיות.',
  keywords: 'תיק עבודות, פרויקטים, דוגמאות, אתרים, חנויות, אפליקציות, תיק פורטפוליו, Top Webstak',
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: 'תיק עבודות – אתרים וחנויות שבנינו | Top Webstak',
    description: 'גלו את תיק העבודות שלנו - פרויקטים מוצלחים של פיתוח אתרים, בניית חנויות אונליין, אפליקציות מובייל ועוד.',
    type: 'website',
    locale: 'he_IL',
    siteName: 'Top Webstak',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#03173A',
};
