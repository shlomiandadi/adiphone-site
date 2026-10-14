import { metadata as pageMetadata } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata(
  '/blog/kama-oleh-bniyat-atar-2026',
  pageMetadata
);

export default function WebsiteCostGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/blog/kama-oleh-bniyat-atar-2026" />
      {children}
    </>
  );
}
