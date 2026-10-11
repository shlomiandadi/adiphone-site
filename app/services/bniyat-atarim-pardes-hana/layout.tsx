import { metadata as pageMetadata, viewport as pageViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

export const generateMetadata = createSeoAgentGenerateMetadata('/services/bniyat-atarim-pardes-hana', pageMetadata);
export const viewport = pageViewport;

export default function BniyatAtarimPardesHanaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/services/bniyat-atarim-pardes-hana" />
      {children}
    </>
  );
}
