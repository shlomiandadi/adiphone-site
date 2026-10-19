import { metadata as serviceMetadata } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';
import { SERVICE_DOCUMENT_TITLES } from '@/lib/serviceTitles';

export const generateMetadata = createSeoAgentGenerateMetadata(
  '/services/ecommerce',
  serviceMetadata,
  SERVICE_DOCUMENT_TITLES.ecommerce
);

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/services/ecommerce" />
      {children}
    </>
  );
}
