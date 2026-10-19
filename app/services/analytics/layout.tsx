import { metadata as serviceMetadata, viewport as serviceViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';
import { SERVICE_DOCUMENT_TITLES } from '@/lib/serviceTitles';

export const generateMetadata = createSeoAgentGenerateMetadata(
  '/services/analytics',
  serviceMetadata,
  SERVICE_DOCUMENT_TITLES.analytics
);
export const viewport = serviceViewport;

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/services/analytics" />
      {children}
    </>
  );
}
