import { homeFaqItems } from '../data/homeFaq';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://adi-phone.co.il';
const description =
  'Top Webstak - פתרונות דיגיטליים מקצועיים לעסקים: פיתוח אתרים, קידום SEO, בניית חנויות אונליין, פיתוח אפליקציות, עיצוב UI/UX ושיווק דיגיטלי. צוות מומחים עם ניסיון של למעלה מ-15 שנה.';

export default function HomeSchema() {
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'DigitalMarketingAgency',
      name: 'Top Webstak בנייה וקידום אתרים',
      url: siteUrl,
      description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'עדי פון תקשורת',
      alternateName: 'Top Webstak בנייה וקידום אתרים',
      url: siteUrl,
      description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: siteUrl,
      name: 'Top Webstak בנייה וקידום אתרים',
      description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Top Webstak בנייה וקידום אתרים',
      alternateName: 'עדי פון תקשורת',
      description,
      url: siteUrl,
      telephone: '+972-50-9159951',
      email: 'adiphoneseo@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'זמיר 95',
        addressLocality: 'פרדס חנה-כרכור',
        addressCountry: 'IL',
      },
      areaServed: [
        'פרדס חנה-כרכור',
        'חדרה',
        'קיסריה',
        'זכרון יעקב',
        'בנימינה',
        'חיפה',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: homeFaqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
