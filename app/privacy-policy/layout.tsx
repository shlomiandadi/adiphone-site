import { SeoAgentPageExtras } from '@/seo-agent-apply';

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoAgentPageExtras path="/privacy-policy" />
      {children}
    </>
  );
}
