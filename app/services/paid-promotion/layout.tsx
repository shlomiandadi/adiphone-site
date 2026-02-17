import { metadata as serviceMetadata, viewport as serviceViewport } from './metadata';

export const metadata = serviceMetadata;
export const viewport = serviceViewport;

export default function PaidPromotionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
