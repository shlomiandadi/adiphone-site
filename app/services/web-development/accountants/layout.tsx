import { metadata as pageMetadata, viewport as pageViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/services/web-development/accountants', pageMetadata);
export const viewport = pageViewport;

export default function AccountantsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoAgentPageExtras path="/services/web-development/accountants" />
      {children}
    </>
  );
}
