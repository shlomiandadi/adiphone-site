import { SeoAgentPageExtras } from '@/seo-agent-apply';

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/thank-you" />
      {children}
    </>
  );
}
