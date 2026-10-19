import { metadata as serviceMetadata, viewport as serviceViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';
import { SERVICE_DOCUMENT_TITLES } from '@/lib/serviceTitles';

export const generateMetadata = createSeoAgentGenerateMetadata(
  '/services/software-development',
  serviceMetadata,
  SERVICE_DOCUMENT_TITLES.softwareDevelopment
);
export const viewport = serviceViewport;

export default function SoftwareDevelopmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/services/software-development" />
      {children}
    </>
  );
}
