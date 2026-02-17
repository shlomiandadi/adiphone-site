import { metadata as accessibilityMetadata } from './page';

export const metadata = accessibilityMetadata;

export default function AccessibilityStatementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
