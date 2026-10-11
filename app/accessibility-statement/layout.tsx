import { SeoAgentPageExtras } from '@/seo-agent-apply';

export default function AccessibilityStatementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/accessibility-statement" />
      {children}
    </>
  );
}
