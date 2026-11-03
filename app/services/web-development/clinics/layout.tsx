import { metadata as pageMetadata, viewport as pageViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/services/web-development/clinics', pageMetadata);
export const viewport = pageViewport;

export default function ClinicsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoAgentPageExtras path="/services/web-development/clinics" />
      {children}
    </>
  );
}
