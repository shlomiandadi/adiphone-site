import { metadata as contactMetadata, viewport as contactViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/contact', contactMetadata);
export const viewport = contactViewport;

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/contact" />
      {children}
    </>
  );
}
