import { metadata as contactMetadata, viewport as contactViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';
import { buildLocalBusinessJsonLd } from '../../lib/local-business-schema';
import { getSiteUrl } from '../../lib/seo';

export const generateMetadata = createSeoAgentGenerateMetadata('/contact', contactMetadata);
export const viewport = contactViewport;

const localBusinessSchema = buildLocalBusinessJsonLd({
  url: `${getSiteUrl()}/contact`,
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <SeoAgentPageExtras path="/contact" />
      {children}
    </>
  );
}
