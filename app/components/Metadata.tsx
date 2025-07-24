import Head from 'next/head';

interface MetadataProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

export default function Metadata({ 
  title = 'Adi Phone - שירותי פיתוח אפליקציות ופיתוח אתרים',
  description = 'Adi Phone מספקת שירותי פיתוח אפליקציות, פיתוח אתרים, שירותי SEO ושירותי שיווק דיגיטלי. צוות מקצועי עם ניסיון רב בתעשייה.',
  canonicalUrl 
}: MetadataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://adi-phone.co.il';
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonicalUrl} />
    </Head>
  );
} 