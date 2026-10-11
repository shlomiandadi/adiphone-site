import { metadata as serviceMetadata, viewport as serviceViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/services/web-development', serviceMetadata);
export const viewport = serviceViewport;

export default function WebDevelopmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/services/web-development" />
      {children}
    </>
  );
}
