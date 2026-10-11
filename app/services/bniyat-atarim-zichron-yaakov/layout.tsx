import { metadata as pageMetadata, viewport as pageViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/services/bniyat-atarim-zichron-yaakov', pageMetadata);
export const viewport = pageViewport;

export default function BniyatAtarimZichronLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/services/bniyat-atarim-zichron-yaakov" />
      {children}
    </>
  );
}
