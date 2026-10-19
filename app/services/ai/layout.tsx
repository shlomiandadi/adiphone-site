import { metadata as serviceMetadata, viewport as serviceViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';
import { SERVICE_DOCUMENT_TITLES } from '@/lib/serviceTitles';

export const generateMetadata = createSeoAgentGenerateMetadata(
  '/services/ai',
  serviceMetadata,
  SERVICE_DOCUMENT_TITLES.ai
);
export const viewport = serviceViewport;

export default function AILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/services/ai" />
      {children}
    </>
  );
}
