import { metadata as privacyMetadata } from './page';

export const metadata = privacyMetadata;

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
