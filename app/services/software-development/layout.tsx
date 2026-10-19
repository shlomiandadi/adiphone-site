import { metadata as serviceMetadata, viewport as serviceViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/services/software-development', serviceMetadata);
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
