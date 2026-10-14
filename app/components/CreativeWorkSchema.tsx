import { getSiteUrl } from '../../lib/seo';

interface CreativeWorkSchemaProps {
  name: string;
  description?: string | null;
  image?: string | string[] | null;
  url: string;
  dateCreated?: string | Date | null;
  keywords?: string[] | null;
}

export default function CreativeWorkSchema({
  name,
  description,
  image,
  url,
  dateCreated,
  keywords,
}: CreativeWorkSchemaProps) {
  const siteUrl = getSiteUrl();
  const images = Array.isArray(image) ? image.filter(Boolean) : image ? [image] : [];
  const absoluteImages = images.map((src) =>
    src.startsWith('http') ? src : `${siteUrl}${src.startsWith('/') ? '' : '/'}${src}`
  );

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description: description || undefined,
    image: absoluteImages.length === 1 ? absoluteImages[0] : absoluteImages.length ? absoluteImages : undefined,
    url: url.startsWith('http') ? url : `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`,
    dateCreated: dateCreated
      ? (typeof dateCreated === 'string' ? dateCreated : dateCreated.toISOString())
      : undefined,
    keywords: keywords && keywords.length ? keywords.join(', ') : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
