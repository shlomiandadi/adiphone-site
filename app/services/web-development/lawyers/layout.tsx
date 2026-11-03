import { metadata as pageMetadata, viewport as pageViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/services/web-development/lawyers', pageMetadata);
export const viewport = pageViewport;

export default function LawyersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoAgentPageExtras path="/services/web-development/lawyers" />
      {children}
    </>
  );
}
