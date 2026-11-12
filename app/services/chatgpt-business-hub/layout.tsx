import { metadata as pageMetadata, viewport as pageViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata(
  '/services/chatgpt-business-hub',
  pageMetadata
);
export const viewport = pageViewport;

export default function ChatGptBusinessHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoAgentPageExtras path="/services/chatgpt-business-hub" />
      {children}
    </>
  );
}
