import { metadata as pageMetadata, viewport as pageViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/services/chatgpt-ads', pageMetadata);
export const viewport = pageViewport;

export default function ChatGptAdsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoAgentPageExtras path="/services/chatgpt-ads" />
      {children}
    </>
  );
}
