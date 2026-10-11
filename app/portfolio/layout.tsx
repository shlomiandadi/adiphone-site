import { metadata as portfolioMetadata, viewport as portfolioViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/portfolio', portfolioMetadata);
export const viewport = portfolioViewport;

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/portfolio" />
      {children}
    </>
  );
}
