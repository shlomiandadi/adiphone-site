import { metadata as pageMetadata, viewport as pageViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/services/website-tadmit', pageMetadata);
export const viewport = pageViewport;

export default function WebsiteTadmitLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoAgentPageExtras path="/services/website-tadmit" />
      {children}
    </>
  );
}
