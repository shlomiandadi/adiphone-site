import { metadata as serviceMetadata } from './metadata';

export const metadata = serviceMetadata;

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
