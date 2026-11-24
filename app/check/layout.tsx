import { metadata as pageMetadata, viewport as pageViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/check', pageMetadata);
export const viewport = pageViewport;

export default function CheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/check" />
      {children}
    </>
  );
}
