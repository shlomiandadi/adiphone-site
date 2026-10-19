import { metadata as serviceMetadata } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/services/ecommerce', serviceMetadata);

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
