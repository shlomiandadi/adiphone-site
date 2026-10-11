import { metadata as servicesMetadata, viewport as servicesViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/services', servicesMetadata);
export const viewport = servicesViewport;

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/services" />
      {children}
    </>
  );
}
