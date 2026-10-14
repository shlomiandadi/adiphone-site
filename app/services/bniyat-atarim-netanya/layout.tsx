import { metadata as pageMetadata, viewport as pageViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/services/bniyat-atarim-netanya', pageMetadata);
export const viewport = pageViewport;

export default function BniyatAtarimNetanyaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/services/bniyat-atarim-netanya" />
      {children}
    </>
  );
}
