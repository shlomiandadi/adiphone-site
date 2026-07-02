import { homeFaqItems } from '../data/homeFaq';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://adi-phone.co.il';
const description =
  'Top Webstak - פתרונות דיגיטליים מקצועיים לעסקים: פיתוח אתרים, קידום SEO, בניית חנויות אונליין, פיתוח אפליקציות, עיצוב UI/UX ושיווק דיגיטלי. צוות מומחים עם ניסיון של למעלה מ-15 שנה.';

export default function HomeSchema() {
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'DigitalMarketingAgency',
      name: 'Top WebStack בנייה וקידום אתרים',
      url: siteUrl,
      description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'עדי פון תקשורת',
      alternateName: 'Top WebStack בנייה וקידום אתרים',
      url: siteUrl,
      description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: siteUrl,
      name: 'Top WebStack בנייה וקידום אתרים',
      description,
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
